const formatCreatedAt = (createdAt) => new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(createdAt));
const newestFirst = (notes) => [...notes].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));

export const ProjectIdeaProgressNoteList = ({ notes = [] }) => (
  <section className="rounded-[28px] border border-outline-variant/70 bg-surface-container-low p-6 shadow-card">
    <p className="text-label-sm uppercase tracking-[0.18em] text-primary">Progress history</p>
    <h2 className="mt-3 text-2xl font-semibold text-on-surface">Improvements over time.</h2>
    {notes.length === 0 ? <p className="mt-4 text-body-md text-on-surface-variant">No progress notes yet. Add the first improvement above.</p> : <><p className="mt-2 text-body-sm text-on-surface-variant">Newest first</p><ol className="mt-5 space-y-4">{newestFirst(notes).map((note) => <li key={note.id} className="border-l-2 border-primary pl-4"><p className="text-body-md text-on-surface">{note.text}</p><time dateTime={note.createdAt} className="mt-1 block text-body-sm text-on-surface-variant">{formatCreatedAt(note.createdAt)}</time></li>)}</ol></>}
  </section>
);