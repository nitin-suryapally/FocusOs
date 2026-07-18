import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ConfirmActionModal } from "../../../components/ConfirmActionModal";
import { useAuthToken } from "../../../store/useAuthStore";
import { addProjectIdeaProgressNoteRequest, deleteProjectIdeaRequest, fetchProjectIdeaRequest } from "../api/projectIdeasApi";
import { ProjectIdeaProgressNoteForm } from "../components/ProjectIdeaProgressNoteForm";
import { ProjectIdeaProgressNoteList } from "../components/ProjectIdeaProgressNoteList";

export const ProjectIdeaDetailPage = () => {
  const { ideaId } = useParams();
  const navigate = useNavigate();
  const token = useAuthToken();
  const [idea, setIdea] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [note, setNote] = useState("");
  const [noteError, setNoteError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const loadIdea = async () => {
    if (!token) { setError("Authentication required."); setIsLoading(false); return; }
    setIsLoading(true); setError(null);
    try { setIdea((await fetchProjectIdeaRequest(token, ideaId)).idea); } catch (requestError) { setError(requestError.message || "Unable to load project idea."); } finally { setIsLoading(false); }
  };

  useEffect(() => { loadIdea(); }, [token, ideaId]);

  const submitNote = async (event) => {
    event.preventDefault();
    if (!note.trim()) { setNoteError("Progress note is required."); return; }
    if (!token) { setNoteError("Authentication required."); return; }
    setIsSubmitting(true); setNoteError(null);
    try { const result = await addProjectIdeaProgressNoteRequest(token, ideaId, { text: note.trim() }); setIdea(result.idea); setNote(""); } catch (requestError) { setNoteError(requestError.message || "Unable to add progress note."); } finally { setIsSubmitting(false); }
  };

  const deleteIdea = async () => {
    if (!token) { setDeleteError("Authentication required."); return; }
    setIsDeleting(true); setDeleteError(null);
    try { await deleteProjectIdeaRequest(token, ideaId); navigate("/app/projects"); } catch (requestError) { setDeleteError(requestError.message || "Unable to delete project idea."); } finally { setIsDeleting(false); }
  };

  if (isLoading) return <section aria-label="Project idea loading state" className="animate-pulse rounded-[28px] border border-outline-variant/70 bg-surface-container-low p-8 shadow-card"><div className="h-4 w-28 rounded-full bg-surface-container-high" /><div className="mt-5 h-10 w-2/3 rounded-full bg-surface-container-high" /></section>;
  if (error) return <section className="rounded-[28px] border border-error/20 bg-error-container/90 p-6 shadow-card"><p className="text-label-sm uppercase tracking-[0.18em] text-error">Could not load project idea</p><p className="mt-3 text-body-md text-on-error-container">{error}</p><div className="mt-5 flex gap-3"><button type="button" onClick={loadIdea} className="rounded-xl bg-primary px-4 py-3 text-label-md text-on-primary">Retry</button><Link to="/app/projects" className="rounded-xl border border-outline-variant px-4 py-3 text-label-md text-on-surface">Back to ideas</Link></div></section>;

  return <div className="space-y-6"><section className="rounded-[28px] border border-outline-variant/70 bg-surface/82 p-6 shadow-card backdrop-blur-sm sm:p-8"><div className="flex flex-wrap items-center justify-between gap-4"><Link to="/app/projects" className="text-label-md text-primary">Back to ideas</Link><button type="button" onClick={() => { setDeleteError(null); setIsDeleteOpen(true); }} className="rounded-xl border border-error/50 px-4 py-2 text-label-md text-error">Delete idea</button></div><p className="mt-5 text-label-sm uppercase tracking-[0.2em] text-primary">{idea.status.replace("_", " ")}</p><h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-on-surface sm:text-4xl">{idea.title}</h1>{idea.description ? <p className="mt-4 max-w-3xl text-body-lg text-on-surface-variant">{idea.description}</p> : null}<div className="mt-6 border-t border-outline-variant/60 pt-4"><p className="text-label-sm uppercase tracking-[0.15em] text-on-surface-variant">Next step</p><p className="mt-2 text-body-md text-on-surface">{idea.nextStep || "Not set"}</p></div>{deleteError ? <p className="mt-5 text-body-sm text-error">{deleteError}</p> : null}</section><div className="grid gap-6 lg:grid-cols-2"><ProjectIdeaProgressNoteForm value={note} error={noteError} isSubmitting={isSubmitting} onChange={(event) => { setNote(event.target.value); if (noteError) setNoteError(null); }} onSubmit={submitNote} /><ProjectIdeaProgressNoteList notes={idea.progressNotes} /></div><ConfirmActionModal isOpen={isDeleteOpen} title="Delete project idea?" description={`Delete ${idea.title}? This also removes its progress history.`} confirmLabel="Delete idea" isConfirming={isDeleting} onCancel={() => setIsDeleteOpen(false)} onConfirm={deleteIdea} testId="project-idea-delete-confirmation" /></div>;
};