import AWS from "aws-sdk";

export class SESSender {
  /**
   * メールを送信する
   * @param from
   * @param to
   * @param dataURL
   */
  static async send(from: string, to: string[], dataURL: string) {
    const ses = new AWS.SES();
    const data = await ses
      .sendEmail(this.getParam(from, to, dataURL))
      .promise();
    console.log("Email sent! Message ID: ", data.MessageId);
  }

  /**
   * 本文テンプレート取得関数。
   * 関数をoverrideすることで、本文をカスタマイズ出来る。
   *
   * @param dataURL
   */
  public static getHTML = (dataURL: string): string => {
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
   *
   * @param from
   * @param to
   * @param dataURL
   */
  static getParam(from: string, to: string[], dataURL: string) {
    const subject = "Amazon SES Test (AWS SDK for JavaScript in Node.js)";
    const charset = "UTF-8";

    // Specify the parameters to pass to the API.
    return {
      Source: from,
      Destination: {
        ToAddresses: to, //TODO メール配信のため、toアドレス列挙は禁止。配信回数分アドレスを変更する。
      },
      Message: {
        Subject: {
          Data: subject,
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
