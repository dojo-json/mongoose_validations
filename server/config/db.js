/*
*  require mongoose
*/
const mongoose    = require('mongoose');

/*
*  require node utility module
*/
const util        = require('util');

/*
*  require debug for debugging purposes
*/
const debug       = require('debug')('mongoose-validations');

/*
*  require bluebird Promise module to replace mongoose Promise
*/
// mongoose.Promise  = require('bluebird');
mongoose.Promise  = global.Promise

/*
*  require file-system so that we can load, read, require all model files
*/
const fs          = require('fs');

/*
*  utilize path for easy dir/file joining
*/
const path        = require('path');

/*
*  Dir where our models are located
*/
const models_path = path.resolve('server', 'models');

/*
*  Regular expression that checks for .js extension
*/
const reg         = new RegExp(".js$", "i");

/*
*  database information
*/
const dbURI       = 'mongodb://localhost/validations';

/*
* Connect to the database
*/
mongoose.connect(dbURI);

/*
*  CONNECTION EVENTS
*  When successfully connected
*/
mongoose.connection.on('connected', () => {
  console.log(`Mongoose default connection open to ${ dbURI }`);
});

/*
*  If the connection throws an error
*/
mongoose.connection.on('error', err => {
  console.error(`Mongoose default connection error: ${ err }`);

  process.exit(0);
});

/*
* print mongoose logs when debugging
*/
if (process.env.MONGOOSE_DEBUG) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${ collectionName }.${ method }`, util.inspect(query, false, 20), doc);
  });
}

/*
*  When the connection is disconnected
*/
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
});

/*
*  If the Node process ends, close the Mongoose connection
*/
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disconnected through program termination');
    process.exit(0);
  });
});

/*
*  read all of the files in the models dir and
*  check if it is a javascript file before requiring it
*/
fs.readdirSync(models_path).forEach(file => {

  if(reg.test(file)) {

    require(path.join(models_path, file));
  }
});
