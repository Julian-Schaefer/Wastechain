import { Router } from "express";
import { getSettings, postSettings } from "./SettingsController";

const router = Router();

router.get('/', getSettings);
router.post('/', postSettings)

export default router;