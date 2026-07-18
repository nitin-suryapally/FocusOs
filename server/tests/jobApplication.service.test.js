import { beforeEach, describe, expect, it, vi } from "vitest";

const find = vi.fn(), create = vi.fn(), findOne = vi.fn(), findOneAndUpdate = vi.fn();
vi.mock("../src/models/JobApplication.js", () => ({ JobApplication: { find, create, findOne, findOneAndUpdate } }));
const { createJobApplication, deleteJobApplication, getJobApplication, listJobApplications, updateJobApplication } = await import("../src/services/jobApplicationService.js");

describe("job application service", () => {
  beforeEach(() => vi.clearAllMocks());

  it("lists applications scoped to the user", async () => {
    const sort = vi.fn().mockResolvedValue([{ toSafeObject: () => ({ id: "application-1" }) }]);
    find.mockReturnValue({ sort });
    await expect(listJobApplications("user-1")).resolves.toEqual([{ id: "application-1" }]);
    expect(find).toHaveBeenCalledWith({ user: "user-1" });
    expect(sort).toHaveBeenCalledWith({ updatedAt: -1 });
  });

  it("creates a normalized application for the user", async () => {
    create.mockResolvedValue({ toSafeObject: () => ({ id: "application-1", company: "Focus AI" }) });
    await createJobApplication("user-1", { company: " Focus AI ", role: " Product engineer ", applicationUrl: " https://example.com/jobs/1 ", notes: " Follow up ", followUpDate: "" });
    expect(create).toHaveBeenCalledWith({ user: "user-1", company: "Focus AI", role: "Product engineer", applicationUrl: "https://example.com/jobs/1", notes: "Follow up", followUpDate: null });
  });

  it("gets, updates, and deletes only owned applications", async () => {
    const deleteOne = vi.fn();
    findOne.mockResolvedValue({ toSafeObject: () => ({ id: "application-1" }), deleteOne });
    await getJobApplication("user-1", "application-1");
    expect(findOne).toHaveBeenCalledWith({ _id: "application-1", user: "user-1" });
    findOneAndUpdate.mockResolvedValue({ toSafeObject: () => ({ id: "application-1", status: "applied" }) });
    await updateJobApplication("user-1", "application-1", { status: "applied" });
    expect(findOneAndUpdate).toHaveBeenCalledWith({ _id: "application-1", user: "user-1" }, { status: "applied" }, { new: true, runValidators: true });
    await deleteJobApplication("user-1", "application-1");
    expect(deleteOne).toHaveBeenCalled();
  });

  it("rejects missing applications", async () => {
    findOne.mockResolvedValue(null);
    await expect(getJobApplication("user-1", "missing")).rejects.toMatchObject({ statusCode: 404, message: "Job application not found." });
  });
});