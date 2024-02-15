import EntryCard from "@/app/components/EntryCard";
import NewEntryCard from "@/app/components/NewEntryCard";
import Question from "@/app/components/Question";
import { getUserByClerkId } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { JournalEntryWithAnalysis } from "@/utils/type";
import Link from "next/link";

const getEntries = async () => {
  const user = await getUserByClerkId();
  const entries = await prisma.journalEntry.findMany({
    where: {
      userId: user.id,
    },
    include: {
      analysis: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return entries as unknown as JournalEntryWithAnalysis[];
};

const JournalPage = async () => {
  const entries = await getEntries();
  console.log(entries);
  return (
    <div className="p-10 bg-zinc-400/10 h-full">
      <h2 className="text-3xl mb-8">Journal</h2>
      <div className="my-8">
        <Question />
      </div>
      <div className="grid grid-cols-3 gap-4 p-10">
        <NewEntryCard />
        {entries.map((entry) => (
          <Link key={entry.id} href={`/journal/${entry.id}`}>
            <EntryCard entry={entry} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default JournalPage;
