import express from 'express';
const router = express.Router();
import * as controller from './download-controller';

// The controller task will perform the action
router.get('/downloads',controller.get_all);

// Index table
router.get('/downloads/indextable/:proxy/date/:date/period/:period',controller.get_indextable);

// Share table
router.get('/downloads/sharetable/:proxy/date/:date/period/:period',controller.get_sharetable);

// Shares metrics
router.get('/downloads/sharesMetrics',controller.get_all_SharesMetrics);
router.get('/downloads/sharesMetrics/:index_code/:mkt_index_code/share_code/:share_code/date/:date/period/:period', controller.get_ShareMetrics)
router.get('/downloads/sharesMetrics/:index_code/:mkt_index_code/date/:date/period/:period', controller.get_ShareMetrics_all_shares)

// Industry portfolio metrics
router.get('/downloads/indusPortfMetrics',controller.get_all_IndusPortfMetrics);
router.get('/downloads/indusPortfMetrics/index/:index/mkt_index/:mkt_index/date/:date/period/:period', controller.get_IndusPortfMetrics_by_index_mkt_index)

// Portfolio metrics
router.get('/downloads/portfMetrics',controller.get_all_PortfMetrics);
router.get('/downloads/portfMetrics/:mkt_index/date/:date/period/:period', controller.get_PortfMetrics_by_mkt_index)
router.get('/downloads/portfMetrics/date/:date/period/:period', controller.get_PortfMetrics)

// Utilities
router.get('/downloads/dates',controller.get_dates);
router.get('/downloads/share_codes', controller.get_share_codes);
router.get('/downloads/index_codes', controller.get_index_codes);

export default router;