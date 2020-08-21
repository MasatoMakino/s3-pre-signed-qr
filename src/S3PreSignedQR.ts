import AWS from "aws-sdk";
import QRCode from "qrcode";

import { BucketList } from "./BucketList";
import { PreSignURLGenerator } from "./PreSignURLGenerator";
import { QREncoder } from "./QREncoder";
import { SESSender } from "./SESSender";

export class S3PreSignedQR {
  public static async send(option: {
    profile: string;
    bucketName: string;
    objectKey: string;
    from: string;
    to: string[];
  }) {
    const s3 = this.initS3(option.profile);

    const urlGenerator: PreSignURLGenerator = new PreSignURLGenerator(
      s3,
      option.bucketName
    );
    const preSignedURL = await urlGenerator.generateURL(option.objectKey);

    await BucketList.deleteCurrentQR(s3, option.bucketName);
    const buffer = await QRCode.toBuffer(preSignedURL);
    const qrKey = await QREncoder.putBuffer(s3, option.bucketName, buffer);
    const qrSignedURL = await urlGenerator.generateURL(qrKey);

    SESSender.send(option.from, option.to, qrSignedURL);
  }

  /**
   * S3用のcredentialを初期化する
   * @param profileName
   */
  public static initS3(profileName: string) {
    const credentials = new AWS.SharedIniFileCredentials({
      profile: profileName,
    });
    AWS.config.credentials = credentials;
    return new AWS.S3({ apiVersion: "2006-03-01" });
  }
}
