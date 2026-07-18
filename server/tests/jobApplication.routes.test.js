import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

process.env.JWT_SECRET = "test-secret";
process.env.JWT_EXPIRES_IN = "7d";
const list = vi.fn(), create = vi.fn(), get = vi.fn(), update = vi.fn(), remove = vi.fn();
vi.mock("../src/services/jobApplicationService.js", () => ({ listJobApplications: list, createJobApplication: create, getJobApplication: get, updateJobApplication: update, deleteJobApplication: remove }));
const verify = vi.fn();
vi.mock("jsonwebtoken", async () => { const actual = await vi.importActual("jsonwebtoken"); return { ...actual, default: { ...actual.default, verify }, verify }; });
const { createApp } = await import("../src/app.js");
const app = createApp();
const auth = { Authorization: "Bearer token" };

describe("job application routes", () => {
  beforeEach(() => { vi.clearAllMocks(); verify.mockReturnValue({ sub: "user-1" }); });

  it("rejects unauthenticated requests", async () => {
    expect((await request(app).get("/api/job-applications")).status).toBe(401);
    expect(list).not.toHaveBeenCalled();
  });

  it("lists and creates applications for the authenticated user", async () => {
    list.mockResolvedValue([{ id: "application-1", company: "Focus AI" }]);
    create.mockResolvedValue({ id: "application-2", company: "OpenAI", role: "Engineer" });
    const listed = await request(app).get("/api/job-applications").set(auth);
    expect(listed.body).toEqual({ applications: [{ id: "application-1", company: "Focus AI" }] });
    const payload = { company: "OpenAI", role: "Engineer", status: "applied" };
    const created = await request(app).post("/api/job-applications").set(auth).send(payload);
    expect(created.status).toBe(201);
    expect(create).toHaveBeenCalledWith("user-1", payload);
  });

  it("gets, updates, and deletes an owned application", async () => {
    get.mockResolvedValue({ id: "application-1" });
    update.mockResolvedValue({ id: "application-1", status: "interviewing" });
    remove.mockResolvedValue();
    expect((await request(app).get("/api/job-applications/application-1").set(auth)).status).toBe(200);
    expect((await request(app).patch("/api/job-applications/application-1").set(auth).send({ status: "interviewing" })).status).toBe(200);
    expect((await request(app).delete("/api/job-applications/application-1").set(auth)).status).toBe(200);
    expect(remove).toHaveBeenCalledWith("user-1", "application-1");
  });

  it("rejects invalid create and update payloads", async () => {
    expect((await request(app).post("/api/job-applications").set(auth).send({ company: "", role: "Engineer" })).status).toBe(400);
    expect((await request(app).post("/api/job-applications").set(auth).send({ company: "OpenAI", role: "Engineer", followUpDate: "not-a-date" })).status).toBe(400);
    expect((await request(app).patch("/api/job-applications/application-1").set(auth).send({})).status).toBe(400);
    expect(create).not.toHaveBeenCalled();
    expect(update).not.toHaveBeenCalled();
  });
});