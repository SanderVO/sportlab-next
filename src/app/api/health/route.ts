import { NextResponse } from "next/server";

// Liveness only: deliberately skips the DB so a DB outage doesn't restart the app.
export const dynamic = "force-dynamic";

export function GET() {
    return NextResponse.json({ status: "ok" });
}
