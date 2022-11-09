import { SET_TASKS_ACTION } from './actions';
import { Task } from './../models/Task';
import { Reducer } from "react";
import { PayloadAction } from "@reduxjs/toolkit";



export const tasksReducer:Reducer<Task[], PayloadAction<Task[]>> =
(tasks = [], action): Task[] => {
    return action.type === SET_TASKS_ACTION ? action.payload : tasks;
}