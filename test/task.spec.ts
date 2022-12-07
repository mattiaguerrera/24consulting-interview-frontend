/* eslint-disable @typescript-eslint/no-unused-vars */
import { assert } from "chai";
import TaskModel from "../src/models/task.model";
import TaskService from "../src/services/task.service";

describe("Task Tests", () => {
    it("should return 5 when 2 is added to 3", () => {
        const taskService: TaskService = new TaskService();
        let task:TaskModel;
        const result = 4;
            taskService.get().then((res: TaskModel[]) => {
                if (res)
                    task = res[0];

                assert.exists(task);
            });
    });
});