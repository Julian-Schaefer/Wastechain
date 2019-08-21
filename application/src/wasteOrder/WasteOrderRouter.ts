import { Router } from "express";
import { getWasteOrder, createWasteOrder, updateWasteOrder, getWasteOrderHistory, getWasteOrdersForSubcontractorWithStatus, getWasteOrdersForOriginatorWithStatus } from "./WasteOrderController";

const router = Router();

router.route('/:id')
    .get(getWasteOrder)
    .post(createWasteOrder)
    .put(updateWasteOrder);

router.route('/:id/history')
    .get(getWasteOrderHistory);

router.get('/incoming/status/:status', getWasteOrdersForSubcontractorWithStatus);
router.get('/outgoing/status/:status', getWasteOrdersForOriginatorWithStatus);

export default router;