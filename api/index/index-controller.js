import { DateTime } from 'mssql';
import {sequelize} from '../config/db';

var IndexRep = require('../../repository/index-repository').default;
var IndexConstituentModel = require('../../model/index_constituent-model').default;
const StringUtil = require('../utilities/string-util')

export function get_all(req, res) {
    
    // First find most recent date in the constituents
    IndexConstituentModel.findOne({
        order: [ [ 'Date', 'DESC' ]]
    })
    .then(function(constituent) {
        var indexRep = new IndexRep("J203");
        indexRep.getData(constituent.Date, 12)
        .then(function(results){
            if (results["success"] == 1){
                return res.status(200).json({ results: indexRep });
            }
            return res.status(400).json({ error: results["message"] });
        })
        .catch(function (err) {
            return res.status(400).json({ error: err });
        });

    })
    .catch(function (err) {
        return res.status(400).json({ error: err });
    });
}

export function get_index(req, res) {
    var indexCode = req.params["indexCode"]
    var date = req.params["date"]
    var period = parseInt(req.params["period"])

    var indexRep = new IndexRep(indexCode);
    indexRep.getData(date, period)
    .then(function(results){
        if (results["success"] == 1){
            return res.status(200).json({ results: indexRep });
        }
        return res.status(400).json({ error: results["message"] });
    })
    .catch(function (err) {
        return res.status(400).json({ error: err });
    });
}

export function get_index_beta_data(req, res) {
    var date = req.params["date"]

    IndexRep.getIndexBetaData(date)
    .then(function(results){
        if (results["success"] == 1) {
            return res.status(200).json({ results: results["data"] });
        }
        return res.status(400).json({ error: results["message"] });
    })
    .catch(function (err) {
        console.log("** cont err 1 "+err)
        return res.status(400).json({ error: err });
    });
}

// http://localhost:3000/api/indexes/metrics/Weight/index/TOPI/marketindex/J203
export function get_index_metric_data(req, res) {
    var metricType = req.params["type"]
    var indexCode = req.params["code"]
    var mktCode = req.params["mktcode"]

    IndexRep.getIndexMetricData(metricType, indexCode, mktCode)
    .then(function(results){
        if (results["success"] == 1) {
            return res.status(200).json({ results: results["data"] });
        }
        return res.status(400).json({ error: results["message"] });
    })
    .catch(function (err) {
        console.log("** contr metric erro "+err)
        return res.status(400).json({ error: err });
    });
}
