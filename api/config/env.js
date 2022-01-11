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
    process.env.PRIVATE_KEY = '2uMu1RfZYsEntPEHbByGfHvNMaAxeSb8BprL6taroPsLtv8FM5FgxTBEVQQJUzjMyGLGZxMTUqxGQVLiFwxML2kC'
    app.use(morgan('dev'));
    app.use(cors());
    app.use(bodyParser.json());
    console.log("Setting development environment");
}

function setProdEnv(app) {
    process.env.BIGCHAINDB = 'https://nececity.net/api/v1/'; 
    process.env.PRIVATE_KEY = '2uMu1RfZYsEntPEHbByGfHvNMaAxeSb8BprL6taroPsLtv8FM5FgxTBEVQQJUzjMyGLGZxMTUqxGQVLiFwxML2kC'
    app.use(bodyParser.json());
    app.use(morgan('dev'));
    app.use(cors());
    app.use(express.static(__dirname + '/../dist'))
    console.log("Setting production environment");
}