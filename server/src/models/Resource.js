import mongoose from "mongoose";

const RESOURCE_TYPES = ["article", "video", "course", "book", "tool", "document", "other"];
const RESOURCE_STATUSES = ["saved", "in_progress", "completed", "archived"];

const resourceSchema = new mongoose.Schema(
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
    topic: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: RESOURCE_TYPES,
      default: "article"
    },
    status: {
      type: String,
      enum: RESOURCE_STATUSES,
      default: "saved"
    },
    url: {
      type: String,
      trim: true,
      default: ""
    },
    tags: {
      type: [String],
      default: []
    },
    notes: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

resourceSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id.toString(),
    title: this.title,
    topic: this.topic,
    type: this.type,
    status: this.status,
    url: this.url,
    tags: this.tags,
    notes: this.notes,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

export const Resource = mongoose.models.Resource || mongoose.model("Resource", resourceSchema);
