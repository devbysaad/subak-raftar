/**
 * env.js for seed script — loads from root .env
 */
import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

config({ path: path.resolve(__dirname, "../../.env") });
