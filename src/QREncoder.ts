export class QREncoder {
  /**
   * ランダムな文字列を、タイムスタンプから生成する。
   *
   * @param myStrong
   * @private
   */
  private static getUniqueStr(myStrong?: number): string {
    let strong = 1000;
    if (myStrong) strong = myStrong;
    return (
      new Date().getTime().toString(16) +
      Math.floor(strong * Math.random()).toString(16)
    );
  }

  /**
   * 生成されたBuffer形式のQRコードを、S3バケットに追加する。
   *
   * @param s3
   * @param bucketName
   * @param buffer
   */
  public static async putBuffer(
    s3: AWS.S3,
    bucketName: string,
    buffer: Buffer
  ) {
    const unique = `qr_${this.getUniqueStr()}.png`;

    const putParams = {
      Bucket: bucketName,
      Key: unique,
      Body: buffer,
    };
    const result = await s3.putObject(putParams).promise();
    console.log("qr file name : ", unique);

    return unique;
  }
}
