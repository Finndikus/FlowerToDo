import { NextResponse } from "next/server";
import { writeDb } from "@/lib/storage";

export async function POST(request: Request) {
    console.log("[Storage] Save request received");
    let body: any;
    try {
        body = await request.json();
        const { data } = body;

        if (!data) {
            console.error("[Storage] No data provided");
            return NextResponse.json(
                { error: "No data provided", details: "The data array/object is missing from the request body." },
                { status: 400 }
            );
        }

        // Write to local JSON "database"
        await writeDb(data);
        console.log(`[Storage] Save Success`);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Storage error:", error);
        return NextResponse.json(
            { error: "Failed to save to database", details: error.message || String(error) },
            { status: 500 }
        );
    }
}
