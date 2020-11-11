import * as fs from 'fs';
import * as Joi from 'joi';
import IState from '../../../../../src/interfaces/IState';
import FileTypeValidator from '../../../../../src/validation/validators/FileTypeValidator';
import {config, expect, testFile} from '../../../../setupTests';

describe('FileTypeValidator', () => {
  describe('validFileProps()', () => {
    it('should return the correct file props', (done) => {
      const mimetype: string = 'application/pdf';
      const filter = FileTypeValidator.mimeFilter(mimetype);
      const validFileProps = FileTypeValidator.validFileProps(config.validFileTypes, filter);
      expect(validFileProps).to.equal(config.validFileTypes.pdf);
      done();
    });
  });

  describe('mimeFilter()', () => {
    const mimetype: string = 'application/pdf';

    it('should return true when the filetype matches', (done) => {
      const mimeFilter = FileTypeValidator.mimeFilter(mimetype);
      const result = mimeFilter(['pdf', config.validFileTypes.pdf]);
      expect(result).to.be.true;
      done();
    });

    it('should return false when the mimetype does not match', (done) => {
      const mimeFilter = FileTypeValidator.mimeFilter(mimetype);
      const result = mimeFilter(['jpg', config.validFileTypes.jpg]);
      expect(result).to.be.false;
      done();
    });
  });

  describe('extensionFilter()', () => {
    const extension: string = 'pdf';

    it('should return true when the extension matches', (done) => {
      const extensionFilter = FileTypeValidator.extensionFilter(extension);
      const result = extensionFilter(['pdf', config.validFileTypes.pdf]);
      expect(result).to.be.true;
      done();
    });

    it('should return false when the extension does not match', (done) => {
      const extensionFilter = FileTypeValidator.extensionFilter(extension);
      const result = extensionFilter(['jpg', config.validFileTypes.jpg]);
      expect(result).to.be.false;
      done();
    });
  });

  describe('fileHex()', () => {
    const file: Buffer = fs.readFileSync('test/data/test-file.pdf');
    const fileHexString: string = file.toString('hex');
    const offset: number = 8;
    const offsetFileHexString: string = fileHexString.substr(offset, fileHexString.length);

    it('should return the correct file hex signature when an offset is given', (done) => {
      const fileHex = FileTypeValidator.fileHex(file, offset);
      expect(fileHex).to.equal(offsetFileHexString);
      done();
    });

    it('should return the correct file hex signature when no offset is given', (done) => {
      const fileHex = FileTypeValidator.fileHex(file, undefined);
      expect(fileHex).to.equal(fileHexString);
      done();
    });
  });

  describe('isValidHex()', () => {
    const value: Buffer = Buffer.from('255044462d312e330a25c4e5f2e5eba7f3');
    const offset: number = 0;

    it('should return true when the file hex is valid', (done) => {
      const signatures: string[] = ['32353530', '504b0304'];
      const isValidHex: boolean = FileTypeValidator.isValidHex(value, offset, signatures);
      expect(isValidHex).to.be.true;
      done();
    });

    it('should return true when no signatures are specified', (done) => {
      const signatures: string[] = [];
      const isValidHex: boolean = FileTypeValidator.isValidHex(value, offset, signatures);
      expect(isValidHex).to.be.true;
      done();
    });

    it('should return false when the file hex is invalid', (done) => {
      const signatures: string[] = ['504b0304', '932ab8c1'];
      const isValidHex: boolean = FileTypeValidator.isValidHex(value, offset, signatures);
      expect(isValidHex).to.be.false;
      done();
    });
  });

  describe('isValidMimeType()', () => {
    it('should return true when the mime type is valid', (done) => {
      const mimeType: string = 'application/pdf';
      const isValidMimeType: boolean = FileTypeValidator.isValidMimeType(config.validFileTypes, mimeType);
      expect(isValidMimeType).to.be.true;
      done();
    });

    it('should return false when the mime type is invalid', (done) => {
      const mimeType: string = 'text/plain';
      const isValidMimeType: boolean = FileTypeValidator.isValidMimeType(config.validFileTypes, mimeType);
      expect(isValidMimeType).to.be.false;
      done();
    });
  });

  describe('fileExtension()', () => {
    it('should return the extension from a filename', (done) => {
      const extension: string = FileTypeValidator.fileExtension('test-file.pdf');
      expect(extension).to.equal('pdf');
      done();
    });
  });

  describe('validate()', () => {
    it('should return the correct params for the validator', (done) => {
      const fileTypeValidator: FileTypeValidator = new FileTypeValidator();
      const validator = fileTypeValidator.validate(Joi, config);
      expect(validator).to.have.property('language').and.to.deep.equal({
        hex: `file type is invalid (hex), valid formats are: ${Object.keys(config.validFileTypes).join(', ')}`,
        mime: `file type is invalid (mime), valid formats are: ${Object.keys(config.validFileTypes).join(', ')}`
      });
      expect(validator).to.have.property('name').and.to.equal('fileType');
      expect(validator).to.have.property('rules');
      expect(validator.rules.length).to.equal(2);
      expect(validator.rules[0]).to.have.property('name').and.to.equal('hex');
      expect(validator.rules[1]).to.have.property('name').and.to.equal('mime');
      done();
    });

    describe('rules.validate()', () => {
      let file: Buffer = fs.readFileSync('test/data/test-file.pdf');
      const params: object = {};
      const state: IState = {
        key: '',
        parent: {...testFile, ...{mimetype: 'application/pdf'}},
        path: [],
        reference: ''
      };
      const options: object = {};

      describe('hex', () => {
        it('should return the value when the file mimetype is valid', (done) => {
          const fileTypeValidator: FileTypeValidator = new FileTypeValidator();
          const validator = fileTypeValidator.validate(Joi, config);
          const isValid = validator.rules[0].validate(params, file, state, options);
          expect(isValid).to.deep.equal(file);
          done();
        });

        it('should return the value when the file mimetype is invalid but the extension is valid', (done) => {
          state.parent.mimetype = 'application/octet-stream';

          const fileTypeValidator: FileTypeValidator = new FileTypeValidator();
          const validator = fileTypeValidator.validate(Joi, config);
          const isValid = validator.rules[0].validate(params, file, state, options);
          expect(isValid).to.deep.equal(file);
          done();
        });

        it('should return a joi error object when the file is invalid', (done) => {
          file = fs.readFileSync('test/data/invalid-file-with-valid-ext.pdf');
          const fileTypeValidator: FileTypeValidator = new FileTypeValidator();
          const validator = fileTypeValidator.validate(Joi, config);
          const isValid = validator.rules[0].validate(params, file, state, options);
          expect(isValid).to.deep.equal({
            context: {
              key: undefined,
              label: '',
              value: file
            },
            flags: {},
            isJoi: true,
            message: undefined,
            options: {},
            path: [],
            template: undefined,
            type: 'fileType.hex'
          });
          done();
        });
      });

      describe('mime', () => {
        it('should return the value when the file is valid', (done) => {
          const fileTypeValidator: FileTypeValidator = new FileTypeValidator();
          const validator = fileTypeValidator.validate(Joi, config);
          const isValid = validator.rules[1].validate(params, file, state, options);
          expect(isValid).to.deep.equal(file);
          done();
        });

        it('should return a joi error object when the file is invalid', (done) => {
          state.parent.mimetype = 'text/plain';
          const fileTypeValidator: FileTypeValidator = new FileTypeValidator();
          const validator = fileTypeValidator.validate(Joi, config);
          const isValid = validator.rules[1].validate(params, file, state, options);
          expect(isValid).to.deep.equal({
            context: {
              key: undefined,
              label: '',
              value: file
            },
            flags: {},
            isJoi: true,
            message: undefined,
            options: {},
            path: [],
            template: undefined,
            type: 'fileType.mime'
          });
          done();
        });
      });
    });
  });
});
