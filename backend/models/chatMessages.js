import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
    messages: [
      {
        role: {
          type: String,
          enum: ["user", "assistant", "system", "tool"],
          required: true,
        },
        content: {
          type: String,
          required: false, // False because tool calls might not have content
        },
        tool_calls: [{
          // Confuses LLM when passing a MongoDB ID
          _id: false, 
          id: String,
          type: {
            type: String,
            enum: ["function"]
          },
          function: {
            name: String,
            arguments: String
          }
        }],
        tool_call_id: String,
        refusal: String,
        id: {
          type: String,
          // required: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    summary: {
      role: {
        type: String,
        default: "assistant"
      },
      content: String,
      refusal: String,
      tool_calls: Array,
      // Is a special SchemaType in Mongoose that allows for flexible/dynamic content.
      parsed: mongoose.Schema.Types.Mixed
      /*
        When modifying Mixed types, mark the field as modified to trigger save
        doc.summary.parsed = newData;
        doc.markModified('summary.parsed');
        await doc.save(); 
      */
    }
  },
  { timestamps: true }
);


export default mongoose.model("Chat", chatMessageSchema);