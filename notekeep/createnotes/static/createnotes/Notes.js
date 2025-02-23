
const mainContainer = document.getElementById('main-container');
const allNotes = []
let selectedNote = null;
document.addEventListener('DOMContentLoaded', () => {
    fetchNotes();
    document.getElementById("cancelNoteModalBtn").addEventListener('click', () => closeModal("addNoteModal"));
    const addNoteForm = document.getElementById('addNoteForm');
    addNoteForm.addEventListener('submit', (e) => handleSubmit(e));
    // console.log(addNoteForm);
});

function openModal(modalId) {
    document.getElementById(modalId).classList.remove("hidden");
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add("hidden");
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

async function fetchNotes() {
    try {
        const response = await fetch(`/api/get-all-notes/`, {
            method: 'GET',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
            renderNotes(data.notes);
        } else {
            console.error('Error fetching workspaces:', data.message);
        }
    } catch (error) {
        console.error('Error fetching workspaces:', error);
    }
}

async function deleteNote(id) {
    try {
        const response = await fetch(`/api/delete-note/${id}/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
            fetchNotes();
        } else {
            console.error('Error fetching workspaces:', data.message);
        }
    } catch (error) {
        console.error('Error fetching workspaces:', error);
    }

}

function renderNotes(notes) {
    const newNotes = notes;
    mainContainer.innerHTML = '';
    newNotes.forEach(note => {
        const noteDiv = createNote(note);
        console.log(noteDiv);
        mainContainer.appendChild(noteDiv);
    })

    mainContainer.innerHTML += ` <button id='add-btn' class="fixed sm:absolute left-1/2 bottom-8 transform -translate-x-1/2 bg-[#4f46e5] rounded-xl text-white px-4 py-2">
                                    Add Note
                                </button>`

    document.querySelector('#add-btn').addEventListener('click', () => openModal("addNoteModal"));
}

function createNote(note) {
    const dateObj = new Date(note.created_date);
    const formattedDate = dateObj.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const noteDiv = document.createElement('div');
    noteDiv.className = "relative w-full sm:w-[18rem] h-[24rem] rounded-[2rem] bg-zinc-900 overflow-hidden text-white p-5 flex-shrink-0";
    noteDiv.id = `note-${note.id}`;
    noteDiv.innerHTML = `<div class="py-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="24px" height="24px" fill="white">
                        <path
                        d="M 33.5 9 C 26.3 9 20.5 14.8 20.5 22 L 20.5 102 C 20.5 109.2 26.3 115 33.5 115 L 94.5 115 C 101.7 115 107.5 109.2 107.5 102 L 107.5 22 C 107.5 14.8 101.7 9 94.5 9 L 33.5 9 z M 33.5 15 L 94.5 15 C 98.4 15 101.5 18.1 101.5 22 L 101.5 102 C 101.5 105.9 98.4 109 94.5 109 L 33.5 109 C 29.6 109 26.5 105.9 26.5 102 L 26.5 22 C 26.5 18.1 29.6 15 33.5 15 z M 33.5 22 L 33.5 37 L 94.5 37 L 94.5 22 L 33.5 22 z M 37.5 51 C 35.8 51 34.5 52.3 34.5 54 C 34.5 55.7 35.8 57 37.5 57 L 88.5 57 C 90.2 57 91.5 55.7 91.5 54 C 91.5 52.3 90.2 51 88.5 51 L 37.5 51 z M 37.5 66 C 35.8 66 34.5 67.3 34.5 69 C 34.5 70.7 35.8 72 37.5 72 L 88.5 72 C 90.2 72 91.5 70.7 91.5 69 C 91.5 67.3 90.2 66 88.5 66 L 37.5 66 z M 37.5 81 C 35.8 81 34.5 82.3 34.5 84 C 34.5 85.7 35.8 87 37.5 87 L 64 87 C 65.7 87 67 85.7 67 84 C 67 82.3 65.7 81 64 81 L 37.5 81 z" />
                        </svg>
                        </div>
                        <div class="font-medium text-big" >${note.title}</div>
                        <div class="text text-gray-300" >${note.description}</div>
                        
                        <div class="footer absolute bottom-0 left-0 bg-[#4f46e5] w-full h-12 text-white px-5 pt-2">
                            <div class="flex items-center justify-between">
                                <div class="text-sm">${formattedDate}</div>
                                <button class='edit' onclick="deleteNote(${note.id})">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="white" width="24px" height="24px">
                                    <path
                                    d="M 24 4 C 12.972066 4 4 12.972074 4 24 C 4 35.027926 12.972066 44 24 44 C 35.027934 44 44 35.027926 44 24 C 44 12.972074 35.027934 4 24 4 z M 24 7 C 33.406615 7 41 14.593391 41 24 C 41 33.406609 33.406615 41 24 41 C 14.593385 41 7 33.406609 7 24 C 7 14.593391 14.593385 7 24 7 z M 30.486328 15.978516 A 1.50015 1.50015 0 0 0 29.439453 16.439453 L 24 21.878906 L 18.560547 16.439453 A 1.50015 1.50015 0 0 0 17.484375 15.984375 A 1.50015 1.50015 0 0 0 16.439453 18.560547 L 21.878906 24 L 16.439453 29.439453 A 1.50015 1.50015 0 1 0 18.560547 31.560547 L 24 26.121094 L 29.439453 31.560547 A 1.50015 1.50015 0 1 0 31.560547 29.439453 L 26.121094 24 L 31.560547 18.560547 A 1.50015 1.50015 0 0 0 30.486328 15.978516 z" />
                                    </svg>
                                </button>
                            </div>
                        </div>`

    return noteDiv;
}

async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    console.log('Form Data:', formData);

    try {
        const response = await fetch('/api/create-note/', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
            console.log('Note created successfully:', data.note);
            closeModal("addNoteModal");
            fetchNotes();
        } else {
            console.error('Error creating note:', data.message);
        }
    } catch (error) {
        console.error('Error creating note:', error);
    }
}

