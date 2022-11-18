import ConfirmationController from "./controllers/confirmation.controller";
import LoadingController from './controllers/loading.controller';
import NotificationController from "./controllers/notification.controller";
import TaskController from "./controllers/task.controller";
import UserController from "./controllers/user.controller";
import TaskService from "./services/task.service";
import UserService from "./services/user.service";

export default class App {

    private taskController: TaskController;
    private confirmationController: ConfirmationController;
    private notificationController: NotificationController;
    private loadingController: LoadingController;
    private userController: UserController;
    private taskService: TaskService = new TaskService();
    private userService: UserService = new UserService();

    constructor() {
        this.taskController = new TaskController(this.taskService);
        this.userController = new UserController(this.userService);
        this.confirmationController = new ConfirmationController();
        this.notificationController = new NotificationController();
        this.loadingController = new LoadingController();
    }

    startApp(): void {
        this.taskController.init();
        this.confirmationController.init();
        this.notificationController.init();
        this.loadingController.init();
        this.userController.init();
    }
}