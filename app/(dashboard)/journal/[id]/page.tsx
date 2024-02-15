import Editor from "@/app/components/Editor";
import { getUserByClerkId } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { JournalEntryWithAnalysis } from "@/utils/type";

const getEntry = async (id: string) => {
  const user = await getUserByClerkId();
  const entry = await prisma.journalEntry.findUnique({
    where: {
      userId_id: {
        userId: user.id,
        id,
      },
    },
    include: {
      analysis: true,
    },
  });
  return entry as unknown as JournalEntryWithAnalysis;
};

const EntryPage = async ({ params }: { params: { id: string } }) => {
  const entry = await getEntry(params.id);

  return (
    <div className="h-full w-full">
      <Editor entry={entry} />
    </div>
  );
};

export default EntryPage;
