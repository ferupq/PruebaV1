import React, { useState, FormEvent } from "react";

const EmailForm: React.FC = () => {
  const [toAddress, setToAddress] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch("URL_DE_TU_LAMBDA_FUNCTION", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ toAddress, subject, message }),
      });

      const data = await response.json();
      setStatus(data.message || data.error);
    } catch (error) {
      setStatus("Error sending email");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="toAddress">To:</label>
          <input
            id="toAddress"
            type="email"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="subject">Subject:</label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send Email</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default EmailForm;
