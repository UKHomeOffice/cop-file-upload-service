import IConfig from '../../interfaces/IConfig';
import IState from '../../interfaces/IState';
import IValidator from '../../interfaces/IValidator';
import IValidFileType from '../../interfaces/IValidFileType';

type ValidFileTypeEntry = [string, IValidFileType];
type Filter = (type: ValidFileTypeEntry) => boolean;

class FileTypeValidator implements IValidator {
  public static validFileProps(validFileTypes: IConfig['validFileTypes'], filter: Filter): IValidFileType {
    return Object
      .entries(validFileTypes)
      .filter((type) => filter(type))
      [0][1];
  }

  public static mimeFilter(mimetype: string): Filter {
    return (type: ValidFileTypeEntry): boolean => type[1].mimetype === mimetype;
  }

  public static extensionFilter(extension: string | undefined): Filter {
    return (type: ValidFileTypeEntry): boolean => type[0] === extension;
  }

  public static fileHex(value: Buffer, offset: number | undefined): string {
    const fileHex: string = value.toString('hex');
    return !offset ? fileHex : fileHex.substr(offset, fileHex.length);
  }

  public static isValidHex(value: Buffer, offset: number | undefined, signatures: string[]): boolean {
    const fileHex: string = FileTypeValidator.fileHex(value, offset);
    return signatures.some((signature: string): boolean => fileHex.startsWith(signature));
  }

  public static isValidMimeType(validFileTypes: IConfig['validFileTypes'], fileMimeType: string): boolean {
    return Object.entries(validFileTypes).some(([, {mimetype}]) => fileMimeType === mimetype);
  }

  public static fileExtension(fileName: string): string | undefined {
    return fileName.split('.').pop();
  }

  public validate(joi: any, {validFileTypes}: IConfig) {
    return {
      base: joi.binary(),
      language: {
        hex: `file type is invalid (hex), valid formats are: ${Object.keys(validFileTypes).join(', ')}`,
        mime: `file type is invalid (mime), valid formats are: ${Object.keys(validFileTypes).join(', ')}`
      },
      name: 'fileType',
      rules: [{
        name: 'hex',
        validate(params: object, value: Buffer, state: IState, options: object): any {
          const validator = FileTypeValidator;
          let signatures: string[];
          let offset: number | undefined;
          ({signatures, offset} = validator.validFileProps(
            validFileTypes, validator.mimeFilter(state.parent.mimetype)
          ));
          let isValidHex: boolean = validator.isValidHex(value, offset, signatures);

          if (!isValidHex) {
            const fileExtension = validator.fileExtension(state.parent.originalname);
            ({signatures, offset} = validator.validFileProps(
              validFileTypes, validator.extensionFilter(fileExtension)
            ));
            isValidHex = validator.isValidHex(value, offset, signatures);
          }

          return isValidHex ? value : joi.createError('fileType.hex', {value}, state, options);
        }
      }, {
        name: 'mime',
        validate(params: object, value: Buffer, state: IState, options: object): any {
          const isValidMimeType: boolean = FileTypeValidator.isValidMimeType(validFileTypes, state.parent.mimetype);
          return isValidMimeType ? value : joi.createError('fileType.mime', {value}, state, options);
        }
      }]
    };
  }
}

export default FileTypeValidator;
