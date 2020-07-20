# File upload service

## Introduction

A service built with [NodeJS](https://nodejs.org) and [TypeScript](https://www.typescriptlang.org) to upload and download files to/from a storage service.

The service performs the following actions on the uploaded files:

- validation
- virus scanning
- file conversion - if a virus is not found and the file is an image or a pdf then a clean version is created by converting the file into a different format twice
- extracting text with ocr - valid files for ocr are: for .png, .jpg, .jpeg, .jpe, .tiff, .tif, .bmp, .pnm and .jfif
- saving into storage - 3 file versions (`orig`, `clean` and `ocr`) are saved for most images and pdfs, 2 file versions (`orig` and `clean`) are saved for all other file types.

Currently S3 is supported for storage

The following file types can be uploaded:

- avi
- doc
- docx
- dot
- eps
- flv
- gif
- gpg
- jpg
- m4v
- mov
- mp3
- odp
- odt
- oga
- ogg
- ogv
- pdf
- pgp
- png
- pps
- ppt
- pptx
- rtf
- tif
- xls
- xlsx

## Using the API

### Uploading a file

```
POST /files/{businessKey}
```

In Postman, select `Body`, then `form-data`. Add a key called `file`. In the drop down change the key to `file` then select the file in the value.

#### Parameters

file: The file to be uploaded

businessKey: The business key of the process of the uploaded file

#### Responses

200: application/json

```
{
  url: Relative path of the file
  name: Original file name
  size: Size of the file
}
```

404: application/json

```
{
  error: 'Route not found'
}
```

500: application/json

```
{
  error: 'Failed to upload file'
}
```

### Downloading a file

```
GET /files/{businessKey}/{fileVersion}/{filename}
```

#### Parameters

businessKey: The business key of the process of the file to be downloaded

fileVersion: The version of the file to be downloaded. Will be one of: `orig`, `clean` or `ocr`

filename: The name of the file to be downloaded

#### Responses

200: image/jpeg, image/png, application/pdf etc.

404: application/json

```
{
  error: 'Route not found'
}
```

500: application/json

```
{
  error: 'Failed to download file'
}
```

### Deleting a file

```
DELETE /files/{businessKey}/{fileVersion}/{filename}
```

#### Parameters

businessKey: The business key of the process of the file to be deleted

fileVersion: The version of the file to be downloaded. Will be one of: `orig`, `clean` or `ocr`

filename: The name of the file to be deleted

#### Responses

200: application/json

```
{
  message: 'Files deleted successfully'
}
```

404: application/json

```
{
  error: 'Route not found'
}
```

500: application/json

```
{
  error: 'Failed to delete files'
}
```

### Downloading a file list

```
GET /files/{businessKey}
```

#### Parameters

businessKey: The business key of the process of the file list to be downloaded

#### Responses

200:

```
[
    {
        "submittedFilename": "test-file.pdf",
        "submittedEmail": "officer@homeoffice.gov.uk",
        "submittedDateTime": "2020-01-27 12:21:23",
        "url": "https://localhost/files/BF-20200228-123/clean/2140b35d-ef07-4703-a75e-47b9614850ee"
    }
]
```

404: application/json

```
{
  error: 'Route not found'
}
```

500: application/json

```
{
  error: 'Failed to download file list'
}
```

## Installing the app

- Clone the repo:

  ```
  git clone git@github.com:UKHomeOffice/file-upload-service.git
  ```

- See https://gitlab.digital.homeoffice.gov.uk/cop/manifest/blob/master/README.md for running services locally.

## Code quality

We're using [TSLint](https://palantir.github.io/tslint/) to ensure a consistent code style.

The linter can be run with:

```
npm run linter
````

## Testing

All tests can be run with:

```
npm test
```

Individual tests can be run with:

- Unit tests

  ```
  npm run test:unit
  ```

- Route tests

  ```
  npm run test:route
  ```

- Route auth tests

  ```
  npm run test:route-auth
  ```

## Test coverage

We're using [Istanbul](https://istanbul.js.org) to check the test coverage.

Test coverage reports can be generated with:

```
npm run coverage
```
