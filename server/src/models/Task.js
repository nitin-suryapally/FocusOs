import mongoose from "mongoose";

const TASK_TYPES = ["general", "learning"];
const TASK_PRIORITIES = ["low", "medium", "high"];

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: TASK_TYPES, default: "general" },
    priority: { type: String, enum: TASK_PRIORITIES, default: "medium" },
    dueDate: { type: Date, default: null },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
    topic: { type: String, trim: true, default: "" },
    resource: { type: mongoose.Schema.Types.ObjectId, ref: "Resource", default: null }
  },
  { timestamps: true }
);

taskSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id.toString(),
    title: this.title,
    type: this.type,
    priority: this.priority,
    dueDate: this.dueDate,
    completed: this.completed,
    completedAt: this.completedAt,
    topic: this.topic,
    resource: this.resource && this.resource.title !== undefined ? {
      id: this.resource._id.toString(),
      title: this.resource.title,
      topic: this.resource.topic
    } : null,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

export const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);