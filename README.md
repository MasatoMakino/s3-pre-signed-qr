# s3-pre-signed-qr

## Getting started

### Configure Your Credentials

Configure your credentials with [AWS SDK documents](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/getting-started-nodejs.html#getting-started-nodejs-credentials).

### install

```bash
npm install https://github.com/MasatoMakino/s3-pre-signed-qr.git --save-dev
```

## Sample

```js
const s3qr = require("s3-pre-signed-qr");
const sender = new s3qr.SESSender("from@example.com", [
  "to01@example.com",
  "to02@example.com",
]);
s3qr.S3PreSignedQR.send({
  profile: "your-profile-name-in-credentials",
  bucketName: "your-s3-bucket-name",
  objectKey: "s3-object-key",
  sender: sender,
});
```

## License

[MIT licensed](LICENSE).
