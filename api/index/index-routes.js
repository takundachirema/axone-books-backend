import express from 'express';
const router = express.Router();
import * as controller from './index-controller';

// The controller task will perform the action
router.get('/indexes',controller.get_all);

router.get('/indexes/:indexCode/date/:date/period/:period',controller.get_index);

router.get('/indexes/betas/date/:date',controller.get_index_beta_data)

router.get('/indexes/metrics/:type/index/:code/marketindex/:mktcode',controller.get_index_metric_data)

export default router;