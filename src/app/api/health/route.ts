import { getDb } from "@/lib/db";

export const runtime = "nodejs";

export function GET() {
  try {
    const db = getDb();
    const result = db.prepare("SELECT COUNT(*) as count FROM games").get() as { count: number };
    return Response.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      checks: {
        database: "connected",
        games: result.count,
      },
    });
  } catch {
    return Response.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        checks: {
          database: "disconnected",
        },
      },
      { status: 503 },
    );
  }
}
