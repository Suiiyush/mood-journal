import { OpenAI } from "@langchain/openai";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import z from "zod";
import { Document } from "langchain/document";
import { loadQARefineChain } from "langchain/chains";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { JournalEntry } from "@prisma/client";

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    sentimentScore: z
      .number()
      .describe(
        "sentiment of the text and rated on a scale from -10 to 10, where -10 is extremely negative, 0 is neutral, and 10 is extremely positive."
      ),
    mood: z
      .string()
      .describe("The mood of the person who wrote the journal entry."),
    summary: z
      .string()
      .describe("Quick summary of the entire entry in not more than 4 words."),
    subject: z.string().describe("The subject of the journal entry."),
    negative: z
      .boolean()
      .describe(
        "Is the journal entry negative? (i.e. does it contain negative emotions?)."
      ),
    color: z
      .string()
      .describe(
        "A hexadecimal color code that represents the mood of the entry. Example #0101fe for blue representing happiness."
      ),
  })
);

const getPrompts = async (content: string) => {
  const format_instructions = parser.getFormatInstructions();
  const prompt = new PromptTemplate({
    template:
      "Analyze the following journal entry. Follow the instructions and format your response to match the format instructions, no matter what! \n{format_instructions}\n{entry}",
    inputVariables: ["entry"],
    partialVariables: { format_instructions },
  });
  const input = await prompt.format({
    entry: content,
  });
  return input;
};

export const analyze = async (content: string) => {
  const input = await getPrompts(content);
  const model = new OpenAI({ temperature: 0, modelName: "gpt-3.5-turbo" });
  const result = await model.call(input);
  try {
    return parser.parse(result);
  } catch (e) {
    console.log(e);
  }
};

type JournalEntriesForQuestions = Omit<
  JournalEntry,
  keyof {
    updatedAt: Date;
    userId: string;
  }
>;

export const qa = async (
  question: string,
  entries: JournalEntriesForQuestions[]
) => {
  const docs = entries.map((entry) => {
    return new Document({
      pageContent: entry.content,
      metadata: { id: entry.id, createdAt: entry.createdAt },
    });
  });
  const model = new OpenAI({ temperature: 0, modelName: "gpt-3.5-turbo" });
  const chain = loadQARefineChain(model);
  const embeddings = new OpenAIEmbeddings();
  const store = await MemoryVectorStore.fromDocuments(docs, embeddings);
  const relevantDocs = await store.similaritySearch(question);
  const res = await chain.call({
    input_documents: relevantDocs,
    question,
  });
  return res.output_text;
};
