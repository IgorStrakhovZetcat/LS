import { Box, Button, InputLabel, MenuItem, Select, SelectChangeEvent, Tab, Tabs, TextField } from '@mui/material';
import { useState } from 'react';
import styles from './CreateTask.module.scss'
import FormControl from '@mui/material/FormControl';
import { useDispatch } from "react-redux";
import { createTask, Task } from '../../../models/Task';
import { addTask } from '../../../redux/actions';
import { StateType } from '../../../redux/store';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


const initialTask: Task = createTask(0, '', '', '', [])
const CreateTask: React.FC = () => {
    const tasks: Task[] = useSelector<StateType, Task[]>(state => state.tasks)
    const [numberStep, setNumberStep] = useState<number>(1)
    const dispatch = useDispatch<any>()
    const [task, setTask] = useState(initialTask)
    const [checkTitle, setCheckTitle] = useState<boolean>(false)
    const [checkAssignee, setCheckAssignee] = useState<boolean>(false)
    const [otherTask, setOtherTask] = useState('');
    const navigate = useNavigate()

    function onSubmit(event: any) {
        event.preventDefault();
        dispatch(addTask(task))
        document.querySelector('form')!.reset();
        navigate('/')
    }

    function onReset() {
        setTask(initialTask);
        setCheckAssignee(false);
        setCheckTitle(false);
        setOtherTask('')
    }

    function handlerTaskTitle(event: any) {
        const taskCopy = { ...task };
        taskCopy.title = event.target.value;
        taskCopy.date = getDate();
        if (taskCopy.title !== '') {
            setCheckTitle(true)
        }

        setTask(taskCopy);
    }

    function handlerAssignee(event: any) {
        const taskCopy = { ...task };
        taskCopy.assigneeName = event.target.value;
        if (taskCopy.assigneeName !== '') {
            setCheckAssignee(true)
        }
        setTask(taskCopy);
    }

    function handlerStatus(event: any) {
        const taskCopy = { ...task };
        taskCopy.status = event.target.value;
        setTask(taskCopy);
    }

    function handlerDescription(event: any) {
        const taskCopy = { ...task };
        taskCopy.description = event.target.value;
        setTask(taskCopy)
    }

    function handlerOtherTasks(event: SelectChangeEvent) {
        const taskCopy = {...task};
        const checId = taskCopy.relatedTickets?.find(tc => tc === +event.target.value)
        if(!checId){
            taskCopy.relatedTickets?.push(+event.target.value)
            setTask(taskCopy)
        }
        
    }

   

    return <div className={styles.root}>
        <form onSubmit={onSubmit} onReset={onReset}>

            <div className={styles.mainBox}>
                <img className={styles.img} />

                <div className={styles.boxTitle}>
                    <TextField
                        id="Task title"
                        label="Task title"
                        required
                        onChange={handlerTaskTitle}
                    />

                    <div>{getDate()}</div>
                </div>
                {numberStep === 1 ?
                    <div key={1} className={styles.boxAssignee}>

                        <TextField
                            required
                            size='small'
                            id="Assignee"
                            label="Assignee"
                            onChange={handlerAssignee}
                        />
                    </div> :
                    <div key={2} className={styles.boxAssignee}>

                        <TextField
                            size='small'
                            id="Open"
                            label="Open"
                            onChange={handlerStatus}
                        />
                    </div>}
            </div>


            {numberStep === 1 ? '' :
                <div className={styles.boxDescription}>
                    <div>Descrtiption</div>
                    <FormControl sx={{ width: '500px' }}>
                        <TextField
                            id="Description"
                            defaultValue="Description"
                            onChange={handlerDescription}
                        />
                    </FormControl>

                </div>}



            {numberStep === 1 ? '' : <div className={styles.relatedTasks}><Box >
                <Tabs value={0}>
                    <Tab  label='Related Tasks' />
                </Tabs>
            </Box>
            
            <FormControl className={styles.boxSelect}>
                <InputLabel id="product-select-label" >Link to other tasks</InputLabel>
                <Select
                    labelId="product-select-label"
                    id="demo-simple-select"
                    label="Link to other tasks"
                    value={otherTask}
                    onChange={handlerOtherTasks}
                    
                >
                    <MenuItem value="">None</MenuItem>
                    {getTasks(tasks)}
                </Select>
            </FormControl>

            {task.relatedTickets && task.relatedTickets.length > 0 ? <div>
                <div className={styles.boxTasksOT}>{showOhersTasks(tasks, task.relatedTickets).map(task => 
                    <div key={task.id} className={styles.boxTaskOT}>
                    <img className={styles.imgOT} />
                    <div className={styles.boxTitle}>
                        <div>{task.title}</div>
                        <div>{task.assigneeName}</div>
                    </div>

                    <div className={styles.dateOT}>Creation date {task.date}</div>
                    <div className={styles.statusOT}>{task.status}</div>
                </div>
                    )}</div>
            </div> : <div/>}
            </div>
            
            
            }


            <div className={styles.buttonGroup}>
                <a href='/' className={styles.link}>
                    <Button >Cancel</Button>
                </a>

                {numberStep === 1 ? (checkAssignee && checkTitle ?
                    <Button onClick={() => setNumberStep(2)}>Next</Button> : <div />) :
                    <Button onClick={() => setNumberStep(1)}>Back</Button>}

                <Button type='submit'>Finish</Button>
            </div>


        </form>
    </div>
}


export default CreateTask;


function getDate() {
    const month = new Date().toLocaleString('default', { month: 'short' });
    const day = new Date().getDay();
    const year = new Date().getFullYear();
    const hour = new Date().getHours();
    const minut = new Date().getMinutes();
    return month + ' ' + day + ', ' + year + ' ' + hour + ':' + minut
}

function getTasks(tasks: Task[]) {
    return tasks.map(t => <MenuItem value={t.id as number} key={t.id}>{t.title}</MenuItem>)
}

function showOhersTasks(tasks: Task[], id: Number[]) {
    return tasks.filter(task => id.find(id => id === task.id))
}
