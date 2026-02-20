const NOTE_SPARK_KEY = "note_spark_notes";

export function getNotes(){
    // Retrieve the notes from localStorage and parse them as JSON. If there are no notes, return an empty array.
    const notes = localStorage.getItem(NOTE_SPARK_KEY);
    return notes ? JSON.parse(notes) : [];
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
