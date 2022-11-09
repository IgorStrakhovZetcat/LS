import { tasksReducer } from './reducer';
import { Task } from './../models/Task';
import { configureStore } from "@reduxjs/toolkit"
import { combineReducers } from "redux"


export type StateType = {
    tasks: Task[]
}

const reducer = combineReducers<StateType> ({
    tasks: tasksReducer as any
 })
 export const store = configureStore({reducer})


