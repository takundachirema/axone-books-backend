import { DateTime } from 'mssql';
import {sequelize} from '../config/db';
const { Op } = require("sequelize");

var FullBetaModel = require('../../model/full-beta-model').default;
var PortfolioMetrics = require('../../model/portfolio-metrics-model').default;
var IndustryPortfolioMetrics = require('../../model/industry-portf-model').default;
var SharesMetrics = require('../../model/shares-metrics-model').default;
const allIndexNames = require('../utilities/index-names')

export function get_all(req, res) {
    // First find most recent date in the constituents
    FullBetaModel.findAll({
        where: {Instrument: {[Op.notIn]: allIndexNames}}
    })
    .then(function(results) {
        return res.status(200).json({message: results});
    }).catch(function (err) {
        return res.status(400).json({ error: err.message});
    });
}

export function get_indextable(req, res) {
    var proxy = req.params["proxy"]
    var date = req.params["date"]
    var period = req.params["period"]
    FullBetaModel.findAll({
        where: sequelize.literal(
            " \"Instrument\" IN (:indexes) AND"+
            " \"Index\" = '" + proxy + "' AND" +
            " (Date BETWEEN DATEADD(MONTH,"+(-1 * period)+",'"+date+"') AND '"+date+"')"
        ),
        replacements: {indexes: allIndexNames},
        order: [ [ 'Date', 'DESC' ]]
    })
    .then(function(results) {
        return res.status(200).json({message: results});
    }).catch(function (err) {
        return res.status(400).json({ error: err.message});
    });
}

export function get_sharetable(req, res) {
    var proxy = req.params["proxy"]
    var date = req.params["date"]
    var period = req.params["period"]
    FullBetaModel.findAll({
        where: sequelize.literal(
            " \"Instrument\" NOT IN (:indexes) AND"+
            " \"Index\" = '" + proxy + "' AND" +
            " (Date BETWEEN DATEADD(MONTH,"+(-1 * period)+",'"+date+"') AND DATEADD(DAY,"+1+",'"+date+"'))"
        ),
        replacements: {indexes: allIndexNames},
        order: [ [ 'Date', 'DESC' ]]
    })
    .then(function(results) {
        return res.status(200).json({message: results});
    }).catch(function (err) {
        return res.status(400).json({ error: err.message});
    });
}

export function get_dates(req, res) {
    FullBetaModel.sequelize.query('SELECT distinct "Date" from tbl_BA_Beta_Output order by "Date" desc', {
            type: FullBetaModel.sequelize.QueryTypes.SELECT
    })
    .then(function(results) {
        return res.status(200).json({message: results});
    }).catch(function (err) {
        return res.status(400).json({ error: err.message});
    });
}

// Share Metrics
export function get_all_SharesMetrics(req, res) {
    // First find most recent date in the constituents
    SharesMetrics.findAll()
    .then(function(results) {
        return res.status(200).json({message: results});
    }).catch(function (err) {
        return res.status(400).json({ error: err.message});
    });
}
export function get_ShareMetrics(req, res) {
    var index = req.params["index_code"]
    var mkt_index_code = req.params["mkt_index_code"]
    var share_code = req.params["share_code"]
    var date = req.params["date"]
    var period = req.params["period"]
    SharesMetrics.findAll({
        where: sequelize.literal(
            " \"index_code\" = '" + index + "' AND" +
            " mkt_index_code = '" + mkt_index_code + "' AND"+
            " \"share_code\" = '" + share_code + "' AND" +
            " (Date BETWEEN DATEADD(MONTH,"+(-1 * period)+",'"+date+"') AND DATEADD(DAY,"+1+",'"+date+"'))"
        ),
        replacements: {indexes: allIndexNames},
        order: [ [ 'Date', 'DESC' ]]
    })
    .then(function(results) {
        return res.status(200).json({message: results});
    }).catch(function (err) {
        return res.status(400).json({ error: err.message});
    });
}
export function get_ShareMetrics_all_shares(req, res) {
    var index = req.params["index_code"]
    var mkt_index_code = req.params["mkt_index_code"]
    var date = req.params["date"]
    var period = req.params["period"]
    SharesMetrics.findAll({
        where: sequelize.literal(
            " \"index_code\" = '" + index + "' AND" +
            " mkt_index_code = '" + mkt_index_code + "' AND"+
            " (Date BETWEEN DATEADD(MONTH,"+(-1 * period)+",'"+date+"') AND DATEADD(DAY,"+1+",'"+date+"'))"
        ),
        replacements: {indexes: allIndexNames},
        order: [ [ 'Date', 'DESC' ]]
    })
    .then(function(results) {
        return res.status(200).json({message: results});
    }).catch(function (err) {
        return res.status(400).json({ error: err.message});
    });
}
export function get_share_codes(req, res) {
    SharesMetrics.sequelize.query('SELECT distinct "share_code" from shares_metrics order by "share_code" asc', {
        type: SharesMetrics.sequelize.QueryTypes.SELECT
    })
    .then(function(results) {
        return res.status(200).json({message: results});
    }).catch(function (err) {
        return res.status(400).json({ error: err.message});
    });
}
export function get_index_codes(req, res) {
    SharesMetrics.sequelize.query('SELECT distinct "index_code" from shares_metrics order by "index_code" asc', {
        type: SharesMetrics.sequelize.QueryTypes.SELECT
    })
    .then(function(results) {
        return res.status(200).json({message: results});
    }).catch(function (err) {
        return res.status(400).json({ error: err.message});
    });
}



// Industry Portfolio Metrics
export function get_all_IndusPortfMetrics(req, res) {
    // First find most recent date in the constituents
    IndustryPortfolioMetrics.findAll()
    .then(function(results) {
        return res.status(200).json({message: results});
    }).catch(function (err) {
        return res.status(400).json({ error: err.message});
    });
}
export function get_IndusPortfMetrics_by_index_mkt_index(req, res) {
    var index = req.params["index"]
    var mkt_index = req.params["mkt_index"]
    var date = req.params["date"]
    var period = req.params["period"]
    IndustryPortfolioMetrics.findAll({
        where: sequelize.literal(
            " \"index\" = '" + index + "' AND" + " \"mkt_index\" = '" + mkt_index + "' AND" +
            " (Date BETWEEN DATEADD(MONTH,"+(-1 * period)+",'"+date+"') AND '"+date+"')"
        ),
        order: [ [ 'Date', 'DESC' ]]
    })
    .then(function(results) {
        return res.status(200).json({message: results});
    }).catch(function (err) {
        return res.status(400).json({ error: err.message});
    });
}


// Portfolio Metrics
export function get_all_PortfMetrics(req, res) {
    // First find most recent date in the constituents
    PortfolioMetrics.findAll()
    .then(function(results) {
        return res.status(200).json({message: results});
    }).catch(function (err) {
        return res.status(400).json({ error: err.message});
    });
}
export function get_PortfMetrics_by_mkt_index(req, res) {
    var mkt_index_code = req.params["mkt_index"]
    var date = req.params["date"]
    var period = req.params["period"]
    PortfolioMetrics.findAll({
        where: sequelize.literal(
            " \"mkt_index_code\" = '" + mkt_index_code + "' AND" +
            " (Date BETWEEN DATEADD(MONTH,"+(-1 * period)+",'"+date+"') AND '"+date+"')"
        ),
        attributes: { 
            exclude: ["SystemicCovMatrix", "SpecificCovMatrix", "TotalCovMatrix", "CorrelationMatrix", "MatrixID"]
        },
        order: [ [ 'Date', 'DESC' ]]
    })
    .then(function(results) {
        return res.status(200).json({message: results});
    }).catch(function (err) {
        return res.status(400).json({ error: err.message});
    });
}
export function get_PortfMetrics(req, res) {
    var date = req.params["date"]
    var period = req.params["period"]
    PortfolioMetrics.findAll({
        where: sequelize.literal(
            " (Date BETWEEN DATEADD(MONTH,"+(-1 * period)+",'"+date+"') AND '"+date+"')"
        ),
        attributes: {
            exclude: ["SystemicCovMatrix", "SpecificCovMatrix", "TotalCovMatrix", "CorrelationMatrix", "MatrixID"]
        },
        order: [ [ 'Date', 'DESC' ]]
    })
    .then(function(results) {
        return res.status(200).json({message: results});
    }).catch(function (err) {
        return res.status(400).json({ error: err.message});
    });
}