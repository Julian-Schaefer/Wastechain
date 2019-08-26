import { Router } from "express";
import { getSettings, postSettings } from "./SettingsController";
import { getInformation } from "./SettingsController";

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
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/definitions/Settings'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           text/plain:
 *              schema:
 *                  type: string
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
 *           $ref: '#/definitions/Settings'
 *     responses:
 *       200:
 *         description: Settings
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/definitions/Settings'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           text/plain:
 *              schema:
 *                  type: string
 */
router.post('/', postSettings);

router.get('/info', getInformation);

export default router;