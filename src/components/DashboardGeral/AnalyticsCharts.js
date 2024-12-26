import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF
const data = [
    { name: 'Vendedor 1', totalVendido: 4000 },
    { name: 'Vendedor 2', totalVendido: 3000 },
    { name: 'Vendedor 3', totalVendido: 2000 },
    { name: 'Vendedor 4', totalVendido: 2780 },
    { name: 'Vendedor 5', totalVendido: 1890 },
    { name: 'Vendedor 6', totalVendido: 2390 },
    { name: 'Vendedor 7', totalVendido: 3490 },
    ];

const VendedoresOverview = () => {
    const totalVendas = useMemo(() => data.reduce((acc, v) => acc + v.totalVendido, 0), [data]);
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Total de Vendas</h2>
            <p className="text-3xl font-bold">{totalVendas}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Total de Vendedores</h2>
            <p className="text-3xl font-bold">{data.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Total de Áreas</h2>
            <p className="text-3xl font-bold">5</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Total de Business Units</h2>
            <p className="text-3xl font-bold">3</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Total de Regionais</h2>
            <p className="text-3xl font-bold">2</p>
        </div>
        </div>
    );
    };

    export default VendedoresOverview;

const VendedoresChart = () => {
    return (
        <ResponsiveContainer width="100%" height={400}>
        <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalVendido" fill="#8884d8" />
        </BarChart>
        </ResponsiveContainer>
    );
};  

export default VendedoresChart;

const VendedoresPieChart = () => {
    return (
        <ResponsiveContainer width="100%" height={400}>
        <PieChart>
            <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="totalVendido"
            label
            >
            {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            </Pie>
            <Tooltip />
        </PieChart>
        </ResponsiveContainer>
    );
};

export default VendedoresPieChart;

const VendedoresTable = () => {
    return (
        <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
            <thead className="bg-gray-800 text-white">
            <tr>
                <th className="py-2 px-4 text-left">Nome</th>
                <th className="py-2 px-4 text-right">Total Vendido</th>
            </tr>
            </thead>
            <tbody className="text-gray-700">
            {data.map((vendedor) => (
                <tr key={vendedor.name} className="border-b hover:bg-gray-100">
                <td className="py-2 px-4">{vendedor.name}</td>
                <td className="py-2 px-4 text-right">{vendedor.totalVendido}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
};

export default VendedoresTable;

const VendedoresDetails = () => {
    return (
        <div>
            <h1>Vendedor Detalhes</h1>
            {/* Render vendedor details */}
        </div>
    );
};

export default VendedoresDetails;

const VendedoresExport = () => {
    return (
        <div>
            <button onClick={() => exportToCSV(data)}>Exportar para CSV</button>
        </div>
    );
};

export default VendedoresExport;

const VendedoresFilter = () => {
    return (
        <div>
            <input type="text" placeholder="Filtrar por nome" />
        </div>
    );
};

export default VendedoresFilter;

const VendedoresPagination = () => {
    return (
        <div>
            <button>Anterior</button>
            <button>Próximo</button>
        </div>
    );
};

export default VendedoresPagination;

const VendedoresSearch = () => {
    return (
        <div>
            <input type="text" placeholder="Pesquisar" />
        </div>
    );
};

export default VendedoresSearch;

const VendedoresSorting = () => {
    return (
        <div>
            <button>Ordenar por Nome</button>
            <button>Ordenar por Total Vendido</button>
        </div>
    );
};

export default VendedoresSorting;

const VendedoresWrapper = () => {
    return (
        <div>
            <VendedoresFilter />
            <VendedoresSearch />
            <VendedoresSorting />
            <VendedoresTable />
            <VendedoresPagination />
        </div>
    );
};

export default VendedoresWrapper;

const VendedoresReport = () => {
    return (
        <div>
            <VendedoresOverview />
            <VendedoresChart />
            <VendedoresPieChart />
            <VendedoresWrapper />
        </div>
    );
};

export default VendedoresReport;

const Vendedores = () => {
    return (
        <div>
            <VendedoresReport />
            <VendedoresDetails />
            <VendedoresExport />
        </div>
    );
};

export default Vendedores;


// VendedoresForm.js
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const VendedorForm = ({ initialValues, onSubmit }) => {
    const validationSchema = Yup.object().shape({
        nome: Yup.string()
           .required('Nome é obrigatório')
           .max(50, 'Nome deve ter no máximo 50 caracteres'),
        totalVendido: Yup.number()
           .required('Total Vendido é obrigatório')
           .min(0, 'Total Vendido não pode ser negativo'),
    });

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            <Form>
                <div>
                    <label htmlFor="nome">Nome</label>
                    <Field type="text" id="nome" name="nome" />
                    <ErrorMessage name="nome" />
                </div>
                <div>
                    <label htmlFor="totalVendido">Total Vendido</label>
                    <Field type="number" id="totalVendido" name="totalVendido" />
                    <ErrorMessage name="totalVendido" />
                </div>
                <button type="submit">Salvar</button>
            </Form>
        </Formik>
    );
};

export default VendedorForm;

// VendedoresList.js
import React from 'react';
import { Link } from 'react-router-dom';

const VendedoresList = ({ vendedores }) => {
    return (
        <div>
            {vendedores.map((vendedor) => (
                <div key={vendedor.id}>
                    <Link to={`/vendedores/${vendedor.id}`}>{vendedor.nome}</Link>
                </div>
            ))}
        </div>
    );
};

export default VendedoresList;

// VendedoresNew.js
import React from 'react';
import { useHistory } from 'react-router-dom';
import VendedorForm from './VendedorForm';

const VendedoresNew = () => {
    const history = useHistory();

    const handleSubmit = (values) => {
        // Save vendedor
        console.log(values);
        history.push('/vendedores');
    };

    return (
        <div>
            <h1>Novo Vendedor</h1>
            <VendedorForm initialValues={{ nome: '', totalVendido: 0 }} onSubmit={handleSubmit} />
        </div>
    );
};

export default VendedoresNew;

// VendedoresShow.js
import React from 'react';
import { useParams } from 'react-router-dom';

const VendedoresShow = () => {
    const { id } = useParams();

    return (
        <div>
            <h1>Vendedor {id}</h1>
        </div>
    );
};

export default VendedoresShow;

// VendedoresUpdate.js
import React from 'react';
import { useHistory } from 'react-router-dom';
import VendedorForm from './VendedorForm';

const VendedoresUpdate = () => {
    const history = useHistory();

    const handleSubmit = (values) => {
        // Update vendedor
        console.log(values);
        history.push('/vendedores');
    };

    return (
        <div>
            <h1>Editar Vendedor</h1>
            <VendedorForm initialValues={{ nome: 'Vendedor 1', totalVendido: 4000 }} onSubmit={handleSubmit} />
        </div>
    );
};

export default VendedoresUpdate;

// Vendedores.js
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import VendedoresList from './VendedoresList';
import VendedoresNew from './VendedoresNew';
import VendedoresShow from './VendedoresShow';
import VendedoresUpdate from './VendedoresUpdate';

const Vendedores = () => {
    const vendedores = [
        { id: 1, nome: 'Vendedor 1', totalVendido: 3000 },
        { id: 2, nome: 'Vendedor 2', totalVendido: 2000 },
        { id: 3, nome: 'Vendedor 3', totalVendido: 1000 },
    ];
    return (
        <div>
            <Switch>
                <Route exact path="/vendedores" component={() => <VendedoresList vendedores={vendedores} />} />
                <Route exact path="/vendedores/new" component={VendedoresNew} />
                <Route exact path="/vendedores/:id" component={VendedoresShow} />
                <Route exact path="/vendedores/:id/edit" component={VendedoresUpdate} />
            </Switch>
        </div>
    );
};

export default Vendedores;

