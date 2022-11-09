import React, { useEffect } from 'react';
import Tasks from './components/Pages/Tasks/Tasks';
import { Route, Routes } from 'react-router-dom';
import CreateTask from './components/Pages/CreateTask/CreateTask';
import { useDispatch } from 'react-redux';
import { tasksService } from './config/service-config';
import { Task } from './models/Task';
import { setTasks } from './redux/actions';


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    getData(dispatch);
  }, [dispatch])


  return <div >

    <Routes>
      <Route path='/' element={<Tasks />} />
      <Route path='createtask' element={<CreateTask />} />
    </Routes>
  </div>
}

export default App;



function getData(dispatch: any) {
  tasksService.getObservableData().subscribe({
    next: tasks_err => {
      if (Array.isArray(tasks_err)) {
        dispatch(setTasks(tasks_err as Task[]));

      } else {
        alert(' Something Wrong')
      }
    }
  })
}
