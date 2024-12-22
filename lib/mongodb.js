import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";  // Replace with your MongoDB URI
const MONGODB_DB = process.env.MONGODB_DB || "myDatabase";  // Replace with your database name

let client;
let db;

export async function initmongo() {
  if (db) {
    return { client, db }; // Return the existing connection if db is already initialized
  }

  client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    db = client.db(MONGODB_DB);  // Get the database instance
    console.log("Connected to MongoDB");
    return { client, db };
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    throw new Error("Failed to connect to MongoDB");
  }
}
