import { Router } from "express";
import { getWasteOrder, createWasteOrder, updateWasteOrder, getWasteOrderHistory, getWasteOrdersForSubcontractorWithStatus, getWasteOrdersForOriginatorWithStatus } from "./WasteOrderController";

const router = Router();

router.get('/:id', getWasteOrder)
    .post('/:id', createWasteOrder)
    .put('/:id', updateWasteOrder);

router.get('/:id/history', getWasteOrderHistory);

router.get('/incoming/status/:status', getWasteOrdersForSubcontractorWithStatus);
router.get('/outgoing/status/:status', getWasteOrdersForOriginatorWithStatus);

export default router;