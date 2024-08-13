import React, { useState } from "react";
import AWS from "aws-sdk";

// Configura las credenciales de AWS y la región
AWS.config.update({
  accessKeyId: "AKIAQ3EGWHGQ3BWE6OOX",
  secretAccessKey: "BAUiferYUCyzbfoQoFJVmZUuAFH9vxUMqJwCYQabAEZt",
  region: "us-east-2",
});

// Crea una instancia del servicio SES
const ses = new AWS.SES({ apiVersion: "2010-12-01" });

const sendEmail = async (toAddress: string, subject: string, body: string) => {
  const params = {
    Destination: {
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: body,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: "ferchom41944@gmail.com",
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log("Email sent:", result);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const SendEmail: React.FC = () => {
  const [toAddress, setToAddress] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handleSendEmail = () => {
    sendEmail(toAddress, subject, body);
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Recipient Email"
        value={toAddress}
        onChange={(e) => setToAddress(e.target.value)}
      />
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <textarea
        placeholder="Email Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <button onClick={handleSendEmail}>Send Email</button>
    </div>
  );
};

export default SendEmail;
