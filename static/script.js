document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const highlightedTasksList = document.getElementById('highlightedTasksList');
    const deletedTasksList = document.getElementById('deletedTasksList');
    const clearDeletedTasksButton = document.getElementById('clearDeletedTasks');
    const editModal = document.getElementById('editModal');
    const editTaskInput = document.getElementById('editTaskInput');
    const saveEditButton = document.getElementById('saveEdit');
    const closeModalButton = document.querySelector('.close');
    let currentTaskItem = null;

    // Cargar tareas desde localStorage
    loadTasks();

    // Mostrar la aplicación después de 2 segundos
    setTimeout(function() {
        document.getElementById('loading-screen').style.display = 'none';
        document.querySelector('.sidebar').style.display = 'block';
        document.querySelector('.main-content').style.display = 'block';
    }, 2000);

    // Navegación entre secciones
    document.querySelectorAll('.sidebar a').forEach(link => {
        link.addEventListener('click', function() {
            const sectionToShow = this.getAttribute('data-section');
            document.querySelectorAll('.container').forEach(section => {
                section.style.display = (section.id === `${sectionToShow}-section`) ? 'block' : 'none';
            });
            if (sectionToShow === 'my-tasks') {
                document.getElementById('task-form-section').style.display = 'block';
            } else {
                document.getElementById('task-form-section').style.display = 'none';
            }
        });
    });

    // Agregar tarea
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        if (taskText) {
            const taskItem = createTaskItem(taskText);
            taskList.appendChild(taskItem);
            taskInput.value = '';
            saveTasks();
        } else {
            alert('No se puede añadir una tarea en blanco.');
        }
    });

    // Crear tarea
    function createTaskItem(taskText, taskDate = new Date().toLocaleDateString(), isCompleted = false, isHighlighted = false, originalSection = 'my-tasks') {
        const taskItem = document.createElement('li');
        taskItem.classList.toggle('completed', isCompleted);
        taskItem.classList.toggle('highlighted', isHighlighted);
        taskItem.dataset.originalSection = originalSection;
        taskItem.innerHTML = `
            <input type="checkbox" class="complete-checkbox" ${isCompleted ? 'checked' : ''} ${originalSection === 'deleted-tasks' ? 'disabled' : ''}>
            <span>${taskText}</span>
            <span class="task-date">${taskDate}</span>
            ${originalSection !== 'deleted-tasks' ? '<button class="btn btn-primary btn-sm edit-btn">Editar</button>' : ''}
            ${originalSection !== 'deleted-tasks' ? '<button class="btn btn-warning btn-sm highlight-btn">' + (isHighlighted ? 'Revertir' : 'Destacar') + '</button>' : ''}
            <button class="btn btn-danger btn-sm delete-btn">Eliminar</button>
            ${originalSection === 'deleted-tasks' ? '<button class="btn btn-success btn-sm recover-btn">Recuperar</button>' : ''}
        `;

        // Reasignar los eventos a los nuevos elementos generados
        addEventListenersToTaskItem(taskItem);
        return taskItem;
    }

    // Asignar eventos a los elementos de tarea
    function addEventListenersToTaskItem(taskItem) {
        taskItem.querySelector('.edit-btn')?.addEventListener('click', () => openEditModal(taskItem));
        taskItem.querySelector('.delete-btn')?.addEventListener('click', () => {
            if (taskItem.parentElement.id === 'deletedTasksList') {
                taskItem.remove(); // Eliminar tarea definitivamente
            } else {
                moveToDeletedTasks(taskItem);
            }
            saveTasks();
        });
        taskItem.querySelector('.complete-checkbox')?.addEventListener('change', () => {
            if (taskItem.parentElement.id !== 'deletedTasksList') {
                taskItem.classList.toggle('completed');
                saveTasks();
            }
        });
        taskItem.querySelector('.highlight-btn')?.addEventListener('click', () => {
            toggleHighlight(taskItem);
            saveTasks();
        });
        taskItem.querySelector('.recover-btn')?.addEventListener('click', () => {
            recoverTask(taskItem);
            saveTasks();
        });
    }

 // Editar tarea
function openEditModal(taskItem) {
    currentTaskItem = taskItem; // Guardar la tarea seleccionada
    const taskTitle = taskItem.querySelector('span').textContent; // Obtener el título de la tarea
    editTaskInput.value = taskTitle; // Colocar el título de la tarea en el campo de edición
    editModal.style.display = 'block'; // Mostrar el modal de edición
}

// Guardar cambios de la edición
saveEditButton.addEventListener('click', function() {
    if (currentTaskItem) {
        const newTaskTitle = editTaskInput.value.trim(); // Obtener el nuevo título

        if (newTaskTitle) {
            // Actualizar el texto de la tarea en el DOM
            currentTaskItem.querySelector('span').textContent = newTaskTitle;

            // Aquí puedes guardar las tareas en el localStorage o hacer algún otro proceso, por ejemplo:
            saveTasks(); // Función para guardar las tareas (debes definirla)

            // Cerrar el modal de edición
            closeEditModal();
        }
    }
});

// Función para cerrar el modal de edición
function closeEditModal() {
    editModal.style.display = 'none'; // Ocultar el modal
    currentTaskItem = null; // Restablecer la tarea actual
}

// Cerrar el modal al presionar el botón de cerrar
closeModalButton.addEventListener('click', closeEditModal);


    

    // Mover tarea a la lista de eliminadas
    function moveToDeletedTasks(taskItem) {
        taskItem.dataset.originalSection = taskItem.parentElement.id;
        deletedTasksList.appendChild(taskItem);
        taskItem.innerHTML = `
            <span>${taskItem.querySelector('span').textContent}</span>
            <span class="task-date">${taskItem.querySelector('.task-date').textContent}</span>
            <button class="btn btn-success btn-sm recover-btn">Recuperar</button>
            <button class="btn btn-danger btn-sm delete-btn">Eliminar</button>
        `;
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('complete-checkbox');
        checkbox.checked = taskItem.classList.contains('completed');
        checkbox.disabled = true;
        taskItem.insertBefore(checkbox, taskItem.firstChild);

        // Asignar los eventos de recuperación o eliminación
        addEventListenersToTaskItem(taskItem);
    }

    // Alternar destacar tarea
    function toggleHighlight(taskItem) {
        if (taskItem.parentElement.id === 'highlightedTasksList') {
            taskList.appendChild(taskItem);
            taskItem.classList.remove('highlighted');
            taskItem.querySelector('.highlight-btn').textContent = 'Destacar';
            taskItem.dataset.originalSection = 'my-tasks';
        } else {
            highlightedTasksList.appendChild(taskItem);
            taskItem.classList.add('highlighted');
            taskItem.querySelector('.highlight-btn').textContent = 'Revertir';
            taskItem.dataset.originalSection = 'highlighted-tasks';
        }
    }

    // Recuperar tarea de la lista de eliminadas
    function recoverTask(taskItem) {
        if (taskItem.dataset.originalSection === 'highlighted-tasks') {
            highlightedTasksList.appendChild(taskItem);
            taskItem.classList.add('highlighted');
        } else {
            taskList.appendChild(taskItem);
            taskItem.classList.remove('highlighted');
        }
        taskItem.innerHTML = `
            <input type="checkbox" class="complete-checkbox" ${taskItem.classList.contains('completed') ? 'checked' : ''}>
            <span>${taskItem.querySelector('span').textContent}</span>
            <span class="task-date">${taskItem.querySelector('.task-date').textContent}</span>
            <button class="btn btn-primary btn-sm edit-btn">Editar</button>
            <button class="btn btn-warning btn-sm highlight-btn">${taskItem.classList.contains('highlighted') ? 'Revertir' : 'Destacar'}</button>
            <button class="btn btn-danger btn-sm delete-btn">Eliminar</button>
        `;
        addEventListenersToTaskItem(taskItem);
    }

    // Limpiar tareas eliminadas
    clearDeletedTasksButton.addEventListener('click', function() {
        if (deletedTasksList.children.length === 0) {
            alert('No hay tareas por eliminar.');
        } else {
            if (confirm('¿Estás seguro de que quieres eliminar todas las tareas eliminadas?')) {
                deletedTasksList.innerHTML = '';
                saveTasks();
            }
        }
    });

    // Guardar tareas en localStorage
    function saveTasks() {
        const tasks = {
            myTasks: [],
            highlightedTasks: [],
            deletedTasks: []
        };

        taskList.querySelectorAll('li').forEach(taskItem => {
            tasks.myTasks.push(taskToData(taskItem));
        });

        highlightedTasksList.querySelectorAll('li').forEach(taskItem => {
            tasks.highlightedTasks.push(taskToData(taskItem));
        });

        deletedTasksList.querySelectorAll('li').forEach(taskItem => {
            tasks.deletedTasks.push(taskToData(taskItem));
        });

        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Convertir tarea a objeto de datos
    function taskToData(taskItem) {
        return {
            text: taskItem.querySelector('span').textContent,
            date: taskItem.querySelector('.task-date').textContent,
            completed: taskItem.classList.contains('completed'),
            originalSection: taskItem.dataset.originalSection
        };
    }

    // Cargar tareas desde localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || {
            myTasks: [],
            highlightedTasks: [],
            deletedTasks: []
        };

        tasks.myTasks.forEach(task => {
            const taskItem = createTaskItem(task.text, task.date, task.completed, false, 'my-tasks');
            taskList.appendChild(taskItem);
        });

        tasks.highlightedTasks.forEach(task => {
            const taskItem = createTaskItem(task.text, task.date, task.completed, true, 'highlighted-tasks');
            highlightedTasksList.appendChild(taskItem);
        });

        tasks.deletedTasks.forEach(task => {
            const taskItem = createTaskItem(task.text, task.date, task.completed, false, 'deleted-tasks');
            deletedTasksList.appendChild(taskItem);
            addEventListenersToTaskItem(taskItem);
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Referencias a los elementos
    const searchToggleBtn = document.getElementById('search-toggle-btn');
    const searchBar = document.getElementById('search-bar');
    const searchInput = document.getElementById('searchInput');
    const viewAllBtn = document.getElementById('view-all-btn');
    
    // Mostrar barra de búsqueda al hacer clic en el botón
    searchToggleBtn.addEventListener('click', function() {
        searchBar.style.display = searchBar.style.display === 'none' ? 'block' : 'none';
        searchInput.focus();
    });

    // Función para filtrar tareas según el texto de búsqueda
    function filterTasks(searchText) {
        const taskItems = document.querySelectorAll('#taskList li, #highlightedTasksList li, #deletedTasksList li');
        
        // Restaurar visibilidad de todas las tareas antes de filtrar
        taskItems.forEach(taskItem => {
            taskItem.classList.remove('hidden'); // Eliminar la clase 'hidden'
        });

        // Filtrar las tareas basadas en el texto de búsqueda
        taskItems.forEach(taskItem => {
            const taskText = taskItem.querySelector('span').textContent.toLowerCase();
            const taskDate = taskItem.querySelector('.task-date').textContent.toLowerCase();
            
            if (taskText.includes(searchText.toLowerCase()) || taskDate.includes(searchText.toLowerCase())) {
                taskItem.classList.remove('hidden'); // Mostrar tarea
            } else {
                taskItem.classList.add('hidden'); // Ocultar tarea
            }
        });

        // Mostrar el botón "Ver todo" solo si hay resultados filtrados
        if (searchText.trim() !== '') {
            viewAllBtn.style.display = 'block'; // Mostrar el botón "Ver todo"
        } else {
            viewAllBtn.style.display = 'none'; // Ocultar el botón "Ver todo"
        }
    }

    // Escuchar el evento de entrada en el campo de búsqueda
    searchInput.addEventListener('input', function() {
        const searchText = searchInput.value.trim();
        filterTasks(searchText); // Filtrar tareas según el texto de búsqueda
    });

    // Escuchar el evento "Enter" cuando la barra de búsqueda está activa
    searchInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const searchText = searchInput.value.trim();
            filterTasks(searchText); // Filtrar tareas y mostrar solo los resultados
            searchInput.value = ''; // Limpiar la barra de búsqueda
            searchBar.style.display = 'none'; // Ocultar la barra de búsqueda
        }
    });

    // Función para restaurar la visualización de todas las tareas
    viewAllBtn.addEventListener('click', function() {
        const taskItems = document.querySelectorAll('#taskList li, #highlightedTasksList li, #deletedTasksList li');
        
        // Restaurar visibilidad de todas las tareas
        taskItems.forEach(taskItem => {
            taskItem.classList.remove('hidden');
        });
        
        // Limpiar la barra de búsqueda y ocultarla
        searchInput.value = '';
        searchBar.style.display = 'none';
        viewAllBtn.style.display = 'none'; // Ocultar el botón "Ver todo"
    });
});
