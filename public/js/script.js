// public/js/script.js

document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.querySelector('.task-list');

    taskList.addEventListener('click', (event) => {
        const editBtn = event.target.closest('.edit-btn');
        const cancelBtn = event.target.closest('.cancel-btn');

        if (editBtn) {
            const taskItem = editBtn.closest('.task-item');
            const titleSpan = taskItem.querySelector('.task-title');
            const actionsDiv = taskItem.querySelector('.task-actions');
            const editForm = taskItem.querySelector('.edit-task-form');

            titleSpan.style.display = 'none';
            actionsDiv.style.display = 'none';
            editForm.style.display = 'flex';
        }

        if (cancelBtn) {
            const taskItem = cancelBtn.closest('.task-item');
            const titleSpan = taskItem.querySelector('.task-title');
            const actionsDiv = taskItem.querySelector('.task-actions');
            const editForm = taskItem.querySelector('.edit-task-form');
            
            titleSpan.style.display = 'flex';
            actionsDiv.style.display = 'flex';
            editForm.style.display = 'none';
        }
    });
});