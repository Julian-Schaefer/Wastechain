export enum EquipmentType {
    SUBMISSION,
    PICK_UP,
    EXCHANGE,
    CLEARANCE
}

export interface Service {
    description: string;
    description2: string;
    materialDescription: string;
    equipmentType: EquipmentType;
    equipmentDescription: string;
}