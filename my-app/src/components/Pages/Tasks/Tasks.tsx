import { Box, Button, Modal, Tab, Tabs } from '@mui/material';
import { useRef, useState } from 'react';
import { Task } from '../../../models/Task';
import styles from './Tasks.module.scss'
import { useSelector } from "react-redux";
import { StateType } from '../../../redux/store';



const Tasks: React.FC = () => {
    const tasks: Task[] = useSelector<StateType, Task[]>(state => state.tasks)
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const shownTask = useRef<Task>();
    const [page, setPage] = useState('Related Tasks')

    function showDetails(id: number) {
        shownTask.current = tasks.find(t => t.id === id);
        setModalOpen(true);
    }

    function handleChangeTabs(event: any, newValue: any) {
        setPage(newValue)
    }



    return <div className={styles.root}>
        <div className={styles.boxTitlePage}>
            <div className={styles.title}>Tasks</div>
            <a href='createtask' className={styles.link}>
                <Button>New Task</Button>
            </a>
        </div>

        {tasks.length > 0 ? tasks.map(task =>
            <div onClick={() => showDetails(task.id)} key={task.id} className={styles.boxTask}>
                <img className={styles.img} />
                <div className={styles.boxTitle}>
                    <div>{task.title}</div>
                    <div>{task.assigneeName}</div>
                </div>

                <div className={styles.date}>Creation date {task.date}</div>
                <div className={styles.status}>{task.status}</div>
            </div>
        ) : <div />}

        <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >



            {/*  DT is details  */}

            {shownTask.current ?
                <Box className={styles.boxDetails}>
                    <img className={styles.imgDT} />
                    <div className={styles.boxTitleDT}>
                        <div>{shownTask.current.title}</div>
                        <div>{shownTask.current.date}</div>
                    </div>
                    <div className={styles.statusDT}>
                        <div>Status</div>
                        <div>{shownTask.current.status}</div>
                    </div>

                    <div className={styles.dateDT}>
                        <div>Date Created</div>
                        <div>{shownTask.current.date}</div>
                    </div>

                    <div className={styles.assigneeDT}>
                        <div>Assignee</div>
                        <div>{shownTask.current.assigneeName}</div>
                    </div>


                    <div className={styles.descrtiptionDT}>
                        <div>Description</div>
                        <div>{shownTask.current.description}</div>
                    </div>


                    <div className={styles.relatedTasks}><Box >
                        <Tabs value={page} onChange={handleChangeTabs}>
                            <Tab value={'Related Tasks'} label='Related Tasks' />
                            <Tab value={'Watchers'} label='Watchers' />
                        </Tabs>
                    </Box>



                        {shownTask.current.relatedTickets && shownTask.current.relatedTickets.length > 0 && page === 'Related Tasks' ? <div>
                            <div className={styles.boxTasksOT}>{showOhersTasks(tasks, shownTask.current.relatedTickets).map(task =>
                                <div key={task.id} className={styles.boxTaskOT}>
                                    <img className={styles.imgOT} />
                                    <div className={styles.boxTitle}>
                                        <div>{task.title}</div>
                                        <div>{task.assigneeName}</div>
                                    </div>

                                    <div className={styles.date}>Creation date {task.date}</div>
                                    <div className={styles.status}>{task.status}</div>
                                </div>
                            )}</div>
                        </div> : <div />}
                    </div>


                </Box> : <div />}
        </Modal>

    </div>
}

export default Tasks;


function showOhersTasks(tasks: Task[], id: Number[]) {
    return tasks.filter(task => id.find(id => id === task.id))
}