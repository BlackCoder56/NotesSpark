const NOTE_SPARK_KEY = "note_spark_notes";

export function getNotes() {
  try {
    const data = localStorage.getItem(NOTE_SPARK_KEY);
    const parsed = data ? JSON.parse(data) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Storage corrupted, resetting...");
    localStorage.removeItem(NOTE_SPARK_KEY);
    return [];
  }
}

export function saveNotes(notes) {
  if (!Array.isArray(notes)) {
    console.warn("Invalid notes format.");
    return;
  }

  localStorage.setItem(NOTE_SPARK_KEY, JSON.stringify(notes));
}

export function addNote(note) {
  if (!note || !note.id) {
    console.warn("Invalid note object:", note);
    return;
  }

  const notes = getNotes();
  notes.push(note);
  saveNotes(notes);
}

export function updateNote(updatedNote) {
  if (!updatedNote || !updatedNote.id) {
    console.warn("Invalid updated note:", updatedNote);
    return;
  }

  const notes = getNotes().map(note =>
    note && note.id === updatedNote.id ? updatedNote : note
  );

  saveNotes(notes);
}

export function deleteNote(noteId) {
  const notes = getNotes().filter(
    note => note && note.id !== noteId
  );

  saveNotes(notes);
}

export function clearNoteSpark() {
  localStorage.removeItem(NOTE_SPARK_KEY);
}