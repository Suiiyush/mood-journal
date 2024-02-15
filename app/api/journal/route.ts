import { getUserByClerkId } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const POST = async () => {
  const user = await getUserByClerkId();
  const entry = await prisma.journalEntry.create({
    data: {
      userId: user.id,
      content: "write about your day",
      analysis: {
        create: {
          mood: "Neutral",
          subject: "None",
          negative: false,
          summary: "None",
          color: "#0101fe",
        },
      },
    },
  });
  revalidatePath("/journal");
  return NextResponse.json({ data: entry });
};
