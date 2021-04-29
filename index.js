// Bring in the express package
import express from 'express';
import bodyParser from 'body-parser';
import {setEnvironment} from './api/config/env';
import {connectToDB} from './api/config/db';
import {registerRoutes} from './routes.js';

const app = express() // instantiate a new express app
const port = 3000

setEnvironment(app);
connectToDB();
registerRoutes(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// creating a route
app.get('/', (req, res) => {
  if (process.env.NODE_ENV !== 'production'){
      return res.send("Running server in dev mode")
  } else {
      return res.sendFile("index.html", {root: __dirname + '/../dist/'});
  }
})

// use sudo npm install nodemon -g 
// package to get hot reloads for express servers
// and can now run: nodemon dev-server/index.js to serve the web server
app.listen(port, () => {
  console.log(`E.g. app listening at http://localhost:${port}`)
})