"use client";
import { useState } from "react";
import { JournalEntryWithAnalysis } from "@/utils/type";
import { updateEntry } from "@/utils/api";
import { useAutosave } from "react-autosave";
import Spinner from "./Spinner";

const Editor = ({ entry }: { entry: JournalEntryWithAnalysis }) => {
  const [value, setValue] = useState(entry.content);
  const [isSaving, setIsSaving] = useState(false);
  const [analysis, setAnalysis] = useState(entry.analysis);
  const { mood, summary, subject, negative, color } = analysis;
  const analysisData = [
    { name: "Summary", value: summary },
    { name: "Subject", value: subject },
    { name: "Mood", value: mood },
    { name: "Negative", value: negative ? "True" : "False" },
  ];

  useAutosave({
    data: value,
    onSave: async (_value) => {
      setIsSaving(true);
      const updatedEntry = await updateEntry(entry.id, _value);
      console.log(updatedEntry);
      setAnalysis(updatedEntry.analysis);
      setIsSaving(false);
    },
  });

  return (
    <div className="h-full w-full grid grid-cols-3 gap-0 relative">
      <div className="absolute left-0 top-0 p-2">
        {isSaving ? (
          <Spinner />
        ) : (
          <div className="w-[16px] h-[16px] rounded-full bg-green-500"></div>
        )}
      </div>
      <div className="col-span-2">
        <textarea
          className="h-full w-full p-8 text-xl outline-none"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <div className="border-l border-black/10">
        <div className="px-6 py-10" style={{ backgroundColor: color }}>
          <h2 className="text-2xl">Analysis</h2>
        </div>
        <div>
          <ul>
            {analysisData.map((item) => (
              <li
                key={item.name}
                className="px-2 py-4 flex items-center justify-between border-b border-t border-black/10"
              >
                <span className="text-lg font-semibold">{item.name}</span>
                <span>{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Editor;
