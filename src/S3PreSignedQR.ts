import AWS from "aws-sdk";
import QRCode from "qrcode";

import { BucketList } from "./BucketList";
import { PreSignURLGenerator } from "./PreSignURLGenerator";
import { QREncoder } from "./QREncoder";
import { SESSender } from "./SESSender";

export interface S3PreSignedQROption {
  profile: string;
  bucketName: string;
  objectKey: string;
  sender: SESSender;
  /**
   * QRおよびターゲットファイルの有効期限、単位秒。
   * 最大値は実行環境によって左右される。
   * @see https://aws.amazon.com/jp/premiumsupport/knowledge-center/presigned-url-s3-bucket-expiration/
   */
  Expires?: number;
}
export class S3PreSignedQR {
  public static async send(option: S3PreSignedQROption) {
    const s3 = this.initS3(option.profile);

    const urlGenerator: PreSignURLGenerator = new PreSignURLGenerator(
      s3,
      option.bucketName,
      option.Expires
    );
    const preSignedURL = await urlGenerator.generateURL(option.objectKey);

    await BucketList.deleteCurrentQR(s3, option.bucketName);
    const buffer = await QRCode.toBuffer(preSignedURL);
    const qrKey = await QREncoder.putBuffer(s3, option.bucketName, buffer);
    const qrSignedURL = await urlGenerator.generateURL(qrKey);

    option.sender.send(qrSignedURL);
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
