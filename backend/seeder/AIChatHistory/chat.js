import mongoose from "mongoose";

const chatData = [
  {
    user: new mongoose.Types.ObjectId("507f1f77bcf86cd799439011"), // Replace with real user ID
    messages: [
      {
        role: "user",
        content: "Generate an image of a cat",
        id: "msg-001",
        createdAt: new Date("2025-02-09T14:00:00Z")
      },
      {
        role: "assistant",
        content: null,
        tool_calls: [{
          id: "call-001",
          type: "function",
          function: {
            name: "generateImages",
            arguments: "{\"prompt\":\"A cute cat sitting\"}"
          }
        }],
        id: "msg-002",
        createdAt: new Date("2025-02-09T14:00:01Z")
      },
      {
        role: "tool",
        tool_call_id: "call-001",
        content: "https://example.com/cat-image.png",
        id: "msg-003",
        createdAt: new Date("2025-02-09T14:00:02Z")
      }
    ],
    summary: {
      role: "assistant",
      content: "Generated a cat image",
      refusal: null,
      tool_calls: [],
      parsed: {
        lastInteraction: "2025-02-09T14:00:02Z",
        commandType: "image",
        imageCount: 1
      }
    }
  },
  {
    user: new mongoose.Types.ObjectId("507f1f77bcf86cd799439012"), // Replace with real user ID
    messages: [
      {
        role: "user",
        content: "Tell me a dad joke",
        id: "msg-004",
        createdAt: new Date("2025-02-09T14:30:00Z")
      },
      {
        role: "assistant",
        content: null,
        tool_calls: [{
          id: "call-002",
          type: "function",
          function: {
            name: "getDadJokes",
            arguments: "{}"
          }
        }],
        id: "msg-005",
        createdAt: new Date("2025-02-09T14:30:01Z")
      },
      {
        role: "tool",
        tool_call_id: "call-002",
        content: "Why don't scientists trust atoms? Because they make up everything!",
        id: "msg-006",
        createdAt: new Date("2025-02-09T14:30:02Z")
      }
    ],
    summary: {
      role: "assistant",
      content: "Told a dad joke",
      refusal: null,
      tool_calls: [],
      parsed: {
        lastInteraction: "2025-02-09T14:30:02Z",
        commandType: "joke",
        jokeCount: 1
      }
    }
  }
];

export default chatData;