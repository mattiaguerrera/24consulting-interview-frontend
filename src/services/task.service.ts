import { environment } from "../assets/environment";
import { toNumber } from "../helpers";
import TaskModel from "../models/task.model";


// # list
// GET http://localhost:3001/todo

// # pagination
// GET http://localhost:3001/todo?_limit=10&_page=1

// # filter
// GET http://localhost:3001/todo?state=done

// # fulltext
// GET http://localhost:3001/todo?_q=test

// # detail
// GET http://localhost:3001/todo/1

// # create a new todo
// POST http://localhost:3001/todo

// # update a todo
// PUT http://localhost:3001/todo/1

// # delete a todo
// DELETE http://localhost:3001/todo/1

export default class TaskService {

    get() {
        return getTasks();
    }

    save(task: TaskModel) {
        return saveTask(task);
    }

    update(task: TaskModel) {
        return updateTask(task);
    }

    delete(id: string) {
        return deleteTask(id);
    }

    getNewId() {
        return getLastIdTask();
    }
}

async function getTasks(): Promise<TaskModel[]> {
    try {
        const response = await fetch(environment.urlTodo, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }
        const result = (await response.json()) as TaskModel[];
        return result;
    } catch (error) {
        if (error instanceof Error) {
            console.log('error message: ', error.message);
            //return error.message;
            return [];
        } else {
            console.log('unexpected error: ', error);
            //return 'An unexpected error occurred';
            return [];
        }
    }
}

async function saveTask(task: TaskModel): Promise<boolean> {
    try {
        const response = await fetch(environment.urlTodo, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task)
        });
        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }
        const result = (await response.json()) as TaskModel;
        return true;
    } catch (error) {
        if (error instanceof Error) {
            console.log('error message: ', error.message);
            //return error.message;
            return false;
        } else {
            console.log('unexpected error: ', error);
            //return 'An unexpected error occurred';
            return false;
        }
    }
}

async function updateTask(task: TaskModel): Promise<TaskModel> {
    try {
        //const bodyfy = JSON.stringify({ todo: task });        
        const response = await fetch(environment.urlTodo + '/' + task.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: task.id,
                title: task.title,
                state: task.state
            })
        });
        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }
        const result = (await response.json()) as TaskModel;
        return result;
    } catch (error) {
        if (error instanceof Error) {
            console.log('error message: ', error.message);
            //return error.message;
            return {} as TaskModel;
        } else {
            console.log('unexpected error: ', error);
            //return 'An unexpected error occurred';
            return {} as TaskModel;
        }
    }
}

async function deleteTask(id: string): Promise<string> {
    try {
        const response = await fetch(environment.urlTodo + '/' + id, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }
        const result = (await response.json()) as string;
        console.log('result is: ', JSON.stringify(result, null, 4));
        return result;
    } catch (error) {
        if (error instanceof Error) {
            console.log('error message: ', error.message);
            return error.message;
        } else {
            console.log('unexpected error: ', error);
            return 'An unexpected error occurred';
        }
    }
}

async function getLastIdTask(): Promise<string> {
    const arr: number[] = [];
    let newId = '1';
    await getTasksId().then(res => {
        if (res && res.length > 0) {
            res.forEach((elem) => {
                if (typeof toNumber(elem.id) == 'number')
                    arr.push(toNumber(elem.id));
            }
            );
            const bigger = Math.max(...arr) + 1;
            newId = bigger.toString();
        }
        return newId;
    });
    return newId;
}

const getTasksId = async () => {
    try {
        const response = await fetch(environment.urlTodo)
        const data: Promise<TaskModel[]> = await response.json()
        return data;
    }
    catch (error) {
        console.log(error);
    }
}