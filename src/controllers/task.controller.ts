import { default as CONST } from '../constants/index';
import TaskModel from "../models/task.model";
import TaskService from "../services/task.service";
import TaskView from '../views/task.view';
import ConfirmationController from './confirmation.controller';
import NotificationController from "./notification.controller";

export default class TaskController {
    private tasks: TaskModel[];
    private taskView: TaskView;
    private currentTask: string;
    private notificationController: NotificationController;
    private confirmationController: ConfirmationController;

    constructor(public taskService: TaskService) {
        this.taskView = new TaskView();
        this.tasks = [];
        this.currentTask = "0";
        this.notificationController = new NotificationController();
        this.confirmationController = new ConfirmationController();
    }

    init(bindEvent= true): void {        
        this.taskService.get().then(res => {
            this.tasks = res;
            this.displayTasks(this.tasks);
            if (bindEvent)
                this.taskView.bindEventListeners(this);            
        });
    }

    displayTasks(tasks: TaskModel[]): void {
        this.taskView.render(tasks);
    };

    addTask(title: string): boolean {
        this.taskService.getNewId().then(res => {
            if (res) {
                const task: TaskModel = {
                    id: res,
                    title: title,
                    state: 'doing'
                }
                this.taskService.save(task).then(res => {
                    this.taskService.get().then(res => {
                        this.tasks = res;                        
                        this.displayTasks(this.tasks);                        
                    }); 
                    return res;                   
                });
                return false;
            }
        });
        return false;
    }

    updateTask(task: TaskModel) {
        this.taskService.update(task);
    }

    deleteTask() {
        const task = this.tasks.filter((item: TaskModel) => item.id === this.currentTask)[0];
        this.confirmationController.handleHideConfirmation();
        try {
            this.taskService.delete(task.id);
            this.taskService.get().then(res => this.displayTasks(res));
            this.handleShowNotification(CONST.NOTIFICATIONS.SUCCESS, CONST.MESSAGES.REMOVE_TASK);
            return true;
        } catch (error) {
            this.handleShowNotification(CONST.NOTIFICATIONS.SUCCESS, CONST.MESSAGES.ERROR);
            return false;
        }

    }

    showConfirmation(taskId: string) {
        this.confirmationController.handleShowConfirmation();
        this.currentTask = taskId;
    }

    markTaskToggle(taskId: string, checked: boolean) {
        const tasks = this.tasks.filter((item: TaskModel) => item.id === taskId);
        if (tasks.length == 1) {
            const task = tasks[0];
            switch (checked) {
                case false:
                    task.state = 'doing';
                    break;
                default:
                    task.state = 'done';
                    break;
            }
            this.taskService.update(task);
        }
    }

    handleShowNotification(type: string, content: string): void {
        this.notificationController.displayNotification(type, content);
    }

    /* Filtering Area */
    filterBy(filterType: string, filterValue: string): void {
        const baseData = this.tasks; //toArray(this.getTasks()) as TaskModel[];
        const activeTasks = baseData.filter((item): boolean => item.state == 'doing');
        const completedTask = baseData.filter((item): boolean => item.state == 'done');
        let dataFilter = null;

        switch (filterType) {
            case CONST.FILTERS.ACTIVE:
                dataFilter = activeTasks;
                if (filterValue)
                    dataFilter = this.filterByValue(dataFilter, filterValue);
                this.handleShowNotification(
                    CONST.NOTIFICATIONS.INFORMATION,
                    'Your action has been executed! The active tasks are showing.',
                );
                break;

            case CONST.FILTERS.COMPLETED:
                dataFilter = completedTask;
                if (filterValue)
                    dataFilter = this.filterByValue(dataFilter, filterValue);
                this.handleShowNotification(
                    CONST.NOTIFICATIONS.INFORMATION,
                    'Your action has been executed! The completed tasks are showing.',
                );
                break;

            case CONST.FILTERS.ALL:
                dataFilter = baseData;
                if (filterValue)
                    dataFilter = this.filterByValue(dataFilter, filterValue);
                this.handleShowNotification(
                    CONST.NOTIFICATIONS.INFORMATION,
                    'Your action has been executed! All tasks are showing.',
                );
                break;

            case CONST.FILTERS.INPUT:
                dataFilter = this.filterByValue(baseData, filterValue);
                break;

            default:
                dataFilter = baseData
                break;
        }
        this.displayTasks(dataFilter);
    }

    filterByValue(array: TaskModel[], input: string) {
        return array.filter((o:any) =>
            Object.keys(o).some(k => o[k].toLowerCase().includes(input.toLowerCase())));
    }
}

