import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    return await auth.handler(request);
  } catch (error) {
    console.error("🔴 Auth GET Error:", error);
    return NextResponse.json({ error: String(error), stack: (error as Error)?.stack }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const res = await auth.handler(request);
    if (res.status >= 400) {
      const clone = res.clone();
      const text = await clone.text();
      console.error("🔴 Auth Response Status:", res.status, "Text:", text);
    }
    return res;
  } catch (error) {
    console.error("🔴 Auth POST Error:", error);
    return NextResponse.json({ error: String(error), stack: (error as Error)?.stack }, { status: 500 });
  }
}


