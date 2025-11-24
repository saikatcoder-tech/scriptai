import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "../../../../lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const email = session.user.email;

  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: { email },
    });
  }

  const dbSession = await prisma.session.create({
    data: {
      userId: user.id,
      title: "New session",
    },
  });

  return NextResponse.json({ id: dbSession.id });
}
