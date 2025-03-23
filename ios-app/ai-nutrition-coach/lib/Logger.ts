// import * as Sentry from "@sentry/react";
import { User } from "../types";

class Logger {
  private static instance: Logger;
  private isDev: boolean;
  private currentUser?: User | undefined = undefined;

  private constructor() {
    // this.isDev = import.meta.env.DEV;
    this.isDev = true;
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setCurrentUser(user: User) {
    this.currentUser = user;
    // Sentry.setUser({
    //   id: user?.id,
    //   email: user?.email
    // });
  }

  log(...args: any[]) {
    console.log(...args);
  }

  error(...args: any[]) {
    console.error(...args);
    // if (!this.isDev) {
    //     Sentry.captureException(args.length === 1 ? args[0] : new Error(args.join(' ')));
    // }
  }

  warn(...args: any[]) {
    console.warn(...args);
  }
}

export default Logger.getInstance();