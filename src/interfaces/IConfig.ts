import IValidFileType from './IValidFileType';

interface IConfig {
  port: string | number;
  protocol: string;
  hostname: string;
  endpoints: {
    files: string,
    health: string,
    readiness: string
  };
  services: {
    virusScan: {
      host: string,
      port: string | number,
      path: string
    },
    s3: {
      accessKeyId?: string,
      secretAccessKey?: string,
      bucket?: string,
      region?: string
    },
    keycloak: {
      authServerUrl?: string,
      realm?: string,
      clientId?: string,
      bearerOnly: boolean,
      confidentialPort: number,
      resource: string,
      sslRequired: string
    }
  };
  fileVersions: {
    original: string,
    clean: string,
    ocr: string
  };
  fileConversions: {
    pdfDensity: number
  };
  validFileTypes: {
    avi: IValidFileType,
    doc: IValidFileType,
    docx: IValidFileType,
    dot: IValidFileType,
    eps: IValidFileType,
    flv: IValidFileType,
    gif: IValidFileType,
    gpg: IValidFileType,
    jpg: IValidFileType,
    m4v: IValidFileType,
    mov: IValidFileType,
    mp3: IValidFileType,
    odp: IValidFileType,
    odt: IValidFileType,
    oga: IValidFileType,
    ogg: IValidFileType,
    ogv: IValidFileType,
    pdf: IValidFileType,
    png: IValidFileType,
    pps: IValidFileType,
    ppt: IValidFileType,
    pptx: IValidFileType,
    rtf: IValidFileType,
    tif: IValidFileType,
    xls: IValidFileType,
    xlsx: IValidFileType
  };
  fileSizeLimitInBytes: number;
}

export default IConfig;
