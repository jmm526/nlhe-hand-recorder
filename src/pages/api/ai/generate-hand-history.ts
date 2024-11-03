import { aiClient } from "@/server/clients/openai";
import {
  fixActions,
  generateHandHistoryPrompt,
  generateStackSizes,
  positionOrder6max,
  positionOrder9max,
} from "@/server/helpers";
import { handHistorySchema, IHandHistory } from "@/server/models";
import type { NextApiRequest, NextApiResponse } from "next";

const gptInstructions = `
  This GPT serves as an assistant for poker players who want to convert No Limit Hold'em hand histories into a normalized JSON to be ingested by another program. It listens to or receives the raw, descriptive hand histories provided by users, normalizes them by parsing the action sequence, bet sizes, player names, and stack sizes, and then outputs a standardized hand history. It includes all preflop actions, including folds, to provide a complete record of the hand. Player actions will show only actual table positions (e.g., SB, BB, UTG, BTN) and will exclude non-position labels like “Straddle”, "Hero", or "Villain". If any information is missing, it should either ask for clarification or make assumptions based on typical hand structures to complete the format accurately.

  If the prompt refers to "EP" or "Early Position", default to to UTG, UTG+1, or UTG+2 in that order assuming there is no straddle on that position. If the prompt refers to "MP" or "Middle Position", default to LJ, HJ in that order assuming there is no straddle on that position. If the prompt refers to "LP", or "Late Position", default to CO, BTN in that order assuming there is no straddle on that position. 

  If the prompt refers to a "limp", this should be treated as a call of the big blind or straddle.

  The JSON output will have the following keys: "blinds", "player", "preflop", "flop", "turn", "river".

  There are a couple of data structures that we will be using to normalize the response:

  enum ESuit {
  SPADE,
  HEART,
  DIAMOND,
  CLUB
  }

  enum ECardValue {
  A,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  T,
  J,
  Q,
  K
  }
  ECardValue should always be a string.

  interface ICard {
  suit: ESuit,
  value: ECardValue
  }

  enum EAction {
  FOLD,
  BET,
  RAISE,
  CALL,
  STRADDLE
  }

  enum EPosition {
  SB = "Small Blind",
  BB = "Big Blind",
  UTG = "Under the Gun",
  UTG1 = "Under the Gun plus one",
  UTG2 = "Under the Gun plus two",
  LJ = "Low Jack",
  HJ = "High Jack",
  CO = "Cut Off",
  BTN = "Button"
  }

  interface IAction {
  position: EPosition,
  action: EAction,
  amount: number
  stack_size: number
  }

  For 6-max games, the positions are SB, BB, UTG, LJ, HJ, CO, BTN
  For 9-max games, the positions are SB, BB, UTG, UTG+1, UTG+2, LJ, HJ, CO, BTN

  The "blinds" key will contain an object that contains two non-optional keys "small_blind" and "big_blind", and optional key "straddle". "small_blind" and "big_blind" are of type number and define the small blind and big blind of the game being played. The "straddle" key is an object with two keys. "value" (type: number0) is the number of dollars that the straddle is for. "position" is the position of the straddle (default to "UTG" if not specified in prompt).

  The "player" key will contain an object with three keys: "hand", and "stack_size", and "position". "hand" will be an array that ALWAYS has a length of two and contain the two ICard objects that represent the two cards in a no limit hold'em poker hand as described in the prompt. The "stack_size" key will contain a number representing the main user's (or "Hero's") stack size at the start of the hand. If no effective stack size is defined, default to 100 * <blinds.big_blind> . "position" is the position of the main user (type: EPosition).

  The "preflop" key will contain an array of type IAction. They are in the order that the actions occur. If the prompt says that someone is "in the straddle" or "straddling", refer to them by their position, NOT by straddle. If the prompt refers to "Hero" or "Villain", refer to them by their position. If the prompt says folds to, assume that all positions before that position have taken the action “FOLD”. The "stack_size" key is the stack size at the start of preflop action. If no stack size is specified for a position, default the stack size to 100*<blinds.big_blind>.

  The "flop" key will contain an object with the key "actions': an array of type IAction, and key "flop": an array of type ICard that is always exactly length three that represents the three cards on the flop. Each action is in the order that the actions occur. If the prompt says that someone is "in the straddle" or "straddling", refer to them by their position, NOT by straddle. If the prompt refers to "Hero" or "Villain", refer to them by their position. If the prompt says folds to, assume that all positions before that position have taken the action “FOLD”. The "stack_size" key is the stack size at the start of flop action. If no stack size is specified for a position, default the stack size to 100*<blinds.big_blind>.

  The "turn" key will contain an object with the key "actions': an array of type IAction, and key "card": type ICard that represents the turn card. Each action is in the order that the actions occur. If the prompt says that someone is "in the straddle" or "straddling", refer to them by their position, NOT by straddle. If the prompt refers to "Hero" or "Villain", refer to them by their position. If the prompt says folds to, assume that all positions before that position have taken the action “FOLD”. The "stack_size" key is the stack size at the start of turn action. If no stack size is specified for a position, default the stack size to 100*<blinds.big_blind>.

  The "river" key will contain an object with the key "actions': an array of type IAction, and key "card": type ICard that represents the river card. They are in the order that the actions occur. If the prompt says that someone is "in the straddle" or "straddling", refer to them by their position, NOT by straddle. If the prompt refers to "Hero" or "Villain", refer to them by their position. If the prompt says folds to, assume that all positions before that position have taken the action “FOLD”. The "stack_size" key is the stack size at the start of river action. If no stack size is specified for a position, default the stack size to 100*<blinds.big_blind>.
`;

// TODO: Add a showdown key that contains all of the hands that are shown down.
// TODO: Make discrete values in prompt standardized in json so it's easier for the AI to parse.

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const {
    smallBlind,
    bigBlind,
    playerCount,
    rawHistory,
    stackSizes,
    straddle,
  } = req.body;

  const fixedStackSizes = generateStackSizes(bigBlind, playerCount, stackSizes);

  const prompt = generateHandHistoryPrompt(
    smallBlind,
    bigBlind,
    playerCount,
    rawHistory,
    fixedStackSizes,
    straddle
  );

  console.log("PROMPT>>>", prompt);

  try {
    const aiResponse = await aiClient.chat.completions.create({
      messages: [
        { role: "system", content: gptInstructions },
        { role: "user", content: prompt },
      ],
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
    });

    const validatedHandHistory: IHandHistory = handHistorySchema.parse(
      JSON.parse(aiResponse.choices[0].message.content || "{}")
    );

    console.log("VALIDATED HAND HISTORY>>>", validatedHandHistory);

    // Fix Actions
    // PF
    const { actions: fixedPreflopActions, stackSizes: fixedPreflopStackSizes } =
      fixActions(
        validatedHandHistory.blinds.small_blind,
        validatedHandHistory.blinds.big_blind,
        playerCount === 9 ? positionOrder9max : positionOrder6max,
        validatedHandHistory.preflop,
        fixedStackSizes,
        true,
        validatedHandHistory.blinds.straddle
      );

    const { actions: fixedFlopActions, stackSizes: fixedFlopStackSizes } =
      fixActions(
        validatedHandHistory.blinds.small_blind,
        validatedHandHistory.blinds.big_blind,
        fixedPreflopStackSizes.map((ss) => ss.position),
        validatedHandHistory.flop.actions,
        fixedPreflopStackSizes,
        false
    );

    const { actions: fixedTurnActions, stackSizes: fixedTurnStackSizes } =
      fixActions(
        validatedHandHistory.blinds.small_blind,
        validatedHandHistory.blinds.big_blind,
        fixedFlopStackSizes.map((ss) => ss.position),
        validatedHandHistory.turn.actions,
        fixedFlopStackSizes,
        false
    );

    const { actions: fixedRiverActions } = fixActions(
      validatedHandHistory.blinds.small_blind,
      validatedHandHistory.blinds.big_blind,
      fixedTurnStackSizes.map((ss) => ss.position),
      validatedHandHistory.river.actions,
      fixedTurnStackSizes,
      false
    );

    const fixedHandHistory: IHandHistory = {
      ...validatedHandHistory,
      preflop: fixedPreflopActions,
      flop: { actions: fixedFlopActions, flop: validatedHandHistory.flop.flop },
      turn: { actions: fixedTurnActions, card: validatedHandHistory.turn.card },
      river: { actions: fixedRiverActions, card: validatedHandHistory.river.card },
    };

    res.status(200).json({ handHistory: fixedHandHistory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }

  res.status(200).json({ message: "Hand history generated" });
}
