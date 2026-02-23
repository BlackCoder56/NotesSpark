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
            {{ 
                note.title
            }}
          </h3>

          <p class="text-sm text-gray-600 mt-1">
            {{ getPreview(note.content) }}
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
    <transition name="toast">
        <div
            v-if="notification.show"
            class="fixed top-6 left-1/2 -translate-x-1/2 bg-sky-600 text-white px-5 py-3 rounded-xl shadow-xl text-sm z-50"
        >
            {{ notification.message }}
        </div>
    </transition>
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
const notification = ref({
  show: false,
  message: "",
  type: "info"
});

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

  typingTimeout = setTimeout(() => {
    autoSave();
    showNotification("Your Note Spark was auto-saved successfully ✨", "success");
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

function showNotification(message, type = "info") {
  notification.value = {
    show: true,
    message,
    type
  };

  setTimeout(() => {
    notification.value.show = false;
  }, 2000);
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

function getPreview(content){
    if(!content) return "";

    return content.length > 20
    ? content.slice(0, 20) + "..."
    : content;
}
</script>
<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from{
    opacity: 0;
    transform: translate(-50%, -20px);
}

.toast-leave-active{
    opacity:0;
    transform: translate(50%, -20px);
}
</style>