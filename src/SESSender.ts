import AWS from "aws-sdk";

export class SESSender {
  private _to: string[];
  private _from: string;

  constructor(from: string, to: string[]) {
    this._to = to;
    this._from = from;
  }
  /**
   * メールを送信する
   * @param dataURL
   */
  public async send(dataURL: string) {
    const ses = new AWS.SES();
    const data = await ses
      .sendEmail(this.getParam(this._from, this._to, dataURL))
      .promise();
    console.log("Email sent! Message ID: ", data.MessageId);
  }

  /**
   * 本文テンプレート取得関数。
   * 関数をoverrideすることで、本文をカスタマイズ出来る。
   *
   * @param dataURL
   */
  public getHTML = (dataURL: string): string => {
    return `<html>
<head></head>
<body>
  <h1>Amazon SES Test (Node.js 内の SDK for JavaScript)</h1>
  
  <img src='${dataURL}' alt="QR Image">
  
  <p>This email was sent with
    <a href='https://aws.amazon.com/ses/'>Amazon SES</a> using the
    <a href='https://aws.amazon.com/sdk-for-node-js/'>AWS SDK for JavaScript in Node.js</a>.
  </p>
</body>
</html>`;
  };

  /**
   * タイトルテンプレート取得関数
   */
  public getSubject = (): string => {
    return "Amazon SES Test (AWS SDK for JavaScript in Node.js)";
  };

  /**
   * メール用パラメーターを生成する
   * @param from
   * @param to
   * @param dataURL
   */
  private getParam(from: string, to: string[], dataURL: string) {
    const charset = "UTF-8";
    return {
      Source: from,
      Destination: {
        ToAddresses: to, //TODO メール配信のため、toアドレス列挙は禁止。配信回数分アドレスを変更する。
      },
      Message: {
        Subject: {
          Data: this.getSubject(),
          Charset: charset,
        },
        Body: {
          Html: {
            Data: this.getHTML(dataURL),
            Charset: charset,
          },
        },
      },
    };
  }
}
