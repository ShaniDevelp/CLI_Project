"use client";
import React, { useEffect, useState, useRef } from "react";
import CommandParser from "../components/CommandParser";
import ResultOutput from "@/components/result";

export default function Home() {
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [imageInput, setImageInput] = useState(false);
  const [output, setOutput] = useState([]);
  const [wordIndex, setWordIndex] = useState(0);
  const inputRef = useRef(null);
  const [words, setWords] = useState(["Welcome", "to", "Your", "CLI", "app"]);
  const [commandOutput, setCommandOutput] = useState({
    input: "",
    output: null,
  });

  useEffect(() => {
    inputRef.current.focus();
    const typingTimer = setTimeout(() => {
      setWordIndex((prevIndex) => (prevIndex < words.length ? prevIndex + 1 : prevIndex));
    }, 300);
    return () => clearTimeout(typingTimer);
  }, [wordIndex, words.length]);

  useEffect(() => {
    if (commandOutput.input !== "") {
      setOutput((prevOutput) => [...prevOutput, commandOutput]);
      scrollToBottom();
    }
  }, [commandOutput]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0]);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    setError(false);
    if (!file) {
      console.log("please choose a file");
      return;
    }
    try {
      const data = new FormData();
      data.set("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      if (!res.ok) {
        setError(true);
      }
      if (res.status === 200) {
        setOutput((prevOutput) => prevOutput.slice(0, -1));
        setCommandOutput({
          input: "upload",
          output: {
            message: `File ${file.name} has been uploaded successfully`,
          },
        });
        setImageInput(false);
        setFile(null);
      }
      return res;
    } catch (error) {
      setError(true);
    }
  };

  const handleInputSubmit = async (e) => {
    e.preventDefault();
    if (input === "clear") {
      setOutput([]);
    } else {
      if (input === "upload") {
        setImageInput(true);
      }
      try {
        const output = await CommandParser.parse(input, setLoading);
        setCommandOutput({
          input,
          output,
        });
      } catch (error) {
        console.error("Error parsing command:", error);
      }
    }
    setInput("");
  };

  const scrollToBottom = () => {
    const elem = document.getElementById("mainContainer");
    setTimeout(() => {
      elem.scroll(0, elem.scrollHeight);
    }, 300);
  };

  return (
    <div id="mainContainer" className="h-screen overflow-x-auto flex flex-col bg-gray-800 p-6">
      <div className="text-center pb-10">
        <h2 className="text-white flex justify-center">
          {words.slice(0, wordIndex).map((word, index) => (
            <span key={index} className="text-4xl font-bold px-2">
              {word}{" "}
            </span>
          ))}
        </h2>
        <h3 className="text-white mt-5">Start with help command</h3>
      </div>
      <div>
        {output.map((item, index) => (
          <div key={index}>
            <form className="flex items-center">
              <p className="text-white pr-1 text-lg">PS C:\Antematter\CLI --</p>
              <input
                type="text"
                readOnly
                className="border-none bg-transparent text-yellow-300 px-1 py-1 focus:outline-none focus:border-none focus:ring-0 w-[70%]"
                value={item.input}
              />
            </form>
            <div className="mt-2 mx-3 mb-7">
              <ResultOutput output={item.output}></ResultOutput>
            </div>
          </div>
        ))}
      </div>

      {imageInput ? (
        <form onSubmit={handleFileUpload} className="flex justify-between w-[20%]">
          <input
            type="file"
            className="text-white w-[70%] p-3 h-[50px]"
            onChange={handleFileChange}
            placeholder="CSV file"
          />
          <button
            type="submit"
            className={`flex items-center justify-center py-2 px-6 rounded-md bg-gradient-to-r from-sky-500 to-indigo-500 hover:bg-gradient-to-l text-white font-bold shadow-md ${file ? "" : "disabled opacity-50 cursor-not-allowed"}`}
          >
            Upload
          </button>
        </form>
      ) : (
        <form onSubmit={handleInputSubmit} className="flex items-center">
          <p className="text-white pr-1 text-lg">PS C:\Antematter\CLI --</p>
          <input
            ref={inputRef}
            type="text"
            className="border-none bg-transparent text-yellow-300 px-1 py-1 focus:outline-none focus:border-none focus:ring-0 w-[70%]"
            value={input}
            onChange={handleInputChange}
          />
        </form>
      )}
      {loading && <p className="text-white">Drawing Chart...</p>}
      {error && (
        <p className="text-red-500 mt-7">
          Invalid file type. Only CSV files allowed
        </p>
      )}
    </div>
  );
}

