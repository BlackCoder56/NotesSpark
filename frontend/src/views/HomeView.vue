<template>
  <div class="h-screen overflow-hidden bg-gradient-to-br from-sky-50 to-indigo-100 p-6">
    <div class="max-w-7xl mx-auto h-full grid grid-cols-1 lg:grid-cols-12 gap-8">

      <!-- Notes List (LEFT) -->
    <div class="lg:col-span-3 bg-white p-6 rounded-2xl shadow-lg h-full flex flex-col overflow-hidden">
  
  <h3 class="font-semibold text-sky-800 mb-4 shrink-0">
    Your Sparks
  </h3>

  <div v-if="notes.length === 0"
       class="text-gray-400 text-sm text-center py-10 flex-1">
    No sparks yet! Start typing to create your one.
  </div>

  <div v-else
       class="flex-1 overflow-y-auto space-y-4 pr-2">

    <div
      v-for="note in notes"
      :key="note.id"
      @click="editNote(note)"
      :class="[
        'cursor-pointer border p-4 rounded-xl shadow-sm hover:shadow transition',
        note.id === currentDraftId ? 'bg-sky-100 border-sky-300' : ''
      ]"
    >
      <h3 class="font-semibold text-sky-800">
        {{ note.title || "Untitled" }}
      </h3>

      <p class="text-sm text-gray-600 mt-1">
        {{ getPreview(note.content) }}
      </p>

      <button
        @click.stop="handleDelete(note.id)"
        class="text-red-500 text-xs mt-3 hover:underline"
      >
        Delete
      </button>
    </div>

  </div>
</div>

      <!-- Editor (Middle/right) -->
       <div class="lg:col-span-6 bg-white p-6 rounded-2xl shadow-lg min-h-[80vh]">
        <div class="flex items-center justify-between mb-2">
           <h2 class="text-2xl font-bold mb-2 text-sky-700">
            Note Spark
          </h2>

          <button 
            @click="createNewNote"
            class="px-4 py-2 text-sm font-medium 
                  rounded-xl bg-sky-600 text-white 
                  hover:bg-sky-700 active:scale-95 
                  transition-all duration-150 shadow-sm"
                  >+ New Note</button>
        </div>
       
        <p class="text-sm text-gray 500 mb-4">
          Quick notes. No account needed.
        </p>

        <div class="mb-4 p-3 bg-indigo-100 text-indigo-800 rounded-lg text-sm">
          Signup up to permanently save your sparks 🔥
        </div>

        <div class="mb-6">

          <label for="title" class="block text-sm font-medium text-gray-600 mb-2">
            Title
          </label>

          <input 
            id="title"
            v-model="title"
            placeholder="Enter a title..."
            type="text" 
            class="w-full px-4 py-3 rounded-2xl bg-gray-100/70 
                  focus:bg-white focus:ring-2 focus:ring-sky-400 focus:outline-none 
                  transition-all duration-200 placeholder-gray-400"
          />

        </div>

       <!-- Content Field -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-600 mb-2">
          Content
        </label>

        <textarea
  v-model="content"
  placeholder="Start writing your spark..."
  class="book-textarea"
></textarea>
      </div>

        <div class="mb-4 p-3 bg-indigo-100 text-indigo-800 rounded-lg text-sm">
          Signup
        </div>
       </div>

       <!-- Adds panel -->
        <div class="hidden lg:block lg:col-span-3 bg-white/40 rounded-2xl min-h-[80vh] border border-dashed border-sky-200">

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
  import { ref, onMounted, watch, nextTick } from "vue";
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
      resetEditor();
    }
  }

  function getPreview(content){
      if(!content) return "";

      return content.length > 20
      ? content.slice(0, 20) + "..."
      : content;
  }

  function resetEditor() {
    currentDraftId.value = null;
    title.value = "";
    content.value = "";
  }

  function createNewNote(){
    resetEditor();
  }

  // When a note is clicked, load it into the editor
  function editNote(note) {
    currentDraftId.value = note.id;
    title.value = note.title;
    content.value = note.content;

    // Scroll to the selected note in the list
    nextTick(() => {
        const el = document.getElementById(`note-${note.id}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center'});
      });
  }

</script>

<style scoped>

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgb(100, 116, 139, 0.3);
  border-radius: 3px;
}

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

  .book-textarea {
  width: 100%;
  min-height: 320px;
  resize: none;

  padding: 2rem 2rem;
  border-radius: 24px;
  border: none;
  outline: none;

  font-size: 1rem;
  line-height: 1.8rem;
  font-family: 'Georgia', 'Times New Roman', serif;

  background-color: #fdfcf7;

  /* notebook lines */
  background-image: repeating-linear-gradient(
    to bottom,
    transparent,
    transparent 1.7rem,
    rgba(0, 0, 0, 0.05) 1.75rem
  );

  box-shadow: 
    inset 0 1px 3px rgba(0,0,0,0.05),
    0 4px 20px rgba(0,0,0,0.05);

  transition: all 0.2s ease;
}

.book-textarea:focus {
  background-color: #ffffff;
  box-shadow: 
    inset 0 1px 3px rgba(0,0,0,0.05),
    0 0 0 2px #38bdf8,
    0 6px 25px rgba(0,0,0,0.08);
}

.book-textarea::placeholder {
  color: #a8a29e;
  font-style: italic;
}

</style>