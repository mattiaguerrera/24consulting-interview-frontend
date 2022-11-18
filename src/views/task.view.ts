import CONST from '../constants/index';
import TaskController from '../controllers/task.controller';
import { qs } from '../helpers/index';
import TaskModel from '../models/task.model';

export default class TaskView {
    private taskSaveBtn: Element;
    private taskSaveInput: HTMLButtonElement;
    private yesButton: Element;

    constructor() {
        this.taskSaveBtn = qs('#push');
        this.taskSaveInput = qs('#inputTask') as HTMLButtonElement;
        this.yesButton = qs('#confirmationYes');
    }

    renderTasks(tasks: TaskModel[]): TaskView {
        const appDom = document.querySelector<HTMLDivElement>('#app');
        if (appDom) {
            const tasksDom = document.querySelector<HTMLDivElement>('#tasks');
            if (tasks && tasksDom) {
                tasksDom!.innerHTML = '';
                const ul = document.createElement('ul');
                for (let i = 0; i < tasks.length; i++) {
                    const task = tasks[i] as TaskModel;
                    const classChecked = task.state == 'done' ? 'checked' : '';
                    const taskItem = document.createElement('div');
                    taskItem.innerHTML = `
                        <li data-task-id="${task.id}" data-action="mark" class="item ${classChecked}">
                            <span>${task.id} - ${task.title}</span>
                            <button class="task-action edit" data-task-id="${task.id}" data-action="edit" title="Edit">Edit</button>
                            <button class="task-action close" data-task-id="${task.id}" data-action="remove" title="Delete">Delete</button>                            
                        </li>`;
                    ul.appendChild(taskItem);
                }
                tasksDom!.appendChild(ul);
            }
        }
        return this;
    }

    bindEventListeners(controller: TaskController): void {

        const tasksContent = document.querySelector<HTMLDivElement>('#tasks');
        tasksContent?.addEventListener('click', (e: Event) => {
            e.preventDefault();
            e.stopPropagation();

            let targetNode = e.target as HTMLElement;
            if (targetNode.localName.includes('span')) {
                targetNode = targetNode.closest('li')!;
            }
            const taskId = targetNode.getAttribute('data-task-id')!;
            const action = targetNode.getAttribute('data-action')!;

            switch (action) {
                case CONST.ACTIONS.REMOVE:
                    controller.showConfirmation(taskId);
                    break;

                case CONST.ACTIONS.EDIT:
                    this.renderEditInput(targetNode);
                    break;

                case CONST.ACTIONS.CLOSE:
                    this.toggleActionButtonLi(targetNode);
                    break;

                case CONST.ACTIONS.SAVE:
                    this.updateTaskTitle(targetNode, controller);
                    break;

                case CONST.ACTIONS.MARK:
                    // eslint-disable-next-line no-case-declarations
                    const li = targetNode.closest('li');
                    if (li) {
                        const classList = li.classList;
                        classList.toggle('checked');
                        const checked = classList.contains('checked');
                        controller.markTaskToggle(taskId, checked);
                    }
                    break;

                default:
                    break;
            }
        }, false);

        this.taskSaveInput.addEventListener('keypress', (e: KeyboardEvent): void => {
            if (e.key === CONST.KEYNAME.ENTER) {
                const title = e.target as HTMLInputElement;
                const result = controller.addTask(title.value);
                // TODO perché result è vuoto?
                // if (result) {
                //     this.taskSaveInput.innerHTML = '';
                // }
                this.taskSaveInput.value = '';
            }
        });

        this.taskSaveBtn.addEventListener('click', (e: Event): void => {
            const title = (<HTMLInputElement>this.taskSaveInput).value;
            controller.addTask(title);
            this.taskSaveInput.value = '';
        });

        this.yesButton.addEventListener('click', (): void => {
            controller.deleteTask();
        });
    }

    renderEditInput(targetNode: HTMLElement): void {
        if (targetNode) {
            const id = targetNode.getAttribute('data-task-id')!;
            const liEl = targetNode.closest('li');
            if (liEl) {
                const spanEl = liEl.firstElementChild as HTMLInputElement;

                const input = document.createElement('input');
                input.setAttribute("class", "form-control edit-task");
                liEl?.appendChild(input);
                if (spanEl)
                    spanEl.hidden = true;

                const btnEl = document.createElement('div');
                btnEl.classList.add('container-action-update');
                btnEl.innerHTML = `                        
                            <button class="task-action save" data-task-id="${id}" data-action="save" title="Save">Save</button>
                            <button class="task-action undo" data-task-id="${id}" data-action="close" title="Close">Close</button>
                        `;
                liEl?.appendChild(btnEl);
                liEl?.querySelector<HTMLDivElement>('button[data-action="edit"]')?.setAttribute('disabled', '');
                liEl?.querySelector<HTMLDivElement>('button[data-action="remove"]')?.setAttribute('disabled', '');
            }
        }
        return;
    }

    toggleActionButtonLi(targetNode: HTMLElement) {
        if (targetNode) {
            const id = targetNode.getAttribute('data-task-id')!;
            const liEl = targetNode.closest('li');
            if (liEl) {
                liEl?.querySelector<HTMLDivElement>('button[data-action="edit"]')?.removeAttribute('disabled');
                liEl?.querySelector<HTMLDivElement>('button[data-action="remove"]')?.removeAttribute('disabled');
                liEl?.querySelector<HTMLDivElement>('div.container-action-update')?.remove();
                liEl?.querySelector<HTMLDivElement>('input.edit-task')?.remove();
                const spanEl = liEl.firstElementChild as HTMLInputElement;
                if (spanEl)
                    spanEl.hidden = false;
            }
        }
    }

    updateTaskTitle(targetNode: HTMLElement, controller: TaskController) {
        if (targetNode) {
            const id = targetNode.getAttribute('data-task-id')!;
            const liEl = targetNode.closest('li');
            if (liEl) {
                const inputTitle = liEl?.querySelector<HTMLInputElement>('input.edit-task');
                if (inputTitle) {
                    const task: TaskModel = {
                        id: id,
                        title: inputTitle.value,
                        state: 'doing'
                    }
                    controller.updateTask(task);
                    controller.init(false);
                }

                // const spanEl = liEl.firstElementChild as HTMLInputElement;
                // if (spanEl)
                //     spanEl.hidden = false;
            }
        }
    }

}
