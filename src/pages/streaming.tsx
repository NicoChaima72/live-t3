"use client";

import { useChat } from "ai/react";
import { useEffect } from "react";
import { useRef } from "react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
    useChat({
      api: "/api/completation",
    });
  const containerMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerMessagesRef.current)
      containerMessagesRef.current.scrollTo({
        top: containerMessagesRef.current.scrollHeight,
        behavior: "smooth",
      });
  }, [messages]);

  return (
    <div className="stretch mx-auto flex h-[95vh]  w-full max-w-md flex-col space-y-4 rounded-lg bg-white shadow-xl">
      <div className="px-6 pt-6">
        <h1 className="border-b border-gray-300 pb-2 text-2xl font-bold">
          Chat
        </h1>
      </div>
      <div
        className="flex-1 space-y-5 overflow-y-auto px-6 pt-2"
        ref={containerMessagesRef}
      >
        {messages.map((m) => (
          <div key={m.id}>
            <div className="flex items-center pb-1">
              <div
                className={`mr-2 h-8 w-8 rounded-full ${
                  m.role === "user" ? "bg-gray-300" : "bg-gray-500"
                }`}
              ></div>

              <p className="text-lg">{m.role === "user" ? "Tú" : "AI"}</p>
            </div>

            {m.content.split("\n").map((line, i) => (
              <p className="mt-1" key={i}>
                {line}
              </p>
            ))}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2  px-6 pb-4">
        <input
          className=" flex-1 rounded border border-gray-300 p-2"
          placeholder="Preguntar algo..."
          value={input}
          onChange={handleInputChange}
        />
        {!isLoading ? (
          <button
            type="submit"
            className="rounded bg-green-600 px-4 text-white hover:bg-green-700"
          >
            Enviar
          </button>
        ) : (
          <button
            type="button"
            className="rounded bg-red-600 px-4 text-white hover:bg-red-700"
            onClick={stop}
          >
            Cancelar
          </button>
        )}
      </form>
    </div>
  );
}
