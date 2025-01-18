import { getDatabase, ref, get } from 'firebase/database';

const fetchProdutos = async () => {
  const db = getDatabase();
  const produtosRef = ref(db, 'produtos');
  const snapshot = await get(produtosRef);
  const produtos = [];

  if (snapshot.exists()) {
    snapshot.forEach((produto) => {
      produtos.push({
        id: produto.key,
        nome: produto.child('nome').val(),
        marca: produto.child('marca').val(),
        categoria: produto.child('categoria').val(),
        descricao: produto.child('descricao').val(),
        preco: produto.child('preco').val()
      });
    });
  }

  return produtos;
};

export default fetchProdutos;