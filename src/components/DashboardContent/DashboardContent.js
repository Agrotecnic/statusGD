import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { normalizeBU, normalizeRegional } from '../../utils/normalizer';

// Componentes
import AreasCard from '../AreasCard/AreasCard';
import MetricasCard from '../MetricasCard/MetricasCard';
import ProdutosTable from '../ProdutosTable/ProdutosTable';
import ImageUploader from '../ImageUploader/ImageUploader';

const DashboardContent = ({
  user,
  vendedorInfo,
  areas,
  produtos,
  images,
  loading,
  isExporting,
  handleLogout,
  handleEditStart,
  handleImageUpload,
  exportToExcel,
  exportToPDF,
  addProduto,
  formatMoney,
  formatPercent,
  onDelete, // Recebendo a função onDelete,
}) => {
  const navigate = useNavigate();

  // Extraindo userId corretamente
  const userId = user.uid || user.id || user.proactiveRefresh?.user?.uid;

  // console.log('userId:', userId);
  // console.log(JSON.stringify(user));

  const normalizedVendedorInfo = {
    ...vendedorInfo,
    businessUnit: normalizeBU(vendedorInfo.businessUnit) || vendedorInfo.businessUnit,
    regional: normalizeRegional(vendedorInfo.regional) || vendedorInfo.regional
  };

  const metricsData = useMemo(() => {
    const acompanhamento = Number(areas?.emAcompanhamento || 0);
    const finalizados = Number(areas?.finalizados || 0);
    const implantar = Number(areas?.aImplantar || 0);
    const mediaHectares = Number(areas?.mediaHectaresArea || 0);

    return {
      areasAcompanhamento: acompanhamento,
      areasFinalizadas: finalizados,
      areasImplantar: implantar,
      mediaHectaresArea: mediaHectares,
      areaPotencialTotal: Number(areas?.areaPotencialTotal || 0),
      totalVendido: produtos.reduce((acc, p) => acc + Number(p.valorVendido || 0), 0),
      totalBonificado: produtos.reduce((acc, p) => acc + Number(p.valorBonificado || 0), 0),
      totalGeral: produtos.reduce((acc, p) => acc + Number(p.valorVendido || 0) + Number(p.valorBonificado || 0), 0)
    };
  }, [areas, produtos]);

  return (
    <div id="dashboard" className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
      <header className="p-6 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{normalizedVendedorInfo.nome || 'Dashboard'}</h1>
            <p className="text-gray-600">
              {normalizedVendedorInfo.regional} - {normalizedVendedorInfo.businessUnit}
            </p>
            <p className="text-sm text-gray-500">
              Última atualização: {normalizedVendedorInfo.dataAtualizacao}
            </p>
          </div>
          <div className="space-x-4 hide-on-print">
            <button
              onClick={exportToExcel}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              disabled={loading || isExporting}
            >
              Exportar Excel
            </button>
            <button
              onClick={exportToPDF}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={loading || isExporting}
            >
              Exportar PDF
            </button>
            <button
              onClick={() => navigate('/dashboard-geral')}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Dashboard Geral
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              disabled={loading}
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Informações do Vendedor</h2>
            <button
              onClick={() => handleEditStart('vendedor')}
              className="text-blue-500 hover:text-blue-600 hide-on-print disabled:opacity-50"
              disabled={loading}
            >
              Editar
            </button>
          </div>
          <div className="space-y-2">
            <p><strong>Nome:</strong> {normalizedVendedorInfo.nome || '-'}</p>
            <p><strong>Regional:</strong> {normalizedVendedorInfo.regional || '-'}</p>
            <p><strong>Business Unit:</strong> {normalizedVendedorInfo.businessUnit || '-'}</p>
            <p><strong>WhatsApp:</strong> {normalizedVendedorInfo.whatsapp || '-'}</p>
          </div>
        </div>

        <AreasCard 
          data={areas}
          formatPercent={formatPercent}
          onEdit={() => handleEditStart('areas')}
          disabled={loading}
        />

        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Imagens</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ImageUploader
              initialImage={images.area1}
              onUpload={handleImageUpload('area1')}
              label="Área 1"
              disabled={loading}
            />
            <ImageUploader
              initialImage={images.area2}
              onUpload={handleImageUpload('area2')}
              label="Área 2"
              disabled={loading}
            />
            <ImageUploader
              initialImage={images.area3}
              onUpload={handleImageUpload('area3')}
              label="Área 3"
              disabled={loading}
            />
            <ImageUploader
              initialImage={images.area4}
              onUpload={handleImageUpload('area4')}
              label="Área 4"
              disabled={loading}
            />
          </div>
        </div>

        <MetricasCard 
          data={metricsData}
          formatMoney={formatMoney}
          formatPercent={formatPercent}
        />
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Produtos</h2>
          <button
            onClick={addProduto}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 hide-on-print disabled:opacity-50"
            disabled={loading}
          >
            Adicionar Produto
          </button>
        </div>
        <ProdutosTable
          userId={userId} // Passando o userId corretamente
          produtos={produtos}
          onEdit={handleEditStart}
          onDelete={onDelete} // Passando a função onDelete
          formatMoney={formatMoney}
          disabled={loading}
        />
      </div>
    </div>
  );
};

DashboardContent.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string,
    id: PropTypes.string,
    proactiveRefresh: PropTypes.shape({
      user: PropTypes.shape({
        uid: PropTypes.string
      })
    })
  }).isRequired,
  vendedorInfo: PropTypes.shape({
    nome: PropTypes.string,
    regional: PropTypes.string,
    businessUnit: PropTypes.string,
    dataAtualizacao: PropTypes.string,
    whatsapp: PropTypes.string // Adicionando a prop whatsapp
  }).isRequired,
  areas: PropTypes.object.isRequired,
  produtos: PropTypes.array.isRequired,
  images: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  isExporting: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired,
  handleEditStart: PropTypes.func.isRequired,
  handleImageUpload: PropTypes.func.isRequired,
  exportToExcel: PropTypes.func.isRequired,
  exportToPDF: PropTypes.func.isRequired,
  addProduto: PropTypes.func.isRequired,
  formatMoney: PropTypes.func.isRequired,
  formatPercent: PropTypes.func.isRequired,
  showToast: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired // Adicionando a prop onDelete
};

export default DashboardContent;