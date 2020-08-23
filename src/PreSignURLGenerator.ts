export class PreSignURLGenerator {
  private s3: AWS.S3;
  private bucketName: string;
  private expires: number;

  constructor(s3: AWS.S3, bucketName: string, expires?: number) {
    this.s3 = s3;
    this.bucketName = bucketName;
    this.expires = expires;
  }

  public generateURL(key: string): Promise<string> {
    return this.s3.getSignedUrlPromise("getObject", {
      Bucket: this.bucketName,
      Key: key,
      Expires: this.expires,
    });
  }
}
