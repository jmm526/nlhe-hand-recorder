import { z } from "zod";

export enum ESuit {
  SPADE = "SPADE",
  HEART = "HEART",
  DIAMOND = "DIAMOND",
  CLUB = "CLUB",
}

export enum ECardValue {
  A = "A",
  TWO = "2",
  THREE = "3",
  FOUR = "4",
  FIVE = "5",
  SIX = "6",
  SEVEN = "7",
  EIGHT = "8",
  NINE = "9",
  T = "T",
  J = "J",
  Q = "Q",
  K = "K",
}

export const cardSchema = z.object({
  suit: z.nativeEnum(ESuit),
  value: z.nativeEnum(ECardValue),
});
export type ICard = z.infer<typeof cardSchema>;

export enum EAction {
  FOLD = "FOLD",
  BET = "BET",
  RAISE = "RAISE",
  CALL = "CALL",
  CHECK = "CHECK",
  STRADDLE = "STRADDLE",
}

export enum EPosition {
  SB = "SB",
  BB = "BB",
  UTG = "UTG",
  UTG1 = "UTG1",
  UTG2 = "UTG2",
  LJ = "LJ",
  HJ = "HJ",
  CO = "CO",
  BTN = "BTN",
}

export const actionSchema = z.object({
  position: z.nativeEnum(EPosition),
  action: z.nativeEnum(EAction),
  amount: z.number(),
  stack_size: z.number(),
});
export type IAction = z.infer<typeof actionSchema>;

export const straddleSchema = z.object({
  value: z.number(),
  position: z.nativeEnum(EPosition),
});
export type IStraddle = z.infer<typeof straddleSchema>;

export const handHistorySchema = z.object({
  blinds: z.object({
    small_blind: z.number(),
    big_blind: z.number(),
    straddle: straddleSchema.optional(),
  }),
  player: z.object({
    hand: z.array(cardSchema).length(2),
    stack_size: z.number(),
    position: z.nativeEnum(EPosition),
  }),
  preflop: z.array(actionSchema),
  flop: z.object({
    flop: z.array(cardSchema).length(3),
    actions: z.array(actionSchema),
  }),
  turn: z.object({
    card: cardSchema,
    actions: z.array(actionSchema),
  }),
  river: z.object({
    card: cardSchema,
    actions: z.array(actionSchema),
  }),
});
export type IHandHistory = z.infer<typeof handHistorySchema>;
