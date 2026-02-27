import { NextResponse } from "next/server";
import { logs } from "@/lib/audit/data";

export async function GET() {
    return NextResponse.json(logs);
}
