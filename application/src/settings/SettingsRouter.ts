import { Router } from "express";
import { getSettings, postSettings } from "./SettingsController";

const router = Router();

/**
 * @swagger
 *
 * /settings:
 *   get:
 *     description: Retrieve the API Settings
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: login
 */
router.get('/', getSettings);

router.post('/', postSettings)

export default router;