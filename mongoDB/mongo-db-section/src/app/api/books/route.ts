// api/books backend
import { NextResponse } from "next/server";
import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function GET() {
  try {
    await client.connect();
    const database = client.db("books_db");
    const books = database.collection("books");
    const results = await books.find({}).toArray();
    return NextResponse.json(results);
  } finally {
    await client.close();
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await client.connect();
    const database = client.db("books_db");
    const books = database.collection("books");

    if (Array.isArray(body)) {
      await books.insertMany(body);
    } else {
      await books.insertOne(body);
    }

    return NextResponse.json({ message: "Books added successfully" });
  } finally {
    await client.close();
  }
}

export async function PUT(req: Request) {
  try {
    const { title, updates } = await req.json();
    await client.connect();
    const database = client.db("books_db");
    const books = database.collection("books");

    await books.updateOne({ title }, { $set: updates });

    return NextResponse.json({ message: "Book updated successfully" });
  } finally {
    await client.close();
  }
}

export async function DELETE(req: Request) {
  try {
    const { title } = await req.json();
    await client.connect();
    const database = client.db("books_db");
    const books = database.collection("books");

    await books.deleteOne({ title });

    return NextResponse.json({ message: "Book deleted successfully" });
  } finally {
    await client.close();
  }
}
