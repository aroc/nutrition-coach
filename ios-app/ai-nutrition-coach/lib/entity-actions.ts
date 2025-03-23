import * as Crypto from "expo-crypto";
import db from "@/db/db";
import { loggedFoodItems, userGoals } from "@/db/schema";
import { eq } from "drizzle-orm";
import Logger from "./Logger";

export type LoggedFoodItem = typeof loggedFoodItems.$inferSelect;
export type NewLoggedFoodItem = typeof loggedFoodItems.$inferInsert;

export type UserGoals = typeof userGoals.$inferSelect;
export type NewUserGoals = typeof userGoals.$inferInsert;

// Food Logging CRUD Operations
export const createLoggedFoodItem = async (
  foodItem: Omit<NewLoggedFoodItem, "id" | "createdAt" | "updatedAt">
): Promise<LoggedFoodItem> => {
  try {
    const newFoodItemValues = {
      id: Crypto.randomUUID(),
      ...foodItem,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(loggedFoodItems).values(newFoodItemValues);

    const newFoodItem = await db.query.loggedFoodItems.findFirst({
      where: eq(loggedFoodItems.id, newFoodItemValues.id),
    });

    if (!newFoodItem) throw new Error("Failed to create food item");
    return newFoodItem;
  } catch (error) {
    Logger.error("Error creating food item:", error);
    throw error;
  }
};

export const updateLoggedFoodItem = async (
  foodItemId: string,
  updates: Partial<Omit<NewLoggedFoodItem, "id" | "createdAt" | "updatedAt">>
): Promise<LoggedFoodItem> => {
  try {
    await db
      .update(loggedFoodItems)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(loggedFoodItems.id, foodItemId));

    const updatedFoodItem = await db.query.loggedFoodItems.findFirst({
      where: eq(loggedFoodItems.id, foodItemId),
    });

    if (!updatedFoodItem)
      throw new Error(`Food item not found with id ${foodItemId}`);
    return updatedFoodItem;
  } catch (error) {
    Logger.error("Error updating food item:", error);
    throw error;
  }
};

export const deleteLoggedFoodItem = async (
  foodItemId: string
): Promise<boolean> => {
  if (!foodItemId) return false;

  try {
    await db.delete(loggedFoodItems).where(eq(loggedFoodItems.id, foodItemId));
    Logger.log("Deleted food item from local db", foodItemId);
    return true;
  } catch (error) {
    Logger.error("Error deleting food item from local db:", error);
    throw error;
  }
};

export const getLoggedFoodItems = async (
  userId: string
): Promise<LoggedFoodItem[]> => {
  try {
    const items = await db.query.loggedFoodItems.findMany({
      where: eq(loggedFoodItems.userId, userId),
      orderBy: (loggedFoodItems, { desc }) => [desc(loggedFoodItems.createdAt)],
    });
    return items;
  } catch (error) {
    Logger.error("Error fetching food items:", error);
    throw error;
  }
};

// User Goals CRUD Operations
export const createUserGoals = async (
  goals: Omit<NewUserGoals, "id" | "createdAt" | "updatedAt">
): Promise<UserGoals> => {
  try {
    const newGoalsValues = {
      id: Crypto.randomUUID(),
      ...goals,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(userGoals).values(newGoalsValues);

    const newGoals = await db.query.userGoals.findFirst({
      where: eq(userGoals.id, newGoalsValues.id),
    });

    if (!newGoals) throw new Error("Failed to create user goals");
    return newGoals;
  } catch (error) {
    Logger.error("Error creating user goals:", error);
    throw error;
  }
};

export const updateUserGoals = async (
  goalsId: string,
  updates: Partial<Omit<NewUserGoals, "id" | "createdAt" | "updatedAt">>
): Promise<UserGoals> => {
  try {
    await db
      .update(userGoals)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(userGoals.id, goalsId));

    const updatedGoals = await db.query.userGoals.findFirst({
      where: eq(userGoals.id, goalsId),
    });

    if (!updatedGoals)
      throw new Error(`User goals not found with id ${goalsId}`);
    return updatedGoals;
  } catch (error) {
    Logger.error("Error updating user goals:", error);
    throw error;
  }
};

export const deleteUserGoals = async (goalsId: string): Promise<boolean> => {
  if (!goalsId) return false;

  try {
    await db.delete(userGoals).where(eq(userGoals.id, goalsId));
    Logger.log("Deleted user goals from local db", goalsId);
    return true;
  } catch (error) {
    Logger.error("Error deleting user goals from local db:", error);
    throw error;
  }
};

export const getUserGoals = async (
  userId: string
): Promise<UserGoals | undefined> => {
  try {
    const goals = await db.query.userGoals.findFirst({
      where: eq(userGoals.userId, userId),
    });
    return goals;
  } catch (error) {
    Logger.error("Error fetching user goals:", error);
    throw error;
  }
};
