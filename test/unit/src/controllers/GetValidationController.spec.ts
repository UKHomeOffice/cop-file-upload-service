import {NextFunction, Request, Response} from 'express';
import * as Joi from 'joi';
import GetValidationController from '../../../../src/controllers/GetValidationController';
import GetFileValidation from '../../../../src/validation/GetFileValidation';
import {expect, requestMock, responseMock, sinon, validateMock} from '../../../setupTests';

describe('GetFileValidationController', () => {
  describe('validateRoute()', () => {
    it('should call validate.validateFields() and handleValidation()', (done) => {
      const getFileValidation: GetFileValidation = new GetFileValidation();
      const req: Request = requestMock({
        params: {
          businessKey: 'BF-20191218-798',
          fileVersion: 'orig',
          filename: '9e5eb809-bce7-463e-8c2f-b6bd8c4832d9'
        }
      });
      const res: Response = responseMock();
      const next: NextFunction = () => true;
      const getValidationController: GetValidationController = new GetValidationController(Joi, getFileValidation);

      getValidationController.validate = validateMock;
      const validateStub: sinon.SinonStub = sinon
        .stub(getValidationController.validate, 'validateFields')
        .returns(null);
      getValidationController.handleValidation = sinon.spy();

      const result = getValidationController.validateRoute(req, res, next);

      expect(getValidationController.validate.validateFields).to.have.been.calledOnce;
      expect(getValidationController.validate.validateFields).to.have.been.calledWith(getFileValidation, Joi, req.params);
      expect(getValidationController.handleValidation).to.have.been.calledOnce;
      expect(getValidationController.handleValidation).to.have.been.calledWith(req, res, next, null);

      validateStub.restore();

      done();
    });
  });
});
