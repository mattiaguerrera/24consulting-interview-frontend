/* eslint-disable @typescript-eslint/no-unused-vars */
import { assert } from "chai";
import TaskModel from "../src/models/task.model";
import TaskService from "../src/services/task.service";

describe("Task Tests", () => {
    it("should return true for the existence of the first task", () => {
        const taskService: TaskService = new TaskService();
        let task: TaskModel;
        taskService.get().then((res: TaskModel[]) => {
            if (res)
                task = res[0];

            assert.exists(task);
        });
    });

    it("should return true for different first two task title", () => {
        const taskService: TaskService = new TaskService();
        let taskFirst: TaskModel, taskSecond: TaskModel;        
        taskService.get().then((res: TaskModel[]) => {
            if (res) {
                taskFirst = res[0];
                taskSecond = res[0];
            }              
            assert.notEqual(taskFirst.title, taskSecond.title);
        });
    });
});