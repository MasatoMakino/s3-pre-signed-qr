export class PreSignURLGenerator {
  private s3: AWS.S3;
  private bucketName: string;

  constructor(s3: AWS.S3, bucketName: string) {
    this.s3 = s3;
    this.bucketName = bucketName;
  }

  public generateURL(key: string): Promise<string> {
    return this.s3.getSignedUrlPromise("getObject", {
      Bucket: this.bucketName,
      Key: key,
    });
  }
}
