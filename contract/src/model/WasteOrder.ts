import { Service } from "./Service";
import { TaskSite } from "./TaskSite";

export interface WasteOrder {
    service: Service;
    taskSite: TaskSite;
    description: string;
    quantity: number;
    unitPrice: number;
    originatorMSPID?: string;
    contractorMSPID: string;
}