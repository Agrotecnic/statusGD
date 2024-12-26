
import { FormBURegional } from './components/FormBURegional';
import './styles/form.css';

function App() {
  const handleFormSubmit = (data: { bu: string; regional: string }) => {
    console.log('Dados selecionados:', data);
    // Aqui você pode implementar a lógica necessária com os dados
  };

  return (
    <div className="container">
      <h1>Seleção de BU e Regional</h1>
      <FormBURegional onSubmit={handleFormSubmit} />
    </div>
  );
}

export default App;