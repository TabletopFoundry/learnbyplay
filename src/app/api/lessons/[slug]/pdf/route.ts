import { NextRequest } from "next/server";

import { getGameBySlug, getLessonBySlug } from "@/lib/data";
import { generateLessonPdf } from "@/lib/pdf";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);

  if (!lesson) {
    return new Response("Lesson not found", { status: 404 });
  }

  const game = getGameBySlug(lesson.gameSlug);
  if (!game) {
    return new Response("Game not found", { status: 404 });
  }

  const selectedVariant = Number(request.nextUrl.searchParams.get("variant") ?? 45);
  const variant = lesson.variants.find((entry) => entry.duration === selectedVariant) ?? lesson.variants[0];

  const bytes = await generateLessonPdf(lesson, game, variant);

  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${lesson.slug.replace(/[^a-z0-9_-]/gi, "_")}.pdf"`,
    },
  });
}
