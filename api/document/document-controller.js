import { DateTime } from 'mssql';
import {sequelize} from '../config/db';
const driver = require('bigchaindb-driver');
const { Op } = require("sequelize");

var FullBetaModel = require('../../model/full-beta-model').default;
var PortfolioMetrics = require('../../model/portfolio-metrics-model').default;
var IndustryPortfolioMetrics = require('../../model/industry-portf-model').default;
var SharesMetrics = require('../../model/shares-metrics-model').default;
const allIndexNames = require('../utilities/index-names');

export function publish(req, res) {
    const key_pair = new driver.Ed25519Keypair();
    const conn = new driver.Connection(process.env.BIGCHAINDB);

    // const assetdata = {
    //     'bicycle': {
    //         'serial_number': 'abcd1234',
    //         'manufacturer': 'Bicycle Inc.',
    //     }
    // }
    return res.status(200).json({message: JSON.stringify(key_pair)});
}