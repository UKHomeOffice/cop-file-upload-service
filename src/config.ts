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
      port: process.env.VIRUS_SCAN_PORT || 8080
    }
  },
  validFileTypes: {
    avi: {
      mimetype: 'video/x-msvideo',
      signature: '52494646'
    },
    doc: {
      mimetype: 'application/msword',
      signature: 'd0cf11e0a1b11ae1'
    },
    docx: {
      mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      signature: '504b0304'
    },
    dot: {
      mimetype: 'application/msword',
      signature: 'd0cf11e0a1b11ae1'
    },
    eps: {
      mimetype: 'application/postscript',
      signature: '252150532d41646f'
    },
    flv: {
      mimetype: 'video/x-flv',
      signature: '464c56'
    },
    gif: {
      mimetype: 'image/gif',
      signature: '47494638'
    },
    gpg: {
      mimetype: 'application/octet-stream',
      signature: '85'
    },
    jpg: {
      mimetype: 'image/jpeg',
      signature: 'ffd8ffe0'
    },
    m4v: {
      mimetype: 'video/x-m4v',
      offset: 8,
      signature: '667479704d345620'
    },
    mov: {
      mimetype: 'video/quicktime',
      offset: 8,
      signature: '6674797071742020'
    },
    mp3: {
      mimetype: 'audio/mpeg',
      signature: '494433'
    },
    odp: {
      mimetype: 'application/vnd.oasis.opendocument.presentation',
      signature: '504b0304'
    },
    odt: {
      mimetype: 'application/vnd.oasis.opendocument.text',
      signature: '504b0304'
    },
    oga: {
      mimetype: 'audio/ogg',
      signature: '4f67675300020000'
    },
    ogg: {
      mimetype: 'audio/ogg',
      signature: '4f67675300020000'
    },
    ogv: {
      mimetype: 'video/ogg',
      signature: '4f67675300020000'
    },
    pdf: {
      mimetype: 'application/pdf',
      signature: '25504446'
    },
    pgp: {
      mimetype: 'application/octet-stream',
      offset: 4,
      signature: '504750'
    },
    png: {
      mimetype: 'image/png',
      signature: '89504e470d0a1a0a'
    },
    pps: {
      mimetype: 'application/vnd.ms-powerpoint',
      signature: 'd0cf11e0a1b11ae1'
    },
    ppt: {
      mimetype: 'application/vnd.ms-powerpoint',
      signature: 'd0cf11e0a1b11ae1'
    },
    pptx: {
      mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      signature: '504b0304'
    },
    rtf: {
      mimetype: 'application/rtf',
      signature: '7b5c72746631'
    },
    tif: {
      mimetype: 'image/tiff',
      signature: '49492a00'
    },
    xls: {
      mimetype: 'application/vnd.ms-excel',
      signature: 'd0cf11e0a1b11ae1'
    },
    xlsx: {
      mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      signature: '504b0304'
    }
  }
};

export default config;
