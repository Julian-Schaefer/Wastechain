import { WasteOrderPrivate } from '../model/WasteOrderPrivate';

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
