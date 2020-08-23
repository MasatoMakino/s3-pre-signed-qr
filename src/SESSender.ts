import AWS from "aws-sdk";

export interface SESSenderOption {
  from: string;
  to: string[];
  /**
   * 返信先アドレス 未指定の場合はfromアドレスが使用される
   * @see https://docs.aws.amazon.com/ja_jp/sdk-for-javascript/v2/developer-guide/ses-examples-sending-email.html#ses-examples-sendmail
   */
  ReplyToAddresses?: string[];
}

export class SESSender {
  private _to: string[];
  private _from: string;
  private _replayTo: string[];

  constructor(option: SESSenderOption) {
    this._to = option.to;
    this._from = option.from;
    this._replayTo = option.ReplyToAddresses;
  }

  /**
   * メールを送信する
   * @param dataURL
   */
  public async send(dataURL: string) {
    const ses = new AWS.SES();
    const promises = this._to.map((to) => {
      return ses
        .sendEmail(this.getParam(this._from, to, dataURL, this._replayTo))
        .promise();
    });
    return Promise.all(promises);
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
   * @param replayTo
   */
  private getParam(
    from: string,
    to: string,
    dataURL: string,
    replayTo?: string[]
  ): AWS.SES.Types.SendEmailRequest {
    const charset = "UTF-8";
    const param: AWS.SES.Types.SendEmailRequest = {
      Source: from,
      Destination: {
        ToAddresses: [to],
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

    param.ReplyToAddresses = replayTo ?? param.ReplyToAddresses;

    return param;
  }
}
