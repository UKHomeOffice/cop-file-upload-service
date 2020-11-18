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
  fileSizeLimitInBytes: 25000000,
  fileVersions: {
    clean: 'clean',
    ocr: 'ocr',
    original: 'orig'
  },
  hostname: process.env.FILE_UPLOAD_SERVICE_URL || 'localhost',
  logLevel: process.env.FILE_UPLOAD_SERVICE_LOG_LEVEL || 'info',
  port: process.env.PORT || 8181,
  protocol: process.env.PROTOCOL || 'https://',
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
      port: process.env.VIRUS_SCAN_PORT
    }
  },
  validFileTypes: {
    avi: {
      mimetype: 'video/x-msvideo',
      signatures: ['52494646']
    },
    csv: {
      mimetype: 'text/csv',
      signatures: []
    },
    doc: {
      mimetype: 'application/msword',
      signatures: ['d0cf11e0a1b11ae1']
    },
    docx: {
      mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      signatures: ['504b0304']
    },
    dot: {
      mimetype: 'application/msword',
      signatures: ['d0cf11e0a1b11ae1']
    },
    eps: {
      mimetype: 'application/postscript',
      signatures: ['252150532d41646f']
    },
    flv: {
      mimetype: 'video/x-flv',
      signatures: ['464c56']
    },
    gif: {
      mimetype: 'image/gif',
      signatures: ['47494638']
    },
    gpg: {
      mimetype: 'application/octet-stream',
      signatures: ['85']
    },
    jpg: {
      mimetype: 'image/jpeg',
      signatures: ['ffd8ffe0', 'ffd8ffe1']
    },
    m4v: {
      mimetype: 'video/x-m4v',
      offset: 8,
      signatures: ['667479704d345620']
    },
    mov: {
      mimetype: 'video/quicktime',
      offset: 8,
      signatures: ['6674797071742020']
    },
    mp3: {
      mimetype: 'audio/mpeg',
      signatures: ['494433']
    },
    odp: {
      mimetype: 'application/vnd.oasis.opendocument.presentation',
      signatures: ['504b0304']
    },
    odt: {
      mimetype: 'application/vnd.oasis.opendocument.text',
      signatures: ['504b0304']
    },
    oga: {
      mimetype: 'audio/ogg',
      signatures: ['4f67675300020000']
    },
    ogg: {
      mimetype: 'audio/ogg',
      signatures: ['4f67675300020000']
    },
    ogv: {
      mimetype: 'video/ogg',
      signatures: ['4f67675300020000']
    },
    pdf: {
      mimetype: 'application/pdf',
      signatures: ['25504446']
    },
    pgp: {
      mimetype: 'application/pgp-encrypted',
      offset: 4,
      signatures: ['504750']
    },
    png: {
      mimetype: 'image/png',
      signatures: ['89504e470d0a1a0a']
    },
    pps: {
      mimetype: 'application/vnd.ms-powerpoint',
      signatures: ['d0cf11e0a1b11ae1']
    },
    ppt: {
      mimetype: 'application/vnd.ms-powerpoint',
      signatures: ['d0cf11e0a1b11ae1']
    },
    pptx: {
      mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      signatures: ['504b0304']
    },
    rtf: {
      mimetype: 'application/rtf',
      signatures: ['7b5c72746631']
    },
    tif: {
      mimetype: 'image/tiff',
      signatures: ['49492a00']
    },
    xls: {
      mimetype: 'application/vnd.ms-excel',
      signatures: ['d0cf11e0a1b11ae1']
    },
    xlsx: {
      mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      signatures: ['504b0304']
    }
  }
};

export default config;
