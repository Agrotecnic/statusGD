import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

const FormModal = ({ type, data, onSave, onClose, loading: externalLoading, errors: externalErrors }) => {
  const [formData, setFormData] = useState(data || {});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setFormData(data || {});
  }, [data]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    let processedValue = value;
    if (type === 'number') {
      processedValue = value === '' ? 0 : Number(value);
      if (isNaN(processedValue)) processedValue = 0;
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError(null);

      if (type === 'vendedor') {
        if (!formData.nome?.trim()) {
          throw new Error('Nome é obrigatório');
        }
        if (!formData.regional?.trim()) {
          throw new Error('Regional é obrigatória');  
        }
        if (!formData.businessUnit?.trim()) {
          throw new Error('Business Unit é obrigatória');
        }
      }

      if (type === 'areas') {
        const numericFields = ['emAcompanhamento', 'aImplantar', 'finalizados', 'mediaHectaresArea', 'areaPotencialTotal'];
        numericFields.forEach(field => {
          if (formData[field] === undefined || formData[field] < 0) {
            throw new Error(`${field} deve ser um número positivo`);
          }
        });
      }

      if (type === 'produto') {
        if (!formData.nome?.trim()) {
          throw new Error('Nome do produto é obrigatório');
        }
        if (formData.valorVendido < 0 || formData.valorBonificado < 0) {
          throw new Error('Valores não podem ser negativos');
        }
      }

      await onSave(formData);
    } catch (err) {
      console.error('Erro ao salvar:', err);
      setError(err.message || 'Erro ao salvar alterações');
    } finally {
      setIsLoading(false);
    }
  };

 const renderFields = () => {
   switch (type) {
     case 'vendedor':
       return (
         <>
           <Form.Group controlId="formNome">
             <Form.Label>Nome</Form.Label>
             <Form.Control
               type="text"
               name="nome"
               value={formData.nome || ''}
               onChange={handleChange}
               isInvalid={!!externalErrors?.nome}
             />
             <Form.Control.Feedback type="invalid">
               {externalErrors?.nome}
             </Form.Control.Feedback>
           </Form.Group>

           <Form.Group controlId="formRegional">
             <Form.Label>Regional</Form.Label>
             <Form.Control
               type="text"
               name="regional"
               value={formData.regional || ''}
               onChange={handleChange}
               isInvalid={!!externalErrors?.regional}
             />
             <Form.Control.Feedback type="invalid">
               {externalErrors?.regional}
             </Form.Control.Feedback>
           </Form.Group>

           <Form.Group controlId="formBusinessUnit">
             <Form.Label>Business Unit</Form.Label>
             <Form.Control
               type="text"
               name="businessUnit"
               value={formData.businessUnit || ''}
               onChange={handleChange}
               isInvalid={!!externalErrors?.businessUnit}
             />
             <Form.Control.Feedback type="invalid">
               {externalErrors?.businessUnit}
             </Form.Control.Feedback>
           </Form.Group>
         </>
       );

     case 'areas':
       return (
         <>
           <Form.Group controlId="formEmAcompanhamento">
             <Form.Label>Em Acompanhamento</Form.Label>
             <Form.Control
               type="number"
               name="emAcompanhamento"
               value={formData.emAcompanhamento || 0}
               onChange={handleChange}
               isInvalid={!!externalErrors?.emAcompanhamento}
               min="0"
             />
             <Form.Control.Feedback type="invalid">
               {externalErrors?.emAcompanhamento}
             </Form.Control.Feedback>
           </Form.Group>

           <Form.Group controlId="formAImplantar">
             <Form.Label>A Implantar</Form.Label>
             <Form.Control
               type="number"
               name="aImplantar"
               value={formData.aImplantar || 0}
               onChange={handleChange}
               isInvalid={!!externalErrors?.aImplantar}
               min="0"
             />
             <Form.Control.Feedback type="invalid">
               {externalErrors?.aImplantar}
             </Form.Control.Feedback>
           </Form.Group>

           <Form.Group controlId="formFinalizados">
             <Form.Label>Finalizados</Form.Label>
             <Form.Control
               type="number"
               name="finalizados"
               value={formData.finalizados || 0}
               onChange={handleChange}
               isInvalid={!!externalErrors?.finalizados}
               min="0"
             />
             <Form.Control.Feedback type="invalid">
               {externalErrors?.finalizados}
             </Form.Control.Feedback>
           </Form.Group>

           <Form.Group controlId="formMediaHectaresArea">
             <Form.Label>Média de Hectares por Área</Form.Label>
             <Form.Control
               type="number"
               name="mediaHectaresArea"
               value={formData.mediaHectaresArea || 0}
               onChange={handleChange}
               isInvalid={!!externalErrors?.mediaHectaresArea}
               min="0"
               step="0.01"
             />
             <Form.Control.Feedback type="invalid">
               {externalErrors?.mediaHectaresArea}
             </Form.Control.Feedback>
           </Form.Group>

           <Form.Group controlId="formAreaPotencialTotal">
             <Form.Label>Área Potencial Total</Form.Label>
             <Form.Control
               type="number"
               name="areaPotencialTotal"
               value={formData.areaPotencialTotal || 0}
               onChange={handleChange}
               isInvalid={!!externalErrors?.areaPotencialTotal}
               min="0"
               step="0.01"
             />
             <Form.Control.Feedback type="invalid">
               {externalErrors?.areaPotencialTotal}
             </Form.Control.Feedback>
           </Form.Group>
         </>
       );

     case 'produto':
       return (
         <>
           <Form.Group controlId="formNome">
             <Form.Label>Nome do Produto</Form.Label>
             <Form.Control
               type="text"
               name="nome"
               value={formData.nome || ''}
               onChange={handleChange}
               isInvalid={!!externalErrors?.nome}
             />
             <Form.Control.Feedback type="invalid">
               {externalErrors?.nome}
             </Form.Control.Feedback>
           </Form.Group>

           <Form.Group controlId="formCliente">
             <Form.Label>Cliente</Form.Label>
             <Form.Control
               type="text"
               name="cliente"
               value={formData.cliente || ''}
               onChange={handleChange}
               isInvalid={!!externalErrors?.cliente}
             />
             <Form.Control.Feedback type="invalid">
               {externalErrors?.cliente}
             </Form.Control.Feedback>
           </Form.Group>

           <Form.Group controlId="formValorVendido">
             <Form.Label>Valor Vendido</Form.Label>
             <Form.Control
               type="number"
               name="valorVendido"
               value={formData.valorVendido || 0}
               onChange={handleChange}
               isInvalid={!!externalErrors?.valorVendido}
               min="0"
               step="0.01"
             />
             <Form.Control.Feedback type="invalid">
               {externalErrors?.valorVendido}
             </Form.Control.Feedback>
           </Form.Group>

           <Form.Group controlId="formValorBonificado">
             <Form.Label>Valor Bonificado</Form.Label>
             <Form.Control
               type="number"
               name="valorBonificado"
               value={formData.valorBonificado || 0}
               onChange={handleChange}
               isInvalid={!!externalErrors?.valorBonificado}
               min="0"
               step="0.01"
             />
             <Form.Control.Feedback type="invalid">
               {externalErrors?.valorBonificado}
             </Form.Control.Feedback>
           </Form.Group>

           <Form.Group controlId="formAreas">
             <Form.Label>Áreas</Form.Label>
             <Form.Control
               type="number"
               name="areas"
               value={formData.areas || 0}
               onChange={handleChange}
               isInvalid={!!externalErrors?.areas}
               min="0"
             />
             <Form.Control.Feedback type="invalid">
               {externalErrors?.areas}
             </Form.Control.Feedback>
           </Form.Group>
         </>
       );

     default:
       return null;
   }
 };

 return (
  <Modal show onHide={onClose} size="lg">
    <Modal.Header closeButton>
      <Modal.Title>
        {type === 'edit' ? 'Editar' : type === 'add' ? 'Adicionar' : 'Editar'} {type}
      </Modal.Title>
    </Modal.Header>
    
    <Modal.Body>
      <Form onSubmit={handleSubmit}>
        {renderFields()}
        
        {(error || externalErrors?.submit) && (
          <div className="alert alert-danger">
            {error || externalErrors.submit}
          </div>
        )}
        
        <div className="d-flex justify-content-end mt-3">
          <Button 
            variant="secondary" 
            onClick={onClose} 
            className="me-2"
            disabled={isLoading || externalLoading}
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={isLoading || externalLoading}
          >
            {isLoading || externalLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </Form>
    </Modal.Body>
  </Modal>
);
};

FormModal.propTypes = {
type: PropTypes.oneOf(['edit', 'add', 'vendedor', 'areas', 'produto']).isRequired,
data: PropTypes.object,
onSave: PropTypes.func.isRequired,
onClose: PropTypes.func.isRequired,
loading: PropTypes.bool,
errors: PropTypes.object
};

FormModal.defaultProps = {
data: {},
loading: false,
errors: {}
};

export default FormModal;