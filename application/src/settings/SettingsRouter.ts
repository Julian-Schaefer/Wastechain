import { Router } from "express";
import { getSettings, postSettings } from "./SettingsController";

const router = Router();

/**
 * @swagger
 *
 * /settings:
 *   get:
 *     tags:
 *       - Settings
 *     description: Retrieve the API Settings
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Settings
 *       500:
 *         description: Internal Server Error
 */
router.get('/', getSettings);

/**
 * @swagger
 *
 * /settings:
 *   post:
 *     tags:
 *       - Settings
 *     description: Update the API Settings
 *     produces:
 *       - application/json 
 *     parameters:
 *       - name: settings
 *         description: Settings
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/settings'
 *     responses:
 *       200:
 *         description: Settings
 *       500:
 *         description: Internal Server Error
 */
router.post('/', postSettings)

export default router;