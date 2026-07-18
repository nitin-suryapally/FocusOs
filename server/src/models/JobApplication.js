import mongoose from "mongoose";

const JOB_APPLICATION_STATUSES = ["saved", "applied", "interviewing", "offer", "rejected", "withdrawn"];

const jobApplicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  company: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  status: { type: String, enum: JOB_APPLICATION_STATUSES, default: "saved" },
  applicationUrl: { type: String, trim: true, default: "" },
  followUpDate: { type: Date, default: null },
  notes: { type: String, trim: true, default: "" }
}, { timestamps: true });

jobApplicationSchema.methods.toSafeObject = function toSafeObject() {
  return { id: this._id.toString(), company: this.company, role: this.role, status: this.status, applicationUrl: this.applicationUrl, followUpDate: this.followUpDate, notes: this.notes, createdAt: this.createdAt, updatedAt: this.updatedAt };
};

export const JobApplication = mongoose.models.JobApplication || mongoose.model("JobApplication", jobApplicationSchema);