interface TaskType {
    id: string;
    title: string;
    state: string;
}

export default class TaskModel implements TaskType {
    id: string;
    title: string;
    state: string;
       
    constructor(id: string, title: string, state: string) {
        this.id = id;
        this.title = title;
        this.state = state;
    }
    
}