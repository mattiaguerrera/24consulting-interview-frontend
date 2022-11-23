import { default as CONST } from '../constants/index';
import UserModel from "../models/user-registration.model";
import StorageService from '../services/storage.service';
import UserService from "../services/user.service";
import UserView from "../views/user.view";
import NotificationController from "./notification.controller";

export default class UserController {

    private userView: UserView;
    private notificationController: NotificationController;
    private storageService: StorageService;

    constructor(public userService: UserService) {
        this.userView = new UserView();
        this.notificationController = new NotificationController();
        this.storageService = new StorageService();
    }

    init(): void {
        this.userView.bindEventListeners(this);
    }

    login(user: UserModel) {
        this.userService.login(user)
            .then((res:any) => {
                const authToken: string = res['accessToken'];                
                if (authToken)
                    this.storageService.setItem(CONST.AUTHORIZATION.TOKEN, authToken);
                this.handleShowNotification(CONST.NOTIFICATIONS.SUCCESS, CONST.MESSAGES.LOGIN);
            } )
            .catch((error: string) => this.handleShowNotification(CONST.NOTIFICATIONS.ERROR, error));        
    };

    register(user: UserModel) {
        this.userService.register(user)
            .then(() => this.handleShowNotification(CONST.NOTIFICATIONS.SUCCESS, CONST.MESSAGES.LOGIN))
            .catch((error: string) => this.handleShowNotification(CONST.NOTIFICATIONS.ERROR, error));
    };

    logout() {
        this.storageService.clear();
        this.handleShowNotification(CONST.NOTIFICATIONS.SUCCESS, CONST.MESSAGES.LOGOUT)
    }

    handleShowNotification(type: string, content: string): void {
        this.notificationController.displayNotification(type, content);
    }

}