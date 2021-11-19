import express from 'express';
const router = express.Router();
import * as controller from './tooltips_controller';

router.get('/tooltips/industry_portfolio', controller.get_industry_portfolio_tooltips);
router.get('/tooltips/portfolio_metrics', controller.get_portfolio_metrics_tooltips)
router.get('/tooltips/shares_metrics', controller.get_share_metrics_tooltips);

export default router;