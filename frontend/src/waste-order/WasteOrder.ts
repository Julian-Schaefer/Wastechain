import { Service } from "./Service";
import { TaskSite } from "./TaskSite";

export enum WasteOrderStatus {
    COMMISSIONED,
    ACCEPTED,
    REJECTED,
    CANCELLED,
    COMPLETED
}

export interface WasteOrder {
    id: string;
    status: WasteOrderStatus;
    subcontractorMSPID: string;
    originatorMSPID: string;
    customerName: string;
    taskSite: TaskSite;
    service: Service;
    description: string;
    quantity: number;
    unitPrice: number;
    unitOfMeasure: string;
    taskDate: string;
    startingTime: string;
    finishingTime: string;
    referenceNo: string;
    rejectionMessage: string;
    lastChanged: Date;
    lastChangedByMSPID: string;
}

export interface WasteOrderCommissionSchema {
    subcontractorMSPID?: string;
    customerName?: string;
    taskSite: TaskSite;
    service: Service;
    description?: string;
    quantity?: number;
    unitPrice?: number;
    unitOfMeasure?: string;
    taskDate?: string;
    startingTime?: string;
    finishingTime?: string;
    referenceNo?: string;
}

export interface WasteOrderCompleteSchema {
    quantity: number;
    taskDate: string;
    startingTime: string;
    finishingTime: string;
}

export interface WasteOrderRejectSchema {
    rejectionMessage: string;
}