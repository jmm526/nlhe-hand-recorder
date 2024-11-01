import { z } from "zod";
import { stackSizeSchema } from ".";

export const generateHandHistoryRequestSchema = z.object({
  smallBlind: z.number(),
  bigBlind: z.number(),
  playerCount: z.number(),
  stackSizes: z.array(stackSizeSchema),
  rawHistory: z.string(),
});
export type IGenerateHandHistoryRequest = z.infer<
  typeof generateHandHistoryRequestSchema
>;
