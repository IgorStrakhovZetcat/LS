

export type Task = {
    id: number;
    title: string;
    assigneeName: string;
    assigneeAvatar?: any;
    description?: string;
    date: string;
    status?: any;
    watchers?: number;
    relatedTickets?: Number[];
}

export function createTask(id: number, title: string, assigneeName: string, date: string, relatedTickets: []) {
    return {id, title, assigneeName, date, relatedTickets}
}