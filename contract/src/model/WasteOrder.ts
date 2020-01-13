import { WasteOrderPrivate } from './WasteOrderPrivate';
import { WasteOrderPublic } from './WasteOrderPublic';

export type WasteOrder = WasteOrderPublic & WasteOrderPrivate;
