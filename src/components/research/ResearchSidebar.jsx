import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, BookOpen, X, ExternalLink } from "lucide-react";
import { ALL_PEPTIDES } from "@/components/stack/peptideData";

const VIAL_IMG = "/images/product-vial.png";

export function trackPeptideView(peptideId) {
  const key = "cl_recent_peptides";
  const existing = JSON.parse(localStorage.getItem(key) || "[]");
  const updated = [peptideId, ...existing.filter((id) => id !== peptideId)].slice(0, 8);
  localStorage.setItem(key, JSON.stringify(updated));
}

export function saveStudyNote(peptideId, peptideName, noteText) {
  const key = "cl_study_notes";
  const existing = JSON.parse(localStorage.getItem(key) || "[]");
  const note = {
    id: Date.now(),
    peptideId,
    peptideName,
    text: noteText,
    savedAt: new Date().toISOString(),
  };
  const updated = [note, ...existing].slice(0, 20);
  localStorage.setItem(key, JSON.stringify(updated));
}

export default function ResearchSidebar() {
  const [recentIds, setRecentIds] = useState([]);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem("cl_recent_peptides") || "[]");
    setRecentIds(ids);
    const n = JSON.parse(localStorage.getItem("cl_study_notes") || "[]");
    setNotes(n);
  }, []);

  const recentPeptides = recentIds
    .map((id) => ALL_PEPTIDES.find((p) => p.id === id))
    .filter(Boolean);

  const removeNote = (noteId) => {
    const updated = notes.filter((n) => n.id !== noteId);
    setNotes(updated);
    localStorage.setItem("cl_study_notes", JSON.stringify(updated));
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (recentPeptides.length === 0 && notes.length === 0) return null;

  return (
    <aside className="space-y-5" aria-label="Research activity sidebar">

      {/* Recently Viewed */}
      {recentPeptides.length > 0 && (
        <div className="bg-white rounded-2xl border border-border/60 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-foreground">Recently Viewed</h2>
          </div>
          <ul className="space-y-1.5">
            {recentPeptides.map((p) => (
              <li key={p.id}>
                <Link
                  to={`/peptide/${p.id}`}
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-secondary/60 hover:text-primary transition-all group"
                  aria-label={`View ${p.name} research profile`}
                >
                  <img src={VIAL_IMG} alt={p.name} className="w-7 h-7 object-contain bg-secondary/60 rounded-lg p-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">{p.name}</p>
                    <p className="text-[9px] text-muted-foreground truncate">{p.tagline?.split(".")[0]}</p>
                  </div>
                  <ExternalLink className="w-3 h-3 text-muted-foreground/40 group-hover:text-primary/60 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Saved Study Notes */}
      {notes.length > 0 && (
        <div className="bg-white rounded-2xl border border-border/60 p-4">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-foreground">Saved Notes</h2>
          </div>
          <ul className="space-y-2">
            {notes.slice(0, 5).map((note) => (
              <li key={note.id}
                className="relative p-2.5 rounded-lg bg-secondary/30 border border-border/40 group hover:border-primary/25 transition-colors">
                <div className="flex items-start justify-between gap-1 mb-0.5">
                  <Link to={`/peptide/${note.peptideId}`}
                    className="text-[10px] font-bold text-primary hover:underline truncate">
                    {note.peptideName}
                  </Link>
                  <span className="text-[9px] text-muted-foreground flex-shrink-0">{formatDate(note.savedAt)}</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">{note.text}</p>
                <button
                  onClick={() => removeNote(note.id)}
                  aria-label="Remove note"
                  className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive">
                  <X className="w-3 h-3" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
          {notes.length > 5 && (
            <p className="text-[10px] text-muted-foreground mt-2 text-center">{notes.length - 5} more notes saved</p>
          )}
        </div>
      )}
    </aside>
  );
}