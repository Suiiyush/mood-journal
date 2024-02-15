import Analysis from "@/app/components/Analysis";
import { update } from "@/utils/actions";
import { getUserByClerkId } from "@/utils/auth";
import { prisma } from "@/utils/db";
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
          sentimentScore: 0,
          color: "#0101fe",
          userId: user.id,
        },
      },
    },
  });
  update(["/journal"]);
  return NextResponse.json({ data: entry });
};
