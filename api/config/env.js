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
    process.env.BIGCHAINDB = 'http://localhost:9984/api/v1/'; 
    // TODO: move this to .env file which is not tracked
    process.env.PRIVATE_KEY = '2uMu1RfZYsEntPEHbByGfHvNMaAxeSb8BprL6taroPsLtv8FM5FgxTBEVQQJUzjMyGLGZxMTUqxGQVLiFwxML2kC'
    process.env.XUMM_API_KEY = 'ad35a652-8c9f-4345-a84f-204c4311b6aa'
    process.env.XUMM_SECRET_KEY = 'e776aadb-8c2e-4ba6-b48f-4903fec92803'
    app.use(morgan('dev'));
    app.use(cors());
    app.use(bodyParser.json());
    console.log("Setting development environment");
}

function setProdEnv(app) {
    process.env.BIGCHAINDB = 'https://nececity.net/api/v1/'; 
    // TODO: move this to .env file which is not tracked
    process.env.PRIVATE_KEY = '2uMu1RfZYsEntPEHbByGfHvNMaAxeSb8BprL6taroPsLtv8FM5FgxTBEVQQJUzjMyGLGZxMTUqxGQVLiFwxML2kC'
    process.env.XUMM_API_KEY = 'ad35a652-8c9f-4345-a84f-204c4311b6aa'
    process.env.XUMM_SECRET_KEY = 'e776aadb-8c2e-4ba6-b48f-4903fec92803'
    app.use(bodyParser.json());
    app.use(morgan('dev'));
    app.use(cors());
    app.use(express.static(__dirname + '/../dist'))
    console.log("Setting production environment");
}