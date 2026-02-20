const NOTE_SPARK_KEY = "note_spark_notes";

export function getNotes() {
  try {
    const data = localStorage.getItem("notes");
    const parsed = data ? JSON.parse(data) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Storage corrupted, resetting...");
    return [];
  }
}

export function saveNotes(notes){
    // Save the notes array to localStorage as a JSON string
    localStorage.setItem(NOTE_SPARK_KEY, JSON.stringify(notes));
}

export function addNote(note){
    const notes = getNotes(); // Retrieve existing notes from localStorage
    notes.push(note); // Add the new note to the end of the array
    saveNotes(notes); // Save the updated notes array back to localStorage
}

export function updateNote(updatedNote){
    const notes = getNotes().map(
        note => note.id === updatedNote.id ? updatedNote : note
    ); // Update the note with the matching id
    saveNotes(notes); // Save the updated notes array back to localStorage
}

export function deleteNote(noteId){
    const notes = getNotes().filter(
        note => note.id !== noteId
    );
    saveNotes(notes);
}

export function clearNoteSpark(){
    localStorage.removeItem(NOTE_SPARK_KEY);
}
