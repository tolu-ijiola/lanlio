"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Minimize2 } from "lucide-react";
import { useEditorStore } from "@/stores/editor-v2/store";

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content: "Hi! I'm your AI assistant. I can help you build your website. Try asking me to 'add a header' or 'change the background color'.",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addComponent, updateComponent, selectedComponentIds, components } = useEditorStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    // Simulate AI response (replace with actual AI integration)
    setTimeout(() => {
      const lowerMessage = userMessage.toLowerCase();
      let response = "";

      if (lowerMessage.includes("add") && lowerMessage.includes("header")) {
        addComponent("header");
        response = "I've added a header component to your page!";
      } else if (lowerMessage.includes("add") && lowerMessage.includes("button")) {
        addComponent("button");
        response = "I've added a button component to your page!";
      } else if (lowerMessage.includes("add") && lowerMessage.includes("text")) {
        addComponent("text");
        response = "I've added a text component to your page!";
      } else if (lowerMessage.includes("add") && lowerMessage.includes("image")) {
        addComponent("image");
        response = "I've added an image component to your page!";
      } else {
        response = "I understand you want to: " + userMessage + ". This feature is coming soon!";
      }

      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    }, 500);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[oklch(0.6500_0.22_25)] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center z-50"
        title="Open AI Assistant"
      >
        <Bot className="h-6 w-6" />
      </button>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 w-80 bg-white rounded-lg shadow-xl border border-[oklch(0.9200_0.005_20)] z-50">
        <div className="h-12 border-b border-[oklch(0.9200_0.005_20)] flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-[oklch(0.6500_0.22_25)]" />
            <span className="text-sm font-medium text-[oklch(0.2200_0.015_20)]">AI Assistant</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1.5 hover:bg-[oklch(0.9600_0.008_30)] rounded transition-colors"
            >
              <Minimize2 className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-[oklch(0.9600_0.008_30)] rounded transition-colors"
            >
              <X className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-lg shadow-xl border border-[oklch(0.9200_0.005_20)] flex flex-col z-50">
      {/* Header */}
      <div className="h-12 border-b border-[oklch(0.9200_0.005_20)] flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-[oklch(0.6500_0.22_25)]" />
          <span className="text-sm font-medium text-[oklch(0.2200_0.015_20)]">AI Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 hover:bg-[oklch(0.9600_0.008_30)] rounded transition-colors"
          >
            <Minimize2 className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-[oklch(0.9600_0.008_30)] rounded transition-colors"
          >
            <X className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 ${
                message.role === "user"
                  ? "bg-[oklch(0.6500_0.22_25)] text-white"
                  : "bg-[oklch(0.9600_0.008_30)] text-[oklch(0.2200_0.015_20)]"
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-[oklch(0.9200_0.005_20)] p-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask me to add components, change styles..."
            className="flex-1 px-3 py-2 text-sm border border-[oklch(0.9200_0.005_20)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)] focus:border-transparent"
          />
          <button
            onClick={handleSend}
            className="p-2 bg-[oklch(0.6500_0.22_25)] text-white rounded-lg hover:bg-[oklch(0.6000_0.22_25)] transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}





