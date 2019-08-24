import { Router } from "express";
import { getWasteOrder, commissionWasteOrder, updateWasteOrder, getWasteOrderHistory, getWasteOrdersForSubcontractorWithStatus, getWasteOrdersForOriginatorWithStatus } from "./WasteOrderController";

const router = Router();

/**
 * @swagger
 *
 *  /order/{id}:
 *      get:
 *          tags:
 *              - Waste Order
 *          description: Retrieve a Waste Order by ID
 *          produces:
 *              - application/json
 *          parameters:
 *              - name: id
 *                description: Waste Order ID
 *                in: path
 *                required: true
 *                schema:
 *                  type: string
 *          responses:
 *              200:
 *                  description: Waste Order
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/WasteOrderSchema'
 *              500:
 *                  description: Internal Server Error
 *                  content:
 *                      text/plain:
 *                          schema:
 *                              type: string
 */
router.get('/:id', getWasteOrder);

/**
 * @swagger
 *
 *  /order/{id}:
 *      post:
 *          tags:
 *              - Waste Order
 *          description: Commission a new Waste Order
 *          produces:
 *              - application/json
 *          parameters:
 *              - name: id
 *                description: Waste Order ID
 *                in: path
 *                required: true
 *                schema:
 *                  type: string
 *              - name: wasteOrder
 *                description: Waste Order to be commissioned
 *                in: body
 *                required: true
 *                schema:
 *                  $ref: '#/definitions/WasteOrderCommissionSchema'
 *          responses:
 *              200:
 *                  description: Waste Order that has been created
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/WasteOrderSchema'
 *              500:
 *                  description: Internal Server Error
 *                  content:
 *                      text/plain:
 *                          schema:
 *                              type: string
 */
router.post('/:id', commissionWasteOrder);

/**
 * @swagger
 *
 *  /order/{id}:
 *      put:
 *          tags:
 *              - Waste Order
 *          description: Update a Waste Order by ID
 *          produces:
 *              - application/json
 *          parameters:
 *              - name: id
 *                description: Waste Order ID
 *                in: path
 *                required: true
 *                schema:
 *                  type: string
 *              - name: wasteOrder
 *                description: Waste Order to be updated
 *                in: body
 *                required: true
 *                schema:
 *                  oneOf:
 *                  - $ref: '#/definitions/WasteOrderRecommissionSchema'
 *                  - $ref: '#/definitions/WasteOrderUpdateStatusSchema'
 *                  - $ref: '#/definitions/WasteOrderRejectSchema'
 *                  - $ref: '#/definitions/WasteOrderCompleteSchema'
 *          responses:
 *              200:
 *                  description: Waste Order that has been updated
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/WasteOrderSchema'
 *              500:
 *                  description: Internal Server Error
 *                  content:
 *                      text/plain:
 *                          schema:
 *                              type: string
 */
router.put('/:id', updateWasteOrder);

router.route('/:id/history')
    .get(getWasteOrderHistory);

router.get('/incoming/status/:status', getWasteOrdersForSubcontractorWithStatus);
router.get('/outgoing/status/:status', getWasteOrdersForOriginatorWithStatus);

export default router;