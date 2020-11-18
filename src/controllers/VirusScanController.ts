import {NextFunction, Request, Response} from 'express';
import * as request from 'superagent';
import IConfig from '../interfaces/IConfig';

class VirusScanController {
  protected config: IConfig;

  constructor(config: IConfig) {
    this.config = config;
    this.scanFile = this.scanFile.bind(this);
  }

  public async scanFile(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const {file, logger} = req;
    const {services} = this.config;
    const {host, path, port} = services.virusScan;
    const url = `${host}${port ? `:${port}` : ''}${path}`;
    logger('Virus scanning file');
    logger(`url = ${url}`, 'debug');
    logger(`file.buffer.length = ${file.buffer.length}`, 'debug');
    logger(`file.originalname = ${file.originalname}`, 'debug');

    try {
      const result = await request
        .post(url)
        .attach('file', file.buffer, file.originalname)
        .field('name', file.originalname);

      logger(`result.text = ${result.text}`, 'debug');

      if (result.text.includes('true')) {
        logger('Virus scan passed');
        return next();
      }

      logger('Virus scan failed', 'error');
      return res.status(400).json({error: 'Virus scan failed'});
    } catch (err) {
      logger('Unable to call the virus scanning service', 'error');
      logger(err.toString(), 'error');
      logger(err, 'debug');
      return res.status(500).json({error: 'Unable to call the virus scanning service'});
    }
  }
}

export default VirusScanController;
