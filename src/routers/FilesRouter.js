import DeleteValidationController from '../controllers/DeleteValidationController';
import FileConverter from '../utils/FileConverter';
import GetValidationController from '../controllers/GetValidationController';
import MetadataController from '../controllers/MetadataController';
import OcrController from '../controllers/OcrController';
import PostResponseController from '../controllers/PostResponseController';
import PostValidationController from '../controllers/PostValidationController';
import S3Service from '../services/S3Service';
import StorageController from '../controllers/StorageController';
import VirusScanController from '../controllers/VirusScanController';

import config from '../config';
import express from 'express';
import gm from 'gm';
import joi from 'joi';
import multer from 'multer';
import ocr from 'tesseractocr';
import util from 'util';
import uuid from 'uuid/v4';

const storage = multer.memoryStorage();
const upload = multer({storage});
const s3Service = new S3Service(config, util);
const storageController = new StorageController(s3Service, config);

class FilesRouter {
  static router() {
    const router = express.Router();

    router.get(
      `${config.endpoints.files}/:processKey/:fileVersion/:filename`,
      new GetValidationController(joi).validateRoute,
      storageController.downloadFile
    );

    router.post(
      `${config.endpoints.files}/:processKey`,
      upload.single('file'),
      new PostValidationController(joi).validateRoute,
      new MetadataController(uuid, Date.now()).generateMetadata,
      storageController.uploadFile,
      new VirusScanController(new FileConverter(gm, util, config), config).scanFile,
      storageController.uploadFile,
      new OcrController(ocr, config).parseFile,
      storageController.uploadFile,
      new PostResponseController(config).response
    );

    router.delete(
      `${config.endpoints.files}/:processKey/:filename`,
      new DeleteValidationController(joi).validateRoute,
      storageController.deleteFiles
    );

    return router;
  }
}

export default FilesRouter;
