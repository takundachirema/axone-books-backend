import express from 'express';
const router = express.Router();
import * as controller from './document-controller';

// The controller task will perform the action
router.post('/publish', controller.publish);

export default router;