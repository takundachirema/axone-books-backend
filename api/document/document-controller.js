import { DateTime } from 'mssql';
import {sequelize} from '../config/db';
const driver = require('bigchaindb-driver');
const { Op } = require("sequelize");
const MongoClient = require('mongodb').MongoClient;
import nacl from 'tweetnacl'
import Base58 from 'base-58'
import ed2curve from 'ed2curve'
import CryptoJS from 'crypto-js'

/**
 * Only returns the metadata of the latest books to be added
 * @param {*} req 
 * @param {*} res 
 */
export function getLatest(req, res) {
    var mongodb_url= req.body["mongodb_url"]

    const client = new MongoClient(mongodb_url);
    
    client.connect(function(err) {

        if (err) return res.status(400).json({ error: err});

        const db = client.db("bigchain");
        const transactions_collection = db.collection("transactions");

        var query = getMetadata(transactions_collection);

        query.toArray(function(err, docs) {
            if (err) return res.status(400).json({ error: err});
            return res.status(200).json({results: docs});
        });
    });
}

/**
 * This method gets the metadata of the most recently edited assets.
 * @param {boolean} latest Retrieve the latest asset metadata
 * @param {int} max Retrieve certain number of metadata
 */
function getMetadata(transactions_collection, latest = true, max = 10, search_text = null){

    return transactions_collection
    .aggregate([
        {$match: { operation: { $ne: "CREATE" }  }},
        {$group: {
            _id: "$asset.id",
            asset_id: {"$last":"$asset.id"},
            transaction_id: {"$last":"$id"},
        }},
        {$lookup:{
            from: 'metadata',
            localField: 'transaction_id',
            foreignField: 'id',
            as: 'metadata'
        }},
        {$unwind: "$metadata"},
        {$lookup:{
            from: 'assets',
            localField: 'asset_id',
            foreignField: 'id',
            as: 'asset'
        }},
        {$unwind: "$asset"},
        {$project: {
            "id": "$transaction_id",
            "asset_id": "$asset_id",
            //"version": "$asset.version",
            "version": "2.0", // ** testing
            "transaction_id": "$transaction_id",
            "metadata": "$metadata.metadata"
        }},
        {$project: {
            "_id": 0,
            "metadata.blob": 0,
            "metadata.properties": 0
        }}
    ]);
}

export function getDocument(req, res) {
    var mongodb_url= req.body["mongodb_url"]
    var id = req.body["id"]

    const client = new MongoClient(mongodb_url);
    
    console.log("mongodb_url: "+mongodb_url)

    client.connect(function(err) {
        console.log("connection err: "+err)
        if (err) return res.status(400).json({ error: err});

        const db = client.db("bigchain");
        const assets_collection = db.collection("assets")

        assets_collection.find({"id":id}).toArray(function(err, docs) {
            if (err) return res.status(400).json({ error: err});
            var data = docs[0].data

            //console.log(data)
            // get the secret and nonce as base58
            var secret_b58 = data.axone_secret;
            var nonce_b58 = data.axone_nonce;

            //console.log("se: "+secret_b58+" no: "+nonce_b58)
            // convert secret and nonce to uint8 arrays
            var secret_uint8arr = Base58.decode(secret_b58)
            var nonce_uint8arr = Base58.decode(nonce_b58)

            //console.log("pv: "+process.env.PRIVATE_KEY+" pb: "+data.document_pk)
            // get axone secret key corresponding to public key on client side
            // get document public key for the private key used to encrypt
            var private_key_b58 = process.env.PRIVATE_KEY;
            var public_key_b58 = data.document_pk;

            // convert both keys to uint8 arrays
            var ed_private_key_uint8 = Base58.decode(private_key_b58)
            var ed_public_key_uint8= Base58.decode(public_key_b58)

            // convert the ed keys to cv keys
            var cv_private_key_uint8 = ed2curve.convertSecretKey(ed_private_key_uint8);
            var cv_public_key_uint8 = ed2curve.convertPublicKey(ed_public_key_uint8);
            
            // now decrypt the secret to its uint8 array
            var d_secret_uint8arr = nacl.box.open(secret_uint8arr, nonce_uint8arr, cv_public_key_uint8, cv_private_key_uint8)

            // now get the b58 representation of the secret
            var d_secret_b58 = Base58.encode(d_secret_uint8arr)
            
            // now decrypt the document blob
            var d_document = CryptoJS.AES.decrypt(data.blob, d_secret_b58).toString(CryptoJS.enc.Utf8);

            //console.log(d_document);
            return res.status(200).json({results: d_document});
        });
    });
}

export function getAdjacentDocuments(req, res){
    var mongodb_url= req.body["mongodb_url"]
    var asset_id = req.body["asset_id"]

    const client = new MongoClient(mongodb_url);
    var results = []

    client.connect(function(err) {

        if (err) return res.status(400).json({ error: err});

        const db = client.db("bigchain");
        const assets_collection = db.collection("assets");

        var query_ref_by = getAdjacentReferencingAsset(assets_collection, asset_id);

        query_ref_by.toArray(function(err, adj_ref_by) {
            if (err){ 
                console.log(err)
                return res.status(400).json({ error: err});
            }
            // put in results
            results = results.concat(adj_ref_by);

            // Then get the adjacent nodes referenced by asset
            assets_collection
            .findOne({id: asset_id})
            .then(asset => {
                var parents = asset.data.parents;
                var children =  asset.data.children;
                
                if (parents == null) parents = [];
                if (children == null) children = [];

                var asset_ids = parents.concat(children);

                var query_ref = getAdjacentReferencedByAsset(assets_collection, asset_ids);
                query_ref.toArray(function(err, adj_ref) {
                    if (err) return res.status(400).json({ error: err});

                    results = results.concat(adj_ref);
                    return res.status(200).json({results: results});
                });
            })
            .catch(err => {
                console.log("errors: "+err.message)
                return res.status(400).json({ error: err});
            });
        });
    });
}

/**
 * Only gets nodes that referenced the asset_id
 * getAdjacentAssetReferenced() gets nodes the asset referenced
 * @param {*} assets_collection 
 * @param {*} asset_id 
 */
function getAdjacentReferencingAsset(assets_collection, asset_id){

    return assets_collection
    .aggregate([
        {$match: { $text: { $search: asset_id }} },
        {$match: { id: { $ne: asset_id }  }},
        {$lookup:{
            from: 'transactions',
            localField: 'id',
            foreignField: 'asset.id',
            as: 'transactions'
        }},
        {$unwind: "$transactions"},
        {$group: {
            _id: "$transactions.id",
            asset_id: {"$last":"$id"},
            transaction_id: {"$last":"$transactions.id"},
            children: {"$last":"$data.children"},
            parents: {"$last":"$data.parents"}
        }},
        {$lookup:{
            from: 'metadata',
            localField: 'transaction_id',
            foreignField: 'id',
            as: 'metadata'
        }},
        {$unwind: "$metadata"},
        {$project: {
            "id": "$transaction_id",
            "asset_id": "$asset_id",
            "transaction_id": "$transaction_id",
            //"version": "$data.version",
            "version": "3.0", // ** testing
            // If asset_id is a child, then THIS asset is a parent.
            "is_parent" : {$in: [ asset_id, "$children" ]},
            "metadata": "$metadata.metadata"
        }},
        {$project: {
            "_id": 0,
            "metadata.blob": 0,
            "metadata.properties": 0
        }}
    ]);
}

function getAdjacentReferencedByAsset(assets_collection, parents_ids, children_ids){
    var asset_ids = parents_ids.concat(children_ids);

    return assets_collection
    .aggregate([
        {$match: { id: { $in: asset_ids } }},
        {$lookup:{
            from: 'transactions',
            localField: 'id',
            foreignField: 'asset.id',
            as: 'transactions'
        }},
        {$unwind: "$transactions"},
        {$group: {
            _id: "$transactions.id",
            asset_id: {"$last":"$id"},
            transaction_id: {"$last":"$transactions.id"},
        }},
        {$lookup:{
            from: 'metadata',
            localField: 'transaction_id',
            foreignField: 'id',
            as: 'metadata'
        }},
        {$unwind: "$metadata"},
        {$project: {
            "id": "$transaction_id",
            "asset_id": "$asset_id",
            "transaction_id": "$transaction_id",
            //"version": "$data.version",
            "version": "1.0", // ** testing
            "is_parent" : {$in: [ "$asset_id", parents_ids ]},
            "metadata": "$metadata.metadata"
        }},
        {$project: {
            "_id": 0,
            "metadata.blob": 0,
            "metadata.properties": 0
        }}
    ]);
}