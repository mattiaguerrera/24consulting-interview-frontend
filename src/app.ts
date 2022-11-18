import ConfirmationController from "./controllers/confirmation.controller";
import TaskController from "./controllers/task.controller";
import TaskService from "./services/task.service";

export default class App {

    private taskController: TaskController;
    private confirmationController: ConfirmationController;
    private taskService: TaskService = new TaskService();

    constructor() {
        this.taskController = new TaskController(this.taskService);
        this.confirmationController = new ConfirmationController();
    }

    startApp(): void {
        this.taskController.init();
        this.confirmationController.init();
    }
}