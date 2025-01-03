// import { neon } from "@neondatabase/serverless";
// import { drizzle } from "drizzle-orm/neon-http";
// import { config } from "dotenv";
// import * as schema from "./schema";

// config({ path: ".env" });

// const pool = neon(process.env.DATABASE_URL!);
// export const db = drizzle({ client: pool, schema });

import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

config({ path: ".env" });

const client = postgres(process.env.DATABASE_URL);
export const db = drizzle({ client, schema });
