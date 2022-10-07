const popup = document.querySelector('.popup');
const form = popup.querySelector('form');
const errorText = popup.querySelector('.error-text');
const closeBtn = popup.querySelector('.close-btn');
const title = form.querySelector('input');
const description = form.querySelector('textarea');
const btn = form.querySelector('.add-btn');
const editBtn = form.querySelector('.edit-btn');
const addBtn = document.querySelector('.plus');
const list = document.querySelector('.list');
const popupText = popup.querySelector('.popup-text');
const searchBar = document.querySelector('#search-contact');

let notes = JSON.parse(localStorage.getItem('notes')) || [];

let isUpdated = false;
let date = new Date();

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

class Note {
  title;
  description;
  constructor(title, description, date) {
    this.title = title;
    this.description = description;
    this.date = date;
  }
}

class UI {
  static getNotes() {
    notes = JSON.parse(localStorage.getItem('notes')) || [];
    return notes;
  }
  static showBooks() {
    notes = UI.getNotes();
    UI.clearFields();
    popup.classList.remove('show');
    list.innerHTML = "";
    if (notes.length != 0) {
      notes.forEach((note, index) => {
        let liTag = `<div class="main col-10 p-2 col-md-6 col-xl-3">
                <div id="${index}" class="fade-in note p-1 rounded shadow-sm p-2">
                  <div class="note-header pb-2">
                    <div class="title fs-3 text">${note.title}</div>
                  </div>
                  <div class="note-body pb-2">
                    <div class="note-text text">${note.description}</div>
                  </div>
                  <div class="note-footer flex between">
                    <div class="date text small">${note.date}</div>
                    <div class="settings pt-1">
                      <i onclick="showMenu(this)" class="bi bi-three-dots fs-4 text-primary settings-icon"></i>
                      <ul class="menu p-1 m-0 rounded">
                        <li onclick="UI.editNote(${index})" class="pe-1">
                          <i class="bi bi-pen me-1 p-1 text"></i>
                          <div class="text">Edit</div>
                        </li>
                        <li onclick="UI.deleteNote(${index})" class="pe-1">
                          <i class="bi bi-trash me-1 p-1 text"></i>
                          <div class="text">Delete</div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>`;

        list.innerHTML += liTag;
      })
    } else {
      list.innerHTML = `<div class="row my-5 justify-content-center align-items-center">
       <div class="col-10 fade-in rounded py-2 info shadow-sm col-md-8 text-center text font-normal">You currently have no notes. Click the blue button below to add a note</div>
      </div>`;
    }
  }
  static addBook(title, description, date) {
    notes = UI.getNotes();
    const note = new Note(title, description, date);
    Store.storeBook(note);
    popup.classList.remove('show');
    UI.showBooks();
  }

  static clearFields() {
    title.value = "";
    description.value = "";
  }

  static editNote(index) {
    notes = UI.getNotes();
    btn.style.display = "none";
    editBtn.style.display = "block";
    const note = notes[index];
    popupText.textContent = "Update this Note";
    title.value = note.title;
    description.value = note.description;
    popup.classList.add('show');
    editBtn.onclick = () => {
      if (title.value != '' && description.value != '') {
        date = new Date();
        const noteTitle = title.value;
        const noteDesc = description.value;
        const month = months[date.getMonth()];
        const day = date.getDay();
        const year = date.getFullYear();
        const noteDate = `${month} ${day}, ${year}`;
        note.title = title.value;
        note.description = description.value;
        note.date = noteDate;
        Store.storeNotes(notes);
        UI.clearFields();
      } else {
        errorText.textContent = "All fields are required!";
        errorText.classList.add('show');
      }
    }
  }

  static deleteNote(index) {
    notes = UI.getNotes();
    notes.splice(index, 1);
    Store.storeNotes(notes);
  }
}

class Store {
  static storeBook(note) {
    notes = UI.getNotes();
    notes.push(note);
    localStorage.setItem('notes', JSON.stringify(notes));
  }

  static storeNotes(array) {
    localStorage.setItem('notes', JSON.stringify(array));
    popupText.textContent = "Add a note";
    btn.textContent = "Add Note";
    UI.showBooks();
  }
}


addBtn.onclick = () => {
  popup.classList.add('show');
  btn.style.display = "block";
  editBtn.style.display = "none";
  btn.addEventListener('click', createNote);
}

form.onsubmit = (e) => {
  e.preventDefault();
}

function createNote() {
  date = new Date();
  const noteTitle = title.value;
  const noteDesc = description.value;
  const month = months[date.getMonth()];
  const day = date.getDay();
  const year = date.getFullYear();

  const noteDate = `${month} ${day}, ${year}`;

  if (noteTitle != '' && noteDesc !='') {
    UI.addBook(noteTitle, noteDesc, noteDate);
    UI.clearFields();
  } else {
    errorText.textContent = "All fields are required!";
    errorText.classList.add('show');
  }
}

closeBtn.onclick = () => {
  popup.classList.remove('show');
  errorText.classList.remove('show');
  UI.clearFields();
}

window.onload = () => {
  UI.showBooks();
}

function showMenu(el) {
  const menu = el.nextElementSibling;
  menu.classList.add('show');

  document.addEventListener('click', (e) => {
    if (e.tagName != 'I' && e.target != el) {
      menu.classList.remove('show');
    }
  })
}

searchBar.addEventListener('input', () => {
  let searchTerm = searchBar.value.toLowerCase();
  const noteTexts = document.querySelectorAll('.title');
  noteTexts.forEach(noteText => {
    const listItem = noteText.parentNode.parentNode.parentNode;
    const value = noteText.textContent.toLowerCase();
    console.log(value);
    if (value.indexOf(searchTerm) != -1) {
      listItem.style.display = 'block';
    } else {
      listItem.style.display = 'none';
    }
  })
})

const darkBtn = document.querySelector('.dark-btn');

darkBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  if (document.body.className == "dark-theme") {
    darkBtn.classList.replace('bi-moon', 'bi-sun')
  } else {
    darkBtn.classList.replace('bi-sun', 'bi-moon')
  }
})
