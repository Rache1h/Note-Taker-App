const quill = new Quill("#editor", {
  theme: "snow",
  modules: {
    toolbar: "#toolbar",
  },
});

// 5. Update #saveStatus and #wordCount as the user types.

const saveBtn = document.getElementById("saveNoteButton");
const noteList = document.getElementById("noteList");
const editor = document.getElementById("editor");
const noteTitle = document.getElementById("noteTitle");
const newNoteBtn = document.getElementById("newNoteButton");
const deleteBtn = document.getElementById("deleteNoteButton");
const searchInput = document.getElementById("noteSearch");
const wordCounter = document.getElementById("wordCount")


let notes = JSON.parse(localStorage.getItem("notes") || "[]");
let currentNoteId = null;
renderNotes(notes);
updateWordCount ()

noteList.addEventListener("click", (e) => {
  const noteCard = e.target.closest(".note-card");
  if (!noteCard) return;
  currentNoteId = Number(noteCard.dataset.noteId);
  renderNotes(notes)

  const currentNote = notes.find((note) => note.id === currentNoteId);
  noteTitle.value = currentNote.title;
  quill.root.innerHTML = currentNote.content;
  updateWordCount()
});

quill.on("text-change", () => {
  updateWordCount()
})

saveBtn.addEventListener("click", () => {
  if (currentNoteId === null) {
    const note = {
      id: Date.now(),
      title: noteTitle.value,
      content: quill.root.innerHTML,
    };
    notes.push(note);
    currentNoteId = note.id;
  } else {
    const currentNote = notes.find((note) => note.id === currentNoteId);
    currentNote.title = noteTitle.value;
    currentNote.content = quill.root.innerHTML;
  }
  localStorage.setItem("notes", JSON.stringify(notes));
  updateWordCount()
  renderNotes(notes);
});

newNoteBtn.addEventListener("click", () => {
  currentNoteId = null;
  noteTitle.value = "";
  quill.root.innerHTML = "";
});

deleteBtn.addEventListener("click", () => {
  if (currentNoteId === null) return;
  notes = notes.filter((note) => note.id !== currentNoteId);
  localStorage.setItem("notes", JSON.stringify(notes));

  renderNotes(notes);
  currentNoteId = null;
  noteTitle.value = "";
  quill.root.innerHTML = "";
});

searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredNotes = notes.filter((note) => {
    return note.title.toLowerCase().includes(searchTerm);
  });
  renderNotes(filteredNotes);
});

function renderNotes(notesToRender) {
  noteList.innerHTML = "";

  notesToRender.forEach((note) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = note.content;

    const plainText = tempDiv.textContent || "";
    const previewText =
    plainText.length > 50
    ? `${plainText.slice(0, 50)}...`
    : plainText;

    const isActive = note.id === currentNoteId ? "is-active" : ""
    noteList.innerHTML += `
      <button class="note-card ${isActive}" type="button" data-note-id="${note.id}">
        <span class="note-title">${note.title}</span>
        <span class="note-preview">${previewText}</span>
        <span class="note-meta">Saved</span>
      </button>
`;
  });

}

function updateWordCount () {
const text = quill.getText().trim()
const wordCount = text === ""
? 0
: text.split(/\s+/).length;
wordCounter.innerText = `${wordCount} ${wordCount === 1 ? "word" : "words"
}`

}
