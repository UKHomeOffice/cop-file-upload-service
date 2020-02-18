import {Request, Response} from 'express';
import PostResponseController from '../../../../src/controllers/PostResponseController';
import {config, expect, requestMock, responseMock, sinon, testFile} from '../../../setupTests';

describe('PostResponseController', () => {
  describe('response()', () => {
    it('should return the correct response', (done) => {
      const req: Request = requestMock({
        file: testFile,
        logger: {
          info: sinon.spy()
        },
        params: {
          businessKey: 'BF-20191218-798'
        }
      });
      const res: Response = responseMock();

      req.file.filename = '9e5eb809-bce7-463e-8c2f-b6bd8c4832d9';

      sinon.stub(res, 'status').returns(res);
      sinon.stub(res, 'json').returns(res);

      const postResponseController: PostResponseController = new PostResponseController(config);

      postResponseController.response(req, res);

      expect(res.status).to.have.been.calledOnce;
      expect(res.status).to.have.been.calledWith(201);
      expect(res.json).to.have.been.calledOnce;
      expect(res.json).to.have.been.calledWith({
        name: testFile.originalname,
        processedTime: testFile.processedTime,
        size: testFile.size,
        url: `${config.hostname}/${config.endpoints.files}/${req.params.businessKey}/${config.fileVersions.clean}/${testFile.filename}`
      });

      done();
    });
  });
});
