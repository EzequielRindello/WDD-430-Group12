import { NextResponse } from "next/server";
import { query } from "../../../lib/db";

export async function GET() {
  try {
    const result = await query("SELECT * FROM products");
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(
  user_id, 
  title, 
  price, 
  category, 
  description
) {
  const sql = "INSERT INTO products (user_id, title, price, category, description) VALUES ($1, $2, $3, $4, $5) RETURNING *"
  try {
    const result = await query(sql);
    if (!result){
      throw new Error ("Unable to add product")
    }
    return NextResponse.json({ message: "Product Added" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error adding Product" }, { status: 500 });
  }
}
