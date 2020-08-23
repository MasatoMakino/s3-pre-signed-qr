# s3-pre-signed-qr

## Getting started

### Configure Your Credentials

Configure your credentials with [AWS SDK documents](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/getting-started-nodejs.html#getting-started-nodejs-credentials).

#### Permissions Required

IAM users using this module must have the following permissions.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["ses:SendEmail"],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:ListBucket",
        "s3:DeleteObject"
      ],
      "Resource": ["arn:aws:s3:::<Bucket-Name>/*", "arn:aws:s3:::<Bucket-Name>"]
    }
  ]
}
```

#### Testing to get Credentials

Set a script file `CredentialTest.js` in the project root.

```js
const AWS = require("aws-sdk");
const credentials = new AWS.SharedIniFileCredentials({
  profile: profileName,
});
AWS.config.credentials = credentials;
console.log("Access key:", AWS.config.credentials.accessKeyId);
```

and Run test script.

```zsh
env AWS_SDK_LOAD_CONFIG=true node CredentialTest.js
```

If the console outputs an access key, you're ready to go.

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
