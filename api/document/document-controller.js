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