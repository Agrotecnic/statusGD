import React from 'react';
// ...existing code...

const EditProdutoModal: React.FC<EditProdutoModalProps> = ({ produto, isOpen, onClose, onSave }) => {
  // Verificar se produto existe antes de acessar suas propriedades
  const [formData, setFormData] = React.useState({
    index: produto?.index || '',
    nome: produto?.nome || '',
    descricao: produto?.descricao || '',
    valor: produto?.valor || '',
    quantidade: produto?.quantidade || ''
  });

  // ...existing code...
};

export default EditProdutoModal;
