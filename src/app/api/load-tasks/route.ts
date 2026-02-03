import { NextResponse } from "next/server";
import { readDb } from "@/lib/storage";

export async function GET() {
    try {
        const data = await readDb();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Load error:", error);
        return NextResponse.json(
            { error: "Failed to load tasks", details: error.message || String(error) },
            { status: 500 }
        );
    }
}
