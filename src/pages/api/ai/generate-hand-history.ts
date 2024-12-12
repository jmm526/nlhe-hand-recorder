import { gptInstructions, nlheRulesPrompt, rawTextPruningPrompt } from "@/server/ai/prompts";
import { aiClient } from "@/server/clients/openai";
import {
  fixActions,
  generateStackSizes,
  positionOrder6max,
  positionOrder9max,
} from "@/server/helpers";
import { handHistorySchema, IAction, IHandHistory } from "@/server/models";
import type { NextApiRequest, NextApiResponse } from "next";

// TODO: Add a showdown key that contains all of the hands that are shown down.

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { smallBlind, bigBlind, playerCount, rawHistory, stackSizes } =
    req.body;

  const fixedStackSizes = generateStackSizes(bigBlind, playerCount, stackSizes);

  try {
    const prunedHistory = await aiClient.chat.completions.create({
      messages: [
        { role: "system", content: rawTextPruningPrompt },
        { role: "user", content: rawHistory },
      ],
      model: "gpt-4o-mini",
    });

    const promptInfo = {
      small_blind: smallBlind,
      big_blind: bigBlind,
      player_count: playerCount,
      stack_sizes: fixedStackSizes,
      raw_history: prunedHistory.choices[0].message.content,
    };

    console.log("promptInfo: ", promptInfo);

    const aiResponse = await aiClient.chat.completions.create({
      messages: [
        { role: "system", content: gptInstructions },
        { role: "user", content: JSON.stringify(promptInfo) },
      ],
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
    });

    const validatedHandHistory: IHandHistory = handHistorySchema.parse(
      JSON.parse(aiResponse.choices[0].message.content || "{}")
    );

    // Fix Actions
    // PF
    const { actions: fixedPreflopActions, stackSizes: fixedPreflopStackSizes } =
      fixActions(
        validatedHandHistory.blinds.small_blind,
        validatedHandHistory.blinds.big_blind,
        playerCount === 9 ? positionOrder9max : positionOrder6max,
        validatedHandHistory.Preflop,
        fixedStackSizes,
        true,
        validatedHandHistory.blinds.straddle
      );

    const { actions: fixedFlopActions, stackSizes: fixedFlopStackSizes } =
      fixActions(
        validatedHandHistory.blinds.small_blind,
        validatedHandHistory.blinds.big_blind,
        fixedPreflopStackSizes.map((ss) => ss.position),
        validatedHandHistory.Flop.actions,
        fixedPreflopStackSizes,
        false
      );

    let fixedTurnActions: IAction[] = [];
    let fixedRiverActions: IAction[] = [];
    if (validatedHandHistory.Turn) {
      const { actions: tempFixedTurnActions, stackSizes: fixedTurnStackSizes } =
        fixActions(
          validatedHandHistory.blinds.small_blind,
          validatedHandHistory.blinds.big_blind,
          fixedFlopStackSizes.map((ss) => ss.position),
          validatedHandHistory.Turn.actions,
          fixedFlopStackSizes,
          false
        );
      fixedTurnActions = tempFixedTurnActions;

      if (validatedHandHistory.River) {
        const { actions: tempFixedRiverActions } = fixActions(
          validatedHandHistory.blinds.small_blind,
          validatedHandHistory.blinds.big_blind,
          fixedTurnStackSizes.map((ss) => ss.position),
          validatedHandHistory.River.actions,
          fixedTurnStackSizes,
          false
        );
        fixedRiverActions = tempFixedRiverActions;
      }
    }

    const fixedHandHistory: IHandHistory = {
      ...validatedHandHistory,
      player_count: playerCount,
      Preflop: fixedPreflopActions,
      Flop: {
        actions: fixedFlopActions,
        flop: validatedHandHistory.Flop.flop,
      },
      Turn: {
        actions: fixedTurnActions,
        card: validatedHandHistory?.Turn?.card || null,
      },
      River: {
        actions: fixedRiverActions,
        card: validatedHandHistory?.River?.card || null,
      },
    };

    res.status(200).json({ handHistory: fixedHandHistory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }

  res.status(200).json({ message: "Hand history generated" });
}
