import AWS from 'aws-sdk';

class S3Service {
  constructor(config, util) {
    this.s3 = this.init(config);
    this.config = config;
    this.util = util;
  }

  init(config) {
    return new AWS.S3({
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
      region: config.region
    });
  }

  downloadParams(config, filename, processKey) {
    return {
      Bucket: config.bucket,
      Key: `${processKey}/${filename}`
    };
  }

  uploadParams(config, file, processKey) {
    return {
      Bucket: config.bucket,
      Key: `${processKey}/${file.filename}`,
      Body: file.buffer,
      ServerSideEncryption: config.serverSideEncryption,
      SSEKMSKeyId: config.sseKmsKeyId,
      ContentType: file.mimetype,
      Metadata: {
        originalfilename: file.originalname
      }
    };
  }

  downloadFile(filename, processKey) {
    const params = this.downloadParams(this.config, filename, processKey);
    return this.fetchAsync('getObject', params);
  }

  uploadFile(file, processKey) {
    const params = this.uploadParams(this.config, file, processKey);
    return this.fetchAsync('upload', params);
  }

  fetchAsync(method, params) {
    const asyncMethod = this.util.promisify(this.s3[method].bind(this.s3));
    return asyncMethod(params);
  }
}

export default S3Service;