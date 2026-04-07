import { MongoClient } from "mongodb";

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

const dbName = "booksRent";

export default async function connectDB() {
    await client.connect();
    const db = client.db(dbName);
    console.log("Connected to MongoDB");
    return db;
}