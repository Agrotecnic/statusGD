import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../config/firebase";

const PasswordResetForm = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(false);
    setMessage(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("E-mail de redefinição enviado! Verifique sua caixa de entrada.");
      setIsSuccess(true);
    } catch (error) {
      setMessage("Erro ao enviar o e-mail. Verifique o endereço fornecido.");
      setIsSuccess(false);
      console.error(error);
    } finally {
      setIsLoading(false);

      // Fechar o modal após 3 segundos, sem mexer no modal JS
      setTimeout(() => {
        onClose(); // Fechar o modal após 3 segundos
      }, 3000); // 3 segundos
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-center">Redefinir Senha</h2>
      {message && (
        <div
          className={`p-2 text-sm ${isSuccess ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"} border rounded`}
        >
          {message}
        </div>
      )}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Digite seu e-mail"
        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
        required
      />
      <button
        type="submit"
        className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? "Enviando..." : "Enviar"}
      </button>
      <button
        type="button"
        onClick={onClose}
        className="w-full p-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
      >
        Cancelar
      </button>
    </form>
  );
};

export default PasswordResetForm;
