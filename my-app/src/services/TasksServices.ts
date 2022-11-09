import { Task } from "../models/Task";




export default interface TasksServices {
    add(task: Task): Promise<void>;
    get(): Promise<Task[]>;
}