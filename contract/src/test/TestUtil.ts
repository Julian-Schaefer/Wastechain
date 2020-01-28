import { EquipmentType } from '../model/Service';
import { WasteOrder } from '../model/WasteOrder';
import { WasteOrderPrivate } from '../model/WasteOrderPrivate';
import { WasteOrderStatus } from '../model/WasteOrderPublic';

export function getTransientMapFromWasteOrderPrivate(wasteOrderPrivate: WasteOrderPrivate): any {
    return {
        map: {
            order: {
                value: {
                    toArrayBuffer() {
                        return JSON.stringify(wasteOrderPrivate);
                    },
                },
            },
        },
        size: 1,
    };
}

export function getTestWasteOrder(): WasteOrder {
    return {
        id: 'TEST-ID-1',
        originatorMSPID: 'asd',
        subcontractorMSPID: 'asd',
        status: WasteOrderStatus.COMMISSIONED,
        wasteOrderPrivateId: 'privateId1',
        customerName: 'afasd',
        description: 'asd',
        service: {
            description: 'test',
            description2: '2',
            equipmentDescription: 'equip',
            equipmentType: EquipmentType.CLEARANCE,
            materialDescription: 'mat',
        },
        taskSite: {
            address: 'asd',
            address2: 'asd2',
            areaCode: 'NRW',
            city: 'Bochum',
            countryCode: 'DE',
            name: 'asd',
            name2: 'name2',
            postCode: '44787',
        },
        quantity: 2,
        unitPrice: 33,
        unitOfMeasure: 'MG',
        taskDate: '12/12/2020' as unknown as Date,
        startingTime: '13',
        finishingTime: '12',
        referenceNo: 'ASD123',
        rejectionMessage: '',
        lastChanged: new Date(),
        lastChangedByMSPID: '',
    };
}
