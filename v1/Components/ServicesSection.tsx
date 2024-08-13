// components/EmailForm.tsx
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaTimes } from "react-icons/fa";

const EmailForm: React.FC = () => {
  const [toEmail, setToEmail] = useState<string>("");
  const [fromEmail, setFromEmail] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    },
    onDragEnter: () => {},
    onDragOver: () => {},
    onDragLeave: () => {},
    multiple: false,
  });

  const handleSendEmail = () => {
    if (!toEmail || !fromEmail || !subject || !message) {
      alert("Por favor completa todos los campos.");
      return;
    }

    alert("El correo fue enviado correctamente.");
    setToEmail("");
    setFromEmail("");
    setSubject("");
    setMessage("");
    setFile(null);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100 relative">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-center">
          Enviar Correo Electrónico
        </h2>

        <input
          type="email"
          placeholder="Destinatario"
          className="border border-gray-300 rounded p-2 mb-4 w-full"
          value={toEmail}
          onChange={(e) => setToEmail(e.target.value)}
        />

        <input
          type="email"
          placeholder="Emisor"
          className="border border-gray-300 rounded p-2 mb-4 w-full"
          value={fromEmail}
          onChange={(e) => setFromEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="Asunto"
          className="border border-gray-300 rounded p-2 mb-4 w-full"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <textarea
          placeholder="Cuerpo del correo"
          className="border border-gray-300 rounded p-2 mb-4 w-full h-24 sm:h-32"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div
          {...getRootProps({
            className:
              "border border-gray-300 rounded p-4 mb-4 w-full text-center cursor-pointer",
          })}
        >
          <input
            {...(getInputProps() as React.InputHTMLAttributes<HTMLInputElement>)}
          />
          {file ? (
            <p>Documento Adjuntado: {file.name}</p>
          ) : (
            <p>Arrastra un archivo PDF aquí o haz clic para adjuntar uno</p>
          )}
        </div>

        <button
          onClick={handleSendEmail}
          className="bg-blue-500 text-white py-2 px-4 rounded w-full mb-4"
        >
          Enviar Correo
        </button>

        <button
          onClick={handleOpenModal}
          className="bg-green-500 text-white py-2 px-4 rounded w-full"
        >
          Mostrar Información
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-6">
            <h3 className="text-4xl font-bold text-white">
              Métricas (KPIs y gráficas)
            </h3>
            <button
              onClick={handleCloseModal}
              className="text-white hover:text-gray-300"
              aria-label="Cerrar"
            >
              <FaTimes className="h-8 w-8" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailForm;
