import { Task } from "../models/Task";
import TasksServices from "./TasksServices";
import { Observable, Subscriber } from "rxjs";





const POLLING_INTERVAL = 20000;
const UNAVAIABILITY_TIMEOUT = 50000;
async function responseProcessing(response: Response): Promise<any> {
    if (response.status < 400) {
        return await response.json();
    }
    throw new Error('UNKNOWN');
}
let timeoutId: any;
let intervalId: any;
export default class TasksServiceRest implements TasksServices {
    private observable: Observable<Task[]> | undefined;
    private observer: Subscriber<Task[]> | undefined;
    private coursesJson: string = '';
    constructor(private url: string) {
        console.log(url)
    }

    private observing() {

        this.get().then(courses => {
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = undefined;
            }
            if (this.coursesJson !== JSON.stringify(courses)) {
                this.observer?.next(courses)
                this.coursesJson = JSON.stringify(courses);
            }

        })
            .catch(err => {
                if (err === 'UNKNOWN') {
                    this.closeObserver();
                } else {
                    this.coursesJson = '';
                    if (err === 'SERVERUNAVAILABLE') {
                        if (!timeoutId) {

                            timeoutId = setTimeout(this.closeObserver.bind(this), UNAVAIABILITY_TIMEOUT);
                            console.log("setting timeout", timeoutId)
                        } else {
                            return;
                        }
                    }
                    this.observer?.next(err)
                }

            })
    }
    private closeObserver() {
        console.log("closing observer", timeoutId)
        console.log("publishing unknown error")
        this.observer?.complete();
    }

    getObservableData(): Observable<Task[]> {
        if (!this.observable) {
            this.observable = new Observable(observer => {

                this.observer = observer;
                this.observing();
                if (intervalId) {
                    clearInterval(intervalId)
                }
                intervalId = setInterval(this.observing.bind(this), POLLING_INTERVAL);
                return () => {
                    clearInterval(intervalId);
                }

            })
        }
        return this.observable;
    }


    async add(task: Task): Promise<void> {
        let response: Response;
        console.log(JSON.stringify(task))
        try {
            response = await fetch(this.url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(task)
            });

        } catch (err) {
            throw new Error('SERVER UNAVAILABLE');
        }
        responseProcessing(response);
    }

    async get(): Promise<Task[]> {
        let response: Response;
        try {
            response = await fetch(this.url);

        } catch (err) {
            throw new Error('SERVER UNAVAILABLE')
        }
        const tasks: Task[] = await responseProcessing(response);
        return tasks
    }

}