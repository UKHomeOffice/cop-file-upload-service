interface IValidFileType {
  mimetype: string;
  signatures: string[];
  offset?: number;
}

export default IValidFileType;
