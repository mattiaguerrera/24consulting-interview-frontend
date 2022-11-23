import CONST from '../constants/index';
import TaskController from '../controllers/task.controller';
import { qs } from '../helpers/index';
import TaskModel from '../models/task.model';

export default class TaskView {
    private taskSaveBtn: Element;
    private taskSaveInput: HTMLButtonElement;
    private yesButton: Element;
    private tasksTmp: TaskModel[];
    private previousPage: HTMLButtonElement | undefined;
    private nextPage: HTMLButtonElement | undefined;
    private tasksDiv: Element;
    private curPage = 1;
    private pageSize = 5;
    private filterMode: string;
    private arrFilters: string[];
    private inputFilterTask: string;

    constructor() {
        this.taskSaveBtn = qs('#push');
        this.taskSaveInput = qs('#inputTask') as HTMLButtonElement;
        this.yesButton = qs('#confirmationYes');
        this.tasksDiv = qs('#tasks');
        this.tasksTmp = [];
        this.filterMode = '';
        this.inputFilterTask = '';
        this.arrFilters = [CONST.FILTERS.ACTIVE, CONST.FILTERS.COMPLETED, CONST.FILTERS.ALL, CONST.FILTERS.INPUT];
    }

    render(tasks: TaskModel[] = []): void {
        this.toggleCurPage();            
        const tasksPaging: TaskModel[] = [];
        if (tasks.length > 0)
            this.tasksTmp = tasks;
        if (this.tasksDiv) {
            this.tasksDiv!.innerHTML = '';
            const paginationDiv = document.createElement('div');
            paginationDiv.classList.add('pagination-box');
            paginationDiv.innerHTML = `                   
                <button class="paging-action" data-action="prev" title="Prev">Previous</button>
                <button class="paging-action" data-action="next" title="Next">Next</button>
                <span>Total items: ${this.tasksTmp.length}</span>
                <span>Page: ${this.curPage}</span>
            `;
            this.tasksTmp.filter((_row: TaskModel, _index: number) => {
                const start = (this.curPage - 1) * this.pageSize;
                const end = this.curPage * this.pageSize;
                if (_index >= start && _index < end) return true;
                return false;
            }).forEach(e => {
                tasksPaging.push(e);
            });
            this.renderTasks(tasksPaging);
            this.tasksDiv.appendChild(paginationDiv);
            this.bindEventListenersPagination();
        }
        return;
    }

    renderTasks(tasks: TaskModel[]): TaskView {
        if (tasks && this.tasksDiv) {
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
            this.tasksDiv!.appendChild(ul);
        }
        return this;
    }

    bindEventListeners(controller: TaskController): void {

        const tasksContent = qs('#tasks');
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
                        const checked = classList.contains('checked');
                        if (controller.markTaskToggle(taskId, checked))
                            classList.toggle('checked')
                    }
                    break;

                default:
                    break;
            }
        }, false);

        this.taskSaveInput.addEventListener('keypress', (e: KeyboardEvent): void => {
            if (e.key === CONST.KEYNAME.ENTER) {
                const input = e.target as HTMLInputElement;
                if (!input.value.length)
                    return;
                const result = controller.addTask(input.value);
                // TODO perché result è vuoto?
                // if (result) {
                //     this.taskSaveInput.innerHTML = '';
                // }
                this.taskSaveInput.value = '';
            }
        });

        this.taskSaveBtn.addEventListener('click', (): void => {
            const input = (<HTMLInputElement>this.taskSaveInput);
            if (!input.value.length)
                return;
            controller.addTask(input.value);
            this.taskSaveInput.value = '';
        });

        this.yesButton.addEventListener('click', (): void => {
            controller.deleteTask();
        });

        this.bindEventListenersFilter(controller);
    }

    bindEventListenersPagination(): void {
        this.previousPage = qs('button[data-action="prev"]') as HTMLButtonElement;
        this.nextPage = qs('button[data-action="next"]') as HTMLButtonElement;
        this.previousPage.addEventListener('click', (): void => {
            if (this.curPage > 1) this.curPage--;
            this.render();
        });
        this.nextPage.addEventListener('click', (): void => {
            if ((this.curPage * this.pageSize) < this.tasksTmp.length) {
                this.curPage++;
                this.render();
            }
        });
    }

    bindEventListenersFilter(controller: TaskController): void {        
        const tasksFilteringContent = qs('.box-filtering');
        tasksFilteringContent?.addEventListener('click', (e: Event) => {
            const targetNode = e.target as HTMLElement;
            if (!targetNode.localName.includes('span'))
                return;
            const action = targetNode.getAttribute('data-filter-type')!;
            switch (action) {
                case CONST.FILTERS.ACTIVE:
                    this.filterMode = CONST.FILTERS.ACTIVE;
                    controller.filterBy(this.filterMode, this.inputFilterTask);                    
                    break;
                case CONST.FILTERS.COMPLETED:
                    this.filterMode = CONST.FILTERS.COMPLETED;
                    controller.filterBy(this.filterMode, this.inputFilterTask);
                    break;
                case CONST.FILTERS.ALL:
                    this.filterMode = CONST.FILTERS.ALL;
                    controller.filterBy(this.filterMode, this.inputFilterTask);
                    break;
                default:
                    break;
            }
        });

        const inputTasksFilter = qs('.box-filtering input');
        inputTasksFilter?.addEventListener('input', () => {            
            const targetNode = inputTasksFilter as HTMLInputElement;
            this.inputFilterTask = targetNode.value;
            this.filterMode = CONST.FILTERS.INPUT;
            controller.filterBy(this.filterMode, this.inputFilterTask);
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

    toggleCurPage() {
        // eslint-disable-next-line no-constant-condition
        if (this.arrFilters.includes(this.filterMode)) {
            this.curPage = 1;
            this.filterMode = '';
        }
            
    }

}
