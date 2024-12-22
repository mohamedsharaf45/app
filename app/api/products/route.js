import { initmongo } from "../../../lib/mongodb";  // Import the MongoDB connection function

// GET request to fetch products
export async function GET() {
  try {
    const { db } = await initmongo();  // Get DB instance
    const products = await db.collection('products').find({}).toArray();  // Fetch all products
    return new Response(JSON.stringify(products), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch products" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// POST request to add a new product
export async function POST(req) {
  try {
    const { db } = await initmongo();  // Get DB instance
    const newProduct = await req.json();  // Parse incoming product data
    const result = await db.collection('products').insertOne(newProduct);  // Insert new product into collection
    return new Response(JSON.stringify({ message: "Product added", product: result.ops[0] }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to add product" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
