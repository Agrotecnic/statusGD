// src/components/DashboardGeral/admin/AdminDataManager.js
import React, { useState, useEffect } from 'react';
import StaticDataService from '../../../services/StaticDataService';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Alert } from '../components/ui/alert';

const AdminDataManager = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentData, setCurrentData] = useState({
    produtos: [],
    marcas: [],
    categorias: []
  });

  // Carregar dados atuais
  useEffect(() => {
    loadCurrentData();
  }, []);

  const loadCurrentData = async () => {
    try {
      setLoading(true);
      const [produtos, marcas, categorias] = await Promise.all([
        StaticDataService.getProdutos(),
        StaticDataService.getMarcas(),
        StaticDataService.getCategorias()
      ]);

      setCurrentData({
        produtos: produtos || [],
        marcas: marcas || [],
        categorias: categorias || []
      });
    } catch (error) {
      setError('Erro ao carregar dados: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInitializeData = async () => {
    try {
      setLoading(true);
      setError(null);
      await StaticDataService.initializeDefaultData();
      await loadCurrentData();
      setSuccess('Dados inicializados com sucesso!');
    } catch (error) {
      setError('Erro ao inicializar dados: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(currentData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'static-data-export.json';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImportData = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          
          // Validar dados
          if (!importedData.produtos || !importedData.marcas || !importedData.categorias) {
            throw new Error('Formato de arquivo inválido');
          }

          // Salvar dados
          await Promise.all([
            StaticDataService.saveProdutos(importedData.produtos),
            StaticDataService.saveMarcas(importedData.marcas),
            StaticDataService.saveCategorias(importedData.categorias)
          ]);

          await loadCurrentData();
          setSuccess('Dados importados com sucesso!');
        } catch (error) {
          setError('Erro ao processar arquivo: ' + error.message);
        } finally {
          setLoading(false);
        }
      };

      reader.readAsText(file);
    } catch (error) {
      setError('Erro ao ler arquivo: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciador de Dados Estáticos</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              {success}
            </Alert>
          )}

          <div className="space-y-4">
            {/* Ações */}
            <div className="flex gap-4">
              <button
                onClick={handleInitializeData}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Processando...' : 'Inicializar Dados Padrão'}
              </button>

              <button
                onClick={handleExportData}
                disabled={loading}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              >
                Exportar Dados
              </button>

              <label className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 cursor-pointer">
                Importar Dados
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  disabled={loading}
                  className="hidden"
                />
              </label>
            </div>

            {/* Visualização dos dados atuais */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Dados Atuais:</h3>
              <div className="grid grid-cols-3 gap-6">
                {/* Produtos */}
                <div>
                  <h4 className="font-medium mb-2">Produtos ({currentData.produtos.length})</h4>
                  <div className="max-h-96 overflow-y-auto border rounded p-2">
                    {currentData.produtos.map((produto) => (
                      <div key={produto.id} className="mb-2 p-2 bg-gray-50 rounded">
                        <div className="font-medium">{produto.nome}</div>
                        <div className="text-sm text-gray-600">
                          {produto.marca} - {produto.categoria}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Marcas */}
                <div>
                  <h4 className="font-medium mb-2">Marcas ({currentData.marcas.length})</h4>
                  <div className="max-h-96 overflow-y-auto border rounded p-2">
                    {currentData.marcas.map((marca) => (
                      <div key={marca} className="mb-2 p-2 bg-gray-50 rounded">
                        {marca}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Categorias */}
                <div>
                  <h4 className="font-medium mb-2">Categorias ({currentData.categorias.length})</h4>
                  <div className="max-h-96 overflow-y-auto border rounded p-2">
                    {currentData.categorias.map((categoria) => (
                      <div key={categoria} className="mb-2 p-2 bg-gray-50 rounded">
                        {categoria}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDataManager;