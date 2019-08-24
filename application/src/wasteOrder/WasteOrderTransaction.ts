import { WasteOrder } from './WasteOrder';

/**
 *  @swagger
 *  definitions:
 *      WasteOrderTransaction:
 *          type: object
 *          properties:
 *              txId:
 *                  type: string
 *              timestamp:
 *                  type: string
 *              isDelete:
 *                  type: string
 *              value:
 *                  type: object
 *                  $ref: '#/definitions/WasteOrderSchema'
 */
export interface WasteOrderTransaction {
    txId: string;
    timestamp: string;
    isDelete: string;
    value: WasteOrder;
}