const express = require("express");
const AWS = require("aws-sdk");
const multer = require("multer");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const port = 3000;

// Configure AWS Pinpoint
AWS.config.update({ region: "us-east-1" });
const pinpoint = new AWS.Pinpoint({ region: "us-east-1" });

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Multer setup for file upload
const upload = multer({ dest: "uploads/" });

// Route to handle email sending
app.post("/send-email", upload.single("attachment"), async (req, res) => {
  const { recipient, sender, subject, body } = req.body;
  const attachment = req.file ? fs.readFileSync(req.file.path) : null;

  const params = {
    ApplicationId: "YOUR_PINPOINT_APPLICATION_ID",
    MessageRequest: {
      Addresses: {
        [recipient]: {
          ChannelType: "EMAIL",
        },
      },
      MessageConfiguration: {
        EmailMessage: {
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: body,
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: subject,
          },
        },
      },
    },
  };

  try {
    const result = await pinpoint.sendMessages(params).promise();
    res.status(200).json({ message: "Email sent successfully", result });
  } catch (error) {
    res.status(500).json({ error: "Failed to send email", details: error });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
