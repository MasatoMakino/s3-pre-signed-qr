export class BucketList {
  /**
   * 現状のQRコードファイルを削除する
   * @param s3
   * @param bucketName
   */
  public static async deleteCurrentQR(s3: AWS.S3, bucketName: string) {
    const data = await s3.listObjectsV2({ Bucket: bucketName }).promise();

    const regexp = new RegExp("qr.*.png");
    const deleteList = data.Contents.filter((val) => {
      return regexp.test(val.Key);
    }).map((val) => {
      const obj = {};
      obj["Key"] = val.Key;
      return obj;
    });

    const deleted = await s3
      .deleteObjects({
        Bucket: bucketName,
        Delete: { Objects: deleteList as any },
      })
      .promise();
    console.log("deleted result:", deleted);
  }
}
