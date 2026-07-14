import mongoose from "mongoose";

const TASK_TYPES = ["general", "learning"];
const TASK_PRIORITIES = ["low", "medium", "high"];

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: TASK_TYPES,
      default: "general"
    },
    priority: {
      type: String,
      enum: TASK_PRIORITIES,
      default: "medium"
    },
    dueDate: {
      type: Date,
      default: null
    },
    completed: {
      type: Boolean,
      default: false
    },
    topic: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

taskSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id.toString(),
    title: this.title,
    type: this.type,
    priority: this.priority,
    dueDate: this.dueDate,
    completed: this.completed,
    topic: this.topic,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

export const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);
