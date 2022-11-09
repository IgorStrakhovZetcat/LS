import { Task } from './../models/Task';
import { PayloadAction } from "@reduxjs/toolkit";
import { tasksService } from '../config/service-config';

export const SET_TASKS_ACTION = '/tasks/set'

export function setTasks(tasks: Task[]): PayloadAction<Task[]> {
    return { payload: tasks, type: SET_TASKS_ACTION };
}


export function addTask(task: Task): (dispatch: any) => void {
    return async (dispatch) => {
        try {
            await tasksService.add(task);
            const tasks: Task[] = await tasksService.get();
            dispatch(setTasks(tasks));
        } catch (err: any) {
           throw new Error('wrong add task')

        }
    }
}