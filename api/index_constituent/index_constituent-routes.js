import express from 'express';
const router = express.Router();
import * as controller from './index_constituent-controller';

// The controller task will perform the action
router.get('/index_constituents',controller.get_all);

router.get('/index_constituents/:constituentCode/index/:indexCode/date/:date/period/:period',controller.get_constituent);

router.get('/index_constituents/betas/date/:date',controller.get_constituent_beta_data)

router.get('/index_constituents/betas',controller.get_constituent_beta_data)

export default router;