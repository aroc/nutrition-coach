import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from './schema';

class Database {
    private static instance: Database;
    private db: ReturnType<typeof drizzle<typeof schema>>;

    private constructor() {
        const expo = openDatabaseSync("db.db", { enableChangeListener: true });
        this.db = drizzle(expo, { schema });
    }

    public static getInstance(): ReturnType<typeof drizzle<typeof schema>> {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance.db;
    }
}

const db = Database.getInstance();
export default db;

