import TasksServiceRest from "../services/TasksServiceRest";



export const tasksService = new TasksServiceRest('http://localhost:3500/tasks');