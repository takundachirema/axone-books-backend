import express from 'express';
const router = express.Router();
import * as controller from './document-controller';

// The controller task will perform the action
router.post('/documents/latest', controller.getLatest);

router.post('/documents', controller.getDocument);

router.post('/documents/adjacent', controller.getAdjacentDocuments);

router.post('/documents/public_key', controller.getPublicKeyDocuments);

router.post('/documents/payments', controller.getPaymentPointers);

export default router;