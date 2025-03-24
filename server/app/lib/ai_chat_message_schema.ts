import { z } from 'zod'

const loggedFoodItemSchema = z.object({
  id: z.string(),
  description: z.string(),
  meal_type: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
})

const userGoalsSchema = z.object({
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
})

export const actionsSchema = z.union([
  z.object({
    type: z.literal('propose_user_goals'),
    user_goals: userGoalsSchema,
  }),
  z.object({
    type: z.literal('confirm_user_goals'),
    user_goals: userGoalsSchema,
  }),
  z.object({
    type: z.literal('propose_logged_food_item'),
    logged_food_item: loggedFoodItemSchema,
  }),
  z.object({
    type: z.literal('confirm_logged_food_item'),
    logged_food_item: loggedFoodItemSchema,
  }),
])

const aiChatMessageSchema = z.object({
  message: z.string(),
  action: actionsSchema,
})

export default aiChatMessageSchema
