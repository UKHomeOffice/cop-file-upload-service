import * as dotenv from 'dotenv';
import IConfig from './interfaces/IConfig';
import Environment from './utils/Environment';

if (Environment.isDev(process.env.NODE_ENV)) {
  dotenv.config();
}

const config: IConfig = {
  endpoints: {
    files: '/files',
    health: '/healthz',
    readiness: '/readiness'
  },
  fileConversions: {
    pdfDensity: 300
  },
  fileVersions: {
    clean: 'clean',
    ocr: 'ocr',
    original: 'orig'
  },
  hostname: `${process.env.PROTOCOL}${process.env.FILE_UPLOAD_SERVICE_URL}` || 'https://localhost',
  port: process.env.PORT || 8181,
  services: {
    keycloak: {
      authServerUrl: process.env.AUTH_URL,
      bearerOnly: true,
      clientId: process.env.AUTH_CLIENT_ID,
      confidentialPort: 0,
      realm: process.env.AUTH_REALM,
      resource: 'file-upload-service',
      sslRequired: 'external'
    },
    s3: {
      accessKeyId: process.env.AWS_ACCESS_KEY || 'dummy-access-key',
      bucket: process.env.AWS_BUCKET || 'dummy-bucket',
      region: process.env.AWS_REGION || 'dummy-region',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'dummy-secret-access-key'
    },
    virusScan: {
      host: process.env.VIRUS_SCAN_HOST || 'localhost',
      path: '/scan',
      port: process.env.VIRUS_SCAN_PORT || 8080
    }
  }
};

export default config;
