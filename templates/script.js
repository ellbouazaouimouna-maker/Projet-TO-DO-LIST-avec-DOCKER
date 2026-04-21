// INITIALISATION ---
let tasks = JSON.parse(localStorage.getItem('ultraTasks')) || [];
const taskList = document.getElementById('task-list');
const addButton = document.getElementById('add-button');
const themeToggle = document.getElementById('theme-toggle');

// Vérification toutes les 30 secondes
setInterval(checkReminders, 30000);

window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('ultraTheme') === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.textContent = '☀️';
    }
    renderTasks();
});

//  AJOUTER ---
addButton.addEventListener('click', () => {
    const text = document.getElementById('new-task').value.trim();
    const dateInput = document.getElementById('task-date').value;
    const category = document.getElementById('task-category').value;
    const recurrence = document.getElementById('task-recurrence').value;

    if (dateInput) {
        if (new Date(dateInput) < new Date()) {
            alert("Erreur : Date passée !");
            return;
        }
    }

    if (text !== "") {
        const newTask = {
            id: Date.now() + Math.random(),
            text: text,
            date: dateInput,
            category: category,
            recurrence: recurrence,
            completed: false,
            important: false,
            notified: false 
        };
        // Cette partie fait le pont vers Python
        fetch('/api/tasks', {
            method: 'POST', // On envoie des données
            headers: {
                'Content-Type': 'application/json' // On précise que c'est du JSON
                 },
                body: JSON.stringify(newTask) // On transforme l'objet JS en texte pour Python
        })
        .then(response => response.json())
        .then(data => console.log("Réponse de Python :", data));
        tasks.push(newTask);
        saveAndRender();
        document.getElementById('new-task').value = "";
    }
});

// SYSTÈME DE RÉPÉTITION (Mise à jour pour la journée) 
function checkReminders() {
    const now = new Date();
    let changed = false;

    tasks.forEach(t => {
        if (t.date && !t.completed && !t.notified) {
            const taskTime = new Date(t.date);
            
            if (now >= taskTime) {
                alert(`⏰ RAPPEL : ${t.text}`);
                t.notified = true;
                
                if (t.recurrence !== 'none') {
                    const nextDate = new Date(t.date);
                    
                    // NOUVELLES OPTIONS POUR LA JOURNÉE
                    if (t.recurrence === 'hourly') {
                        nextDate.setHours(nextDate.getHours() + 1);
                    } else if (t.recurrence === '4hours') {
                        nextDate.setHours(nextDate.getHours() + 4);
                    } else if (t.recurrence === 'daily') {
                        nextDate.setDate(nextDate.getDate() + 1);
                    } else if (t.recurrence === 'weekly') {
                        nextDate.setDate(nextDate.getDate() + 7);
                    }
                    
                    t.date = nextDate.toISOString();
                    t.notified = false; // Prêt pour la prochaine répétition dans la journée
                }
                changed = true;
            }
        }
    });
    if (changed) saveAndRender();
}

// --- RENDU ET ACTIONS ---
function saveAndRender() {
    localStorage.setItem('ultraTasks', JSON.stringify(tasks));
    renderTasks();
    checkAllDone();
}

function renderTasks() {
    const filterCat = document.getElementById('filter-category').value;
    const searchText = document.getElementById('search').value.toLowerCase();
    taskList.innerHTML = "";

    tasks.filter(t => (filterCat === 'all' || t.category === filterCat) && t.text.toLowerCase().includes(searchText))
         .sort((a, b) => b.important - a.important)
         .forEach(t => {
            const li = document.createElement('li');
            li.className = `task ${t.completed ? 'completed' : ''} ${t.important ? 'important' : ''}`;
            let dateInfo = t.date ? new Date(t.date).toLocaleString('fr-FR', {hour:'2-digit', minute:'2-digit', day:'2-digit', month:'2-digit'}) : "";

            li.innerHTML = `
                <button class="star-button" onclick="toggleStar(${t.id})">${t.important ? '⭐' : '☆'}</button>
                <div class="task-info">
                    <span class="text-content" onclick="editTask(${t.id})">${t.text}</span>
                    <span class="date-recur-info">${dateInfo} ${t.recurrence !== 'none' ? '🔄' : ''} <span class="category-tag">${t.category}</span></span>
                </div>
                <div class="actions">
                    <button onclick="toggleComplete(${t.id})">✔</button>
                    <button onclick="deleteTask(${t.id})">✖</button>
                </div>`;
            taskList.appendChild(li);
         });
    updateStats();
}

function checkAllDone() {
    const msg = document.getElementById('congrats-msg');
    msg.style.display = (tasks.length > 0 && tasks.every(t => t.completed)) ? 'block' : 'none';
}

function toggleComplete(id) {
    const t = tasks.find(x => x.id === id);
    t.completed = !t.completed;
    if(t.completed) new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play().catch(()=>{});
    saveAndRender();
}

function toggleStar(id) {
    const t = tasks.find(x => x.id === id);
    t.important = !t.important;
    saveAndRender();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveAndRender();
}

function editTask(id) {
    const t = tasks.find(x => x.id === id);
    const n = prompt("Modifier :", t.text);
    if(n) { t.text = n; saveAndRender(); }
}

function updateStats() {
    const total = tasks.length;
    const done = tasks.filter(t => t.completed).length;
    const p = total === 0 ? 0 : (done / total) * 100;
    document.getElementById('progress-bar-fill').style.width = p + "%";
    document.getElementById('stats-text').textContent = `${done}/${total} terminées`;
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('ultraTheme', isDark ? 'dark' : 'light');
});

document.getElementById('search').addEventListener('input', renderTasks);
document.getElementById('filter-category').addEventListener('change', renderTasks);