"use client";
import { askQuestin } from "@/utils/api";
import { ChangeEvent, useState } from "react";
import Spinner from "./Spinner";
const Question = () => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const question = value;
    const response = await askQuestin(question);
    console.log(response);
    setAnswer(response);
    setValue("");
    setLoading(false);
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          disabled={loading}
          type="text"
          placeholder="Ask a question"
          value={value}
          onChange={onChange}
          className="border border-black/20 px-4 py-2 text-lg rounded-lg"
        />
        <button
          disabled={loading}
          type="submit"
          className="bg-blue-400 px-4 py-2 rounded-lg text-lg"
        >
          Ask
        </button>
      </form>
      {loading && <Spinner />}
      {answer && <div>{answer}</div>}
    </div>
  );
};

export default Question;
