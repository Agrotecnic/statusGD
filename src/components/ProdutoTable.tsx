// import React, { useState, useCallback } from 'react';

// interface Produto {
//   id: number;
//   nome: string;
//   cliente: string;
//   valorVendido: number;
//   valorBonificado: number;
//   areas: number;
// }

// interface ProdutoTableProps {
//   produtos: Produto[];
//   onEdit: (produto: Produto) => void;
//   onRemove: (produto: Produto) => void;
// }

// const ProdutoTable: React.FC<ProdutoTableProps> = ({ produtos, onEdit, onRemove }) => {
//   const [sortConfig, setSortConfig] = useState<{ key: keyof Produto; direction: 'asc' | 'desc' }>({
//     key: 'nome',
//     direction: 'asc'
//   });

//   const formatCurrency = useCallback((value: number) => {
//     return new Intl.NumberFormat('pt-BR', {
//       style: 'currency',
//       currency: 'BRL'
//     }).format(value);
//   }, []);

//   const handleSort = useCallback((key: keyof Produto) => {
//     setSortConfig(prevConfig => ({
//       key,
//       direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
//     }));
//   }, []);

//   return (
//     <div className="overflow-x-auto">
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-gray-50">
//           <tr>
//             {[
//               { key: 'nome', label: 'Nome' },
//               { key: 'cliente', label: 'Cliente' },
//               { key: 'valorVendido', label: 'Valor Vendido' },
//               { key: 'valorBonificado', label: 'Valor Bonificado' },
//               { key: 'areas', label: 'Áreas' }
//             ].map(({ key, label }) => (
//               <th 
//                 key={key}
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                 onClick={() => handleSort(key as keyof Produto)}
//               >
//                 {label}
//                 {sortConfig.key === key && (
//                   <span className="ml-2">
//                     {sortConfig.direction === 'asc' ? '↑' : '↓'}
//                   </span>
//                 )}
//               </th>
//             ))}
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Ações
//             </th>
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {produtos.length === 0 ? (
//             <tr>
//               <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
//                 Nenhum produto encontrado
//               </td>
//             </tr>
//           ) : (
//             produtos.map((produto) => (
//               <tr key={produto.id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 whitespace-nowrap">{produto.nome}</td>
//                 <td className="px-6 py-4 whitespace-nowrap">{produto.cliente}</td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   {formatCurrency(produto.valorVendido)}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   {formatCurrency(produto.valorBonificado)}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">{produto.areas}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm">
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={() => onEdit(produto)}
//                       className="text-blue-600 hover:text-blue-900 font-medium focus:outline-none focus:underline"
//                       type="button"
//                     >
//                       Editar
//                     </button>
//                     <button
//                       onClick={() => onRemove(produto)}
//                       className="text-red-600 hover:text-red-900 font-medium focus:outline-none focus:underline ml-3"
//                       type="button"
//                     >
//                       Remover
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ProdutoTable;
