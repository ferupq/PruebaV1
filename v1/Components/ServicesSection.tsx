import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaTimes } from "react-icons/fa";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import app from "../app/firebase"; // Asegúrate de que la ruta sea correcta

const EmailForm: React.FC = () => {
  const [toEmail, setToEmail] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [base64, setBase64] = useState<string | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
      getBase64(acceptedFiles[0]);
    },
    multiple: false,
  });

  const getBase64 = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.result) {
        setBase64(reader.result as string);
      }
    };
    reader.onerror = (error) => {
      console.log("Error: ", error);
    };
  };

  const sendMailToFirestore = async (mailData: {
    to: string[];
    message: {
      subject: string;
      text: string;
      html: string;
    };
    fileName?: string;
    base64Data?: string;
  }) => {
    try {
      const db = getFirestore(app);

      // Añadir el documento a la colección 'mail'
      const docRef = await addDoc(collection(db, "mail"), mailData);

      // Call the cloud function to send email and track events
      const functions = getFunctions(app);
      const sendEmail = httpsCallable(functions, "sendEmail");
      await sendEmail({ mailId: docRef.id });

      console.log(
        "Correo enviado a Firestore con éxito y seguimiento iniciado!"
      );
    } catch (error) {
      console.error("Error al enviar correo a Firestore: ", error);
    }
  };

  const handleSendEmail = () => {
    if (!toEmail || !subject || !message) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const mailData = {
      to: [toEmail],
      message: {
        subject: subject,
        text: message,
        html: `<body>${message}<img src="https://your-cloud-function-url/track/${toEmail}" alt="tracking pixel" /></body>`,
      },
      ...(file ? { fileName: file.name } : {}), // Solo añade fileName si file está definido
      ...(base64 ? { base64Data: base64 } : {}), // Solo añade base64Data si base64 está definido
    };

    sendMailToFirestore(mailData);
    alert("El correo fue enviado correctamente.");
    setToEmail("");
    setSubject("");
    setMessage("");
    setFile(null);
    setBase64(null);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section id="contact">
      <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100 relative">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg bg-white p-6 sm:p-8 rounded-lg shadow-md">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-center">
            Enviar Correo Electrónico
          </h2>

          <input
            type="email"
            placeholder="Destinatario"
            className="border border-gray-300 rounded p-2 mb-4 w-full text-black"
            value={toEmail}
            onChange={(e) => setToEmail(e.target.value)}
          />

          <input
            type="text"
            placeholder="Asunto"
            className="border border-gray-300 rounded p-2 mb-4 w-full text-black"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <textarea
            placeholder="Cuerpo del correo"
            className="border border-gray-300 rounded p-2 mb-4 w-full h-24 sm:h-32 text-black"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <div
            {...getRootProps({
              className:
                "border border-gray-300 rounded p-4 mb-4 w-full text-center cursor-pointer text-black",
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
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg relative">
              <div className="absolute top-0 right-0 p-4">
                <button
                  onClick={handleCloseModal}
                  className="text-black hover:text-gray-700"
                  aria-label="Cerrar"
                >
                  <FaTimes className="h-8 w-8" />
                </button>
              </div>
              <h3 className="text-4xl font-bold text-black text-center">
                Métricas (KPIs y gráficas)
              </h3>
              {/* Aquí puedes agregar el contenido de la modal */}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default EmailForm;
