
var PortfolioMetric_Tooltips = require('../../model/portfolio_metrics_tooltip_model').default;
var IndustryPortfolio_Tooltips = require('../../model/industry_portfolio_tooltip_model').default;
var SharesMetrics_Tooltips = require('../../model/shares_metrics_tooltip_model').default;


export function get_portfolio_metrics_tooltips(req, res) {
    PortfolioMetric_Tooltips.findAll()
    .then(function(results) {
        return res.status(200).json({message: results});
    }).catch(function (err) {
        return res.status(400).json({ error: err.message});
    });
}

export function get_industry_portfolio_tooltips(req, res) {
    IndustryPortfolio_Tooltips.findAll()
    .then(function(results) {
        return res.status(200).json({message: results});
    }).catch(function (err) {
        return res.status(400).json({ error: err.message});
    });
}

export function get_share_metrics_tooltips(req, res) {
    SharesMetrics_Tooltips.findAll()
    .then(function(results) {
        return res.status(200).json({message: results});
    }).catch(function (err) {
        return res.status(400).json({ error: err.message});
    });
}