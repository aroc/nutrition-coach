import { User } from "@/types/index";
import Logger from "./Logger";
import { useAppStore } from "../state/store";
import { logout, setCurrentUser } from "./auth-utils";
import { apiFetch } from "./api-client";
import db from "@/db/db";
import {
  userGoals as userGoalsTable,
  loggedFoodItems as loggedFoodItemsTable,
  userChatMessages,
} from "@/db/schema";
import { eq } from "drizzle-orm";

export const fetchUserGoals = async () => {
  const currentUser = useAppStore.getState().currentUser;
  if (!currentUser) return;

  // Check if there are any goals in the local db
  const existingGoals = await db.select().from(userGoalsTable);
  if (existingGoals.length > 0) {
    Logger.log("Found existing goals in local db", existingGoals.length);
    return;
  }

  const { setIsFetchingUserGoals } = useAppStore.getState();
  setIsFetchingUserGoals(true);

  Logger.log("fetching user mixes", currentUser);

  try {
    const response = await apiFetch("/user_goals", {
      currentUser,
    });

    if (response.status === 500) {
      Logger.error("Server error while fetching user goals");
      setIsFetchingUserGoals(false);
      return;
    }

    const data = await response.json();
    Logger.log("user goals", JSON.stringify(data));

    // Set the user goals in the sqllite db
    if (data) {
      for (const goal of data) {
        // Check if goal already exists
        const existingGoal = await db
          .select()
          .from(userGoalsTable)
          .where(eq(userGoalsTable.id, goal.id));
        if (existingGoal.length === 0) {
          Logger.log("inserting goal", goal);
          await db.insert(userGoalsTable).values(goal);
        } else {
          Logger.log("goal already exists, skipping insert", goal.id);
        }
      }
    }
  } catch (error) {
    Logger.error("Error fetching user goals:", error);
    setIsFetchingUserGoals(false);
    throw error;
  }

  setIsFetchingUserGoals(false);
};

export const fetchLoggedFoodItems = async () => {
  const currentUser = useAppStore.getState().currentUser;
  if (!currentUser) return;

  const existingLoggedFoodItems = await db.select().from(loggedFoodItemsTable);
  if (existingLoggedFoodItems.length > 0) {
    Logger.log(
      "Found existing logged food items in local db",
      existingLoggedFoodItems.length
    );
    return;
  }

  const { setIsFetchingLoggedFoodItems } = useAppStore.getState();
  setIsFetchingLoggedFoodItems(true);

  Logger.log("fetching logged food items", currentUser);

  try {
    const response = await apiFetch("/logged_food_items", {
      currentUser,
    });

    if (response.status === 500) {
      Logger.error("Server error while fetching logged food items");
      setIsFetchingLoggedFoodItems(false);
      return;
    }

    const data = await response.json();
    Logger.log("logged food items", JSON.stringify(data));

    // Set the logged food items in the sqlite db
    if (data) {
      for (const item of data) {
        // Check if item already exists
        const existingItem = await db
          .select()
          .from(loggedFoodItemsTable)
          .where(eq(loggedFoodItemsTable.id, item.id));
        if (existingItem.length === 0) {
          Logger.log("inserting logged food item", item);
          await db.insert(loggedFoodItemsTable).values(item);
        } else {
          Logger.log(
            "logged food item already exists, skipping insert",
            item.id
          );
        }
      }
    }
  } catch (error) {
    Logger.error("Error fetching logged food items:", error);
    setIsFetchingLoggedFoodItems(false);
    throw error;
  }

  setIsFetchingLoggedFoodItems(false);
};

export const fetchChatMessages = async () => {
  const currentUser = useAppStore.getState().currentUser;
  if (!currentUser) return;

  if (!currentUser) {
    Logger.log("no current user, skipping fetch chat messages");
    return;
  }

  const { setIsFetchingChatMessages } = useAppStore.getState();
  setIsFetchingChatMessages(true);

  Logger.log("fetching chat messages", currentUser);

  try {
    const response = await apiFetch("/chat_messages", {
      currentUser,
    });

    if (response.status === 500) {
      Logger.error("Server error while fetching chat messages");
      setIsFetchingChatMessages(false);
      return;
    }

    const data = await response.json();
    Logger.log("chat messages", JSON.stringify(data));

    // Set the chat messages in the sqlite db
    if (data) {
      for (const message of data) {
        // Check if message already exists
        const existingMessage = await db
          .select()
          .from(userChatMessages)
          .where(eq(userChatMessages.id, message.id));
        if (existingMessage.length === 0) {
          Logger.log("inserting chat message", message);
          await db.insert(userChatMessages).values(message);
        } else {
          Logger.log(
            "chat message already exists, skipping insert",
            message.id
          );
        }
      }
    }
  } catch (error) {
    Logger.error("Error fetching chat messages:", error);
    setIsFetchingChatMessages(false);
    throw error;
  }

  setIsFetchingChatMessages(false);
};

export const submitLogin = async (email: string, password: string) => {
  const response = await apiFetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    const data = await response.json();

    Logger.log("login success", data);
    setCurrentUser(data as User);
  } else {
    Logger.error("login failed", response);
    let message = "Login failed";

    try {
      const data = await response.json();
      message = data?.errors?.[0]?.message ?? message;
    } catch (e) {}

    throw new Error(message);
  }
};

export const submitSignup = async (email: string, password: string) => {
  const response = await apiFetch("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  Logger.log("signup response", response);

  if (response.ok) {
    const data = await response.json();

    Logger.log("signup success", data);

    setCurrentUser(data as User);
  } else {
    Logger.error("signup failed", response);
    let message = "Signup failed";

    try {
      const data = await response.json();
      message = data?.error || message;
    } catch (e) {
      message = response.statusText || message;
    }

    throw new Error(message);
  }
};

// export const verifyAppleLoginResp = async (appleLoginResponse: AppleLoginResponse) => {
//   try {
//     if (!appleLoginResponse || !appleLoginResponse.user || !appleLoginResponse.identityToken || !appleLoginResponse.authorizationCode) {
//       const errorMsg = 'Invalid Apple login response, must have all of user, identityToken, and authorizationCode';
//       Logger.error(errorMsg);
//       throw new Error(errorMsg);
//     }

//     Logger.log('Verifying Apple login with appleLoginResponse', JSON.stringify(appleLoginResponse));

//     const response = await apiFetch('/auth/verify-apple-login', {
//       method: 'POST',
//       body: JSON.stringify(appleLoginResponse)
//     });

//     if (response.ok) {
//       const data = await response.json();

//       Logger.log('Verify apple login success', data);
//       setCurrentUser(data as User);
//     } else {
//       Logger.error('Verify apple login failed', response);
//       let message = 'Apple login failed';

//       try {
//         const data = await response.json();
//         // message = data?.errors?.[0]?.message ?? message;
//         if (data != null) {
//           message = JSON.stringify(data);
//         }
//       } catch (e) {
//       }

//       throw new Error(message);
//     }
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       Logger.error('Error verifying Apple login:', error.message);
//       throw error;
//     }
//   }
// }

const deleteAccountRequest = async () => {
  const { currentUser } = useAppStore.getState();

  await apiFetch("/users/delete_account", {
    method: "DELETE",
    currentUser,
  });
};

export const deleteAccount = async () => {
  await deleteAccountRequest();
  await logout();
};
