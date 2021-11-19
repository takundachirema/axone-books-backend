import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';

export function setEnvironment(app) {
    if (process.env.NODE_ENV !== 'production') {
        setDevEnv(app);
    }
    else {
        setProdEnv(app);
    }
}

function setDevEnv(app) {
    process.env.NODE_ENV = 'development';
    process.env.DB_DIALECT = 'mssql'; 
    process.env.DB_URL = 'localhost'; 
    process.env.DB_PORT = 1434; 
    process.env.DB_NAME = 'AIFMRM_ERS'; 
    process.env.DB_USERNAME = 'admin'; 
    process.env.DB_PASSWORD = 'admin'; 
    process.env.BIGCHAINDB = 'http://localhost:9984/api/v1/'; 
    process.env.PRIVATE_KEY = '2uMu1RfZYsEntPEHbByGfHvNMaAxeSb8BprL6taroPsLtv8FM5FgxTBEVQQJUzjMyGLGZxMTUqxGQVLiFwxML2kC'
    console.log("Setting development environment");
    app.use(morgan('dev'));
    app.use(cors());
    app.use(bodyParser.json());
}

function  setProdEnv(app) {
    process.env.DB_DIALECT = 'mssql'; 
    process.env.DB_URL = 'localhost'; 
    process.env.DB_PORT = 1434;
    process.env.DB_NAME = 'AIFMRM_ERS'; 
    process.env.DB_USERNAME = 'admin'; 
    process.env.DB_PASSWORD = 'admin'; 
    app.use(bodyParser.json());
    app.use(morgan('dev'));
    app.use(cors());
    app.use(express.static(__dirname + '/../dist'))
    console.log("Setting production environment");
}