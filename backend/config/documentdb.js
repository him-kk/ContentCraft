const mongoose = require('mongoose');
const logger = require('../utils/logger');

const parseBooleanEnv = (value) => {
  if (value === undefined || value === null) return undefined;
  const normalized = String(value).trim().toLowerCase();
  if (['1', 'true', 'yes', 'y', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'n', 'off'].includes(normalized)) return false;
  return undefined;
};

const buildDocumentDbUri = () => {
  if (process.env.DOCUMENTDB_URI) return process.env.DOCUMENTDB_URI;

  const host = process.env.DOCUMENTDB_HOST;
  const port = process.env.DOCUMENTDB_PORT || '27017';
  const username = process.env.DOCUMENTDB_USERNAME;
  const password = process.env.DOCUMENTDB_PASSWORD;
  const database = process.env.DOCUMENTDB_DATABASE || 'admin';

  if (!host || !username || !password) return null;

  const replicaSet = process.env.DOCUMENTDB_REPLICA_SET || 'rs0';
  const readPreference = process.env.DOCUMENTDB_READ_PREFERENCE || 'secondaryPreferred';

  const userPart = encodeURIComponent(username);
  const passPart = encodeURIComponent(password);

  // AWS DocumentDB commonly requires retryWrites=false
  // TLS is typically required by DocumentDB; enable via DOCUMENTDB_TLS.
  const tlsEnabled = parseBooleanEnv(process.env.DOCUMENTDB_TLS);
  const tls = tlsEnabled !== undefined ? tlsEnabled : true;

  const params = new URLSearchParams();
  params.set('retryWrites', 'false');
  params.set('replicaSet', replicaSet);
  params.set('readPreference', readPreference);
  if (tls) params.set('tls', 'true');

  return `mongodb://${userPart}:${passPart}@${host}:${port}/${database}?${params.toString()}`;
};

const connectDocumentDB = async () => {
  try {
    const uri = buildDocumentDbUri();
    if (!uri) {
      throw new Error(
        'DocumentDB not configured. Set DOCUMENTDB_URI or DOCUMENTDB_HOST/DOCUMENTDB_USERNAME/DOCUMENTDB_PASSWORD.'
      );
    }

    const tlsEnabled = parseBooleanEnv(process.env.DOCUMENTDB_TLS);
    const tls = tlsEnabled !== undefined ? tlsEnabled : true;

    const caFile = process.env.DOCUMENTDB_CA_FILE;
    const allowInvalidCerts = parseBooleanEnv(process.env.DOCUMENTDB_TLS_ALLOW_INVALID_CERTS) || false;
    const allowInvalidHostnames = parseBooleanEnv(process.env.DOCUMENTDB_TLS_ALLOW_INVALID_HOSTNAMES) || false;

    if (tls && !caFile && !allowInvalidCerts && process.env.NODE_ENV !== 'production') {
      logger.warn(
        'DOCUMENTDB_TLS is enabled but DOCUMENTDB_CA_FILE is not set; consider setting DOCUMENTDB_CA_FILE to the AWS CA bundle'
      );
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: Number(process.env.DOCUMENTDB_SERVER_SELECTION_TIMEOUT_MS || 10000),
      tls,
      ...(caFile ? { tlsCAFile: caFile } : {}),
      ...(allowInvalidCerts ? { tlsAllowInvalidCertificates: true } : {}),
      ...(allowInvalidHostnames ? { tlsAllowInvalidHostnames: true } : {}),
    });

    logger.info(`DocumentDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.error(`Error connecting to DocumentDB: ${error.message}`);
    throw error;
  }
};

module.exports = { connectDocumentDB, buildDocumentDbUri };
