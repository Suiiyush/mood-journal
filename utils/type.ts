import { Analysis, JournalEntry } from "@prisma/client";

export type JournalEntryWithAnalysis = JournalEntry & { analysis: Analysis };
