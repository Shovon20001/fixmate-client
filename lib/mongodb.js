import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";

// keep one client alive across hot reloads / serverless invocations
const g = globalThis;
export const mongoClient = g._fixmateMongo ?? new MongoClient(uri);
g._fixmateMongo = mongoClient;

export const db = mongoClient.db(process.env.MONGODB_DB || "fixmate");
