import {NextFunction, Request, Response} from 'express';
import IConfig from '../interfaces/IConfig';
import FileConverter from '../utils/FileConverter';
import FileType from '../utils/FileType';

class FileConversionController {
  protected fileConverter: FileConverter;
  protected config: IConfig;
  protected fileService: any;

  constructor(fileConverter: FileConverter, config: IConfig, fileService: any) {
    this.fileConverter = fileConverter;
    this.config = config;
    this.fileService = fileService;
    this.convertFile = this.convertFile.bind(this);
  }

  public async convertFile(req: Request, res: Response, next: NextFunction) {
    const {file, logger}: Request = req;
    const {fileVersions}: IConfig = this.config;
    const fileToConvert: Express.Multer.File = req.allFiles[fileVersions.clean] || file;

    try {
      if (FileType.isValidFileTypeForConversion(fileToConvert.mimetype)) {
        logger(`File can be converted - ${fileToConvert.mimetype}`);

        const fileVersion: string = req.allFiles[fileVersions.clean] ? fileVersions.clean : fileVersions.original;

        fileToConvert.buffer = this.fileService.readFile(fileVersion, req.uuid);

        const convertedFile: Express.Multer.File = await this.fileConverter.convert(fileToConvert, req.logger);

        this.fileService.writeFile(this.config.fileVersions.clean, req.uuid, convertedFile.buffer);
        delete convertedFile.buffer;
        req.allFiles[fileVersions.clean] = convertedFile;
      } else {
        logger(`File cannot be converted - ${file.mimetype}`);
      }
      return next();
    } catch (err) {
      logger('Unable to convert file', 'error');
      logger(err.toString(), 'error');
      return res.status(500).json({error: 'Unable to convert file'});
    }
  }
}

export default FileConversionController;
