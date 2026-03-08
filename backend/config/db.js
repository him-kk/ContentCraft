// const mongoose = require('mongoose');
// const logger = require('../utils/logger');

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI, {
//       // Mongoose 6+ doesn't need these options anymore, but keeping for clarity
//     });

//     logger.info(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     logger.error(`Error connecting to MongoDB: ${error.message}`);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;

// const mongoose = require('mongoose');
// const logger = require('../utils/logger');
// const path = require('path');

// console.log("MONGODB_URI:", process.env.MONGODB_URI);
// const connectDB = async () => {
//   try {
//     console.log("MONGODB_URI:", process.env.MONGODB_URI);
//     const conn = await mongoose.connect(process.env.MONGODB_URI, {
//       tls: true,
//       tlsCAFile: path.join(__dirname, '../global-bundle.pem'),
//       tlsAllowInvalidHostnames: true,
//       // Prevent the driver from following replica-set member addresses
//       // returned by DocumentDB (which are VPC-private IPs). When using an
//       // SSH tunnel on localhost:XXXX, directConnection=true keeps all traffic
//       // on the tunnel and avoids ETIMEDOUT on the real cluster IP.
//       directConnection: true,
//       // DocumentDB only supports SCRAM-SHA-1; the MongoDB driver defaults to
//       // SCRAM-SHA-256 which DocumentDB rejects with error -301.
//       authMechanism: 'SCRAM-SHA-1',
//     });

//     logger.info(`DocumentDB Connected from hrs: ${conn.connection.host}`);
//   } catch (error) {
//     logger.error(`Error connecting to DocumentDB: ${error.message}`);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;

//Production ready

const mongoose = require('mongoose');
const logger = require('../utils/logger');
const path = require('path');

const connectDB = async () => {
  try {
    console.log("MONGODB_URI:", process.env.MONGODB_URI);

    const isProduction = process.env.NODE_ENV === 'production';

    const options = isProduction
      ? {
          // Production — EB connects directly to DocumentDB
          tls: true,
          tlsCAFile: '/etc/pki/tls/certs/global-bundle.pem', // downloaded by .ebextensions
          retryWrites: false,
          authMechanism: 'SCRAM-SHA-1',
          serverSelectionTimeoutMS: 10000,
        }
      : {
          // Local development — SSH tunnel
          tls: true,
          tlsCAFile: path.join(__dirname, '../global-bundle.pem'),
          tlsAllowInvalidHostnames: true,
          directConnection: true,
          authMechanism: 'SCRAM-SHA-1',
          retryWrites: false,
        };

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    logger.info(`DocumentDB Connected from aws: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error connecting to DocumentDB to aws: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;