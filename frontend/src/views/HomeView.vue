<template>
  <div class="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-100 p-6">
    <div class="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-lg">

      <h2 class="text-2xl font-bold mb-2 text-sky-700">
        ✨ NoteSpark
      </h2>

      <p class="text-sm text-gray-500 mb-4">
        Quick notes. No account needed.
      </p>

      <!-- CTA Banner -->
      <div class="mb-4 p-3 bg-indigo-100 text-indigo-800 rounded-lg text-sm">
        Sign up to permanently save your sparks 🔥
      </div>
    
      <!-- Saving Indicator -->
      <p v-if="isSaving" class="text-xs text-gray-400 mb-3">
        Saving...
      </p>

      <!-- Add Note -->
      <input
        v-model="title"
        class="w-full mb-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
        placeholder="Title"
      />

      <textarea
        v-model="content"
        class="w-full mb-3 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
        placeholder="Write your spark..."
      />

      <button
        @click="handleAdd"
        class="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition"
      >
        Add Spark
      </button>

      <!-- Notes -->
      <div class="mt-6 space-y-4">
        <div
          v-for="note in notes"
          :key="note.id"
          class="border p-4 rounded-xl shadow-sm hover:shadow transition"
        >
          <h3 class="font-semibold text-sky-800">
            {{ note.title }}
          </h3>

          <p class="text-sm text-gray-600 mt-1">
            {{ note.content }}
          </p>

          <button
            @click="handleDelete(note.id)"
            class="text-red-500 text-xs mt-3 hover:underline"
          >
            Delete
          </button>
        </div>
      </div>

    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import {
  getNotes,
  deleteNote,
  saveNotes
} from "@/utils/localStorageNotes";

const notes = ref([]);
const title = ref("");
const content = ref("");
const currentDraftId = ref(null);
const isSaving = ref(false);

let typingTimeout = null;

/* -------------------------
   LOAD EXISTING NOTES
-------------------------- */
onMounted(() => {
  const stored = getNotes();

  notes.value = Array.isArray(stored)
    ? stored.filter(note => note && note.id)
    : [];
});

/* -------------------------
   AUTO SAVE (Debounced)
-------------------------- */
watch([title, content], () => {
  if (!title.value && !content.value) return;

  if (typingTimeout) clearTimeout(typingTimeout);

  isSaving.value = true;

  typingTimeout = setTimeout(() => {
    autoSave();
    isSaving.value = false;
  }, 1000);
});

/* -------------------------
   AUTO SAVE LOGIC
-------------------------- */
function autoSave() {
  // Ensure notes is always an array
  if (!Array.isArray(notes.value)) {
    notes.value = [];
  }

  // UPDATE existing draft
  if (currentDraftId.value !== null) {
    notes.value = notes.value.map(note =>
      note.id === currentDraftId.value
        ? {
            ...note,
            title: title.value,
            content: content.value
          }
        : note
    );
  } 
  // CREATE new draft
  else {
    const newNote = {
      id: Date.now(),
      title: title.value,
      content: content.value,
      createdAt: new Date().toISOString()
    };

    currentDraftId.value = newNote.id;
    notes.value.unshift(newNote);
  }

  saveNotes(notes.value);
}

/* -------------------------
   DELETE NOTE
-------------------------- */
function handleDelete(noteId) {
  deleteNote(noteId);
  notes.value = getNotes() || [];

  if (currentDraftId.value === noteId) {
    currentDraftId.value = null;
    title.value = "";
    content.value = "";
  }
}
</script>