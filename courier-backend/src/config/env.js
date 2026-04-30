/**
 * env.js — Must be the FIRST import in server.js and api/index.js
 * ESM hoists all imports before executing module body, so dotenv must
 * be loaded in a dedicated module that is imported first.
 */
import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

config({ path: path.resolve(__dirname, "../.env") });
