import { NextRequest } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import { getGameBySlug, getLessonBySlug } from "@/lib/data";

export const runtime = "nodejs";

function wrapText(text: string, maxLength = 95) {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxLength) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

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

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([612, 792]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let cursor = 750;
  const drawLine = (text: string, options?: { bold?: boolean; size?: number; color?: [number, number, number] }) => {
    page.drawText(text, {
      x: 48,
      y: cursor,
      size: options?.size ?? 11,
      font: options?.bold ? bold : font,
      color: rgb(...(options?.color ?? [0.15, 0.23, 0.35])),
    });
    cursor -= (options?.size ?? 11) + 6;
  };

  drawLine("LearnByPlay lesson plan", { bold: true, size: 18, color: [0.36, 0.22, 0.02] });
  drawLine(lesson.title, { bold: true, size: 20 });
  drawLine(`${game.name} • Grades ${lesson.gradeBand} • ${variant.label}`, { size: 12 });
  cursor -= 4;

  for (const line of wrapText(lesson.summary, 90)) {
    drawLine(line);
  }

  cursor -= 8;
  drawLine("Learning objectives", { bold: true, size: 14 });
  lesson.learningObjectives.forEach((item) => wrapText(`• ${item}`, 88).forEach((line) => drawLine(line)));

  cursor -= 8;
  drawLine("Materials needed", { bold: true, size: 14 });
  lesson.materialsNeeded.forEach((item) => wrapText(`• ${item}`, 88).forEach((line) => drawLine(line)));

  cursor -= 8;
  drawLine("Lesson sequence", { bold: true, size: 14 });
  variant.sequence.forEach((step) => wrapText(`• ${step.phase} (${step.minutes} min): ${step.guidance}`, 88).forEach((line) => drawLine(line)));

  cursor -= 8;
  drawLine("Reflection prompts", { bold: true, size: 14 });
  lesson.postGameReflection.forEach((item) => wrapText(`• ${item}`, 88).forEach((line) => drawLine(line)));

  const bytes = await pdf.save();
  const body = new Blob([Uint8Array.from(bytes)], { type: "application/pdf" });

  return new Response(body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${lesson.slug}.pdf"`,
    },
  });
}
