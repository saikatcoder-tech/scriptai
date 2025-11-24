import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { transcript } = await req.json();

    if (!transcript?.trim()) {
      return NextResponse.json({ ok: false, reason: "empty transcript" });
    }

    await prisma.session.update({
      where: { id },
      data: { transcript },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("ERROR finish endpoint:", err);
    return NextResponse.json({ ok: false, error: "server_error" });
  }
}
