import { DateTime } from 'mssql';
import {sequelize} from '../config/db';
const driver = require('bigchaindb-driver');
const { Op } = require("sequelize");
const MongoClient = require('mongodb').MongoClient;

/**
 * Only returns the metadata of the latest books to be added
 * @param {*} req 
 * @param {*} res 
 */
export function getLatest(req, res) {
    var mongodb_url= req.body["mongodb_url"]

    const client = new MongoClient(mongodb_url);
    
    console.log("mongodb_url: "+mongodb_url)

    client.connect(function(err) {
        console.log("connection err: "+err)
        if (err) return res.status(400).json({ error: err});

        const db = client.db("bigchain");
        const metadata_collection = db.collection("metadata")

        metadata_collection.find({}).toArray(function(err, docs) {
            if (err) return res.status(400).json({ error: err});

            return res.status(200).json({results: docs});
        });
    });
    
}