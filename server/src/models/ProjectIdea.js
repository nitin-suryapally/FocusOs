import mongoose from "mongoose";

const PROJECT_IDEA_STATUSES = ["idea", "planned", "in_progress", "completed", "archived"];

const progressNoteSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true }
}, { _id: true, timestamps: { createdAt: true, updatedAt: false } });

const projectIdeaSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: "" },
  status: { type: String, enum: PROJECT_IDEA_STATUSES, default: "idea" },
  nextStep: { type: String, trim: true, default: "" },
  progressNotes: { type: [progressNoteSchema], default: [] }
}, { timestamps: true });

projectIdeaSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id.toString(),
    title: this.title,
    description: this.description,
    status: this.status,
    nextStep: this.nextStep,
    progressNotes: this.progressNotes.map((note) => ({ id: note._id.toString(), text: note.text, createdAt: note.createdAt })),
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

export const ProjectIdea = mongoose.models.ProjectIdea || mongoose.model("ProjectIdea", projectIdeaSchema);