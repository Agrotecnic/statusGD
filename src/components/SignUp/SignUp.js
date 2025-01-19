import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';

const SignUp = ({ onToggleForm }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nome: '',
    regional: '',
    businessUnit: '',
    whatsapp: '' // Adicionando o campo whatsapp ao estado
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to ${value}`);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      // Reset regional if businessUnit changes
      regional: name === 'businessUnit' ? '' : prevData.regional
    }));
    console.log('Updated formData:', formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('Form Data on Submit:', formData);

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (!formData.regional) {
      setError('Por favor, selecione uma Regional');
      setLoading(false);
      return;
    }

    try {
      const auth = getAuth();
      const { user } = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      // Salvar dados adicionais no Realtime Database
      const db = getDatabase();
      await set(ref(db, `users/${user.uid}/vendedorInfo`), {
        nome: formData.nome,
        regional: formData.regional,
        businessUnit: formData.businessUnit,
        whatsapp: formData.whatsapp, // Salvando o número do WhatsApp
        dataAtualizacao: new Date().toLocaleString()
      });

    } catch (error) {
      setError(
        error.code === 'auth/email-already-in-use' ? 'Email já está em uso' :
        error.code === 'auth/weak-password' ? 'Senha muito fraca' :
        'Erro ao criar conta'
      );
    } finally {
      setLoading(false);
    }
  };

  const businessUnits = [
    'BU1',
    'BU2',
    'BU3',
    'BUTEST'
  ];

  const regionaisPorBU = {
    BU1: ['RS NORTE', 'RS SUL', 'PR SUL SC', 'PR NORTE SP EXP'],
    BU2: ['AC RO MT OESTE', 'MS', 'MT', 'MT SUL', 'GO'],
    BU3: ['MA PI TO PA', 'CERRADO MG', 'LESTE', 'NORDESTE'],
    BUTEST: ['REGIONAL TESTE']
  };

  console.log('Form Data:', formData);
  console.log('Regionais por BU:', regionaisPorBU);

  return (
    <div className="p-8 bg-white rounded-lg shadow-md w-96">
      <h2 className="text-2xl font-bold text-center mb-6">Criar Conta</h2>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
          <input
            type="text"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Unit</label>
          <select
            name="businessUnit"
            value={formData.businessUnit}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            required
          >
            <option value="" disabled>Selecione uma Business Unit</option>
            {businessUnits.map((bu) => (
              <option key={bu} value={bu}>
                {bu}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Regional</label>
          <select
            name="regional"
            value={formData.regional}
            onChange={(e) => {
              const { name, value } = e.target;
              console.log(`Changing ${name} to ${value}`);
              setFormData((prevData) => ({
                ...prevData,
                [name]: value
              }));
              console.log('Updated formData:', formData);
            }}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            required
            disabled={!formData.businessUnit}
          >
            <option value="" disabled>Selecione uma Regional</option>
            {formData.businessUnit && regionaisPorBU[formData.businessUnit].map((regional, index) => (
              <option key={index} value={regional}>
                {regional}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Criando conta...' : 'Criar Conta'}
        </button>

        <button
          type="button"
          onClick={onToggleForm}
          className="w-full p-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
        >
          Já tenho uma conta
        </button>
      </form>
    </div>
  );
};

export default SignUp;