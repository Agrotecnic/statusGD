import { getDatabase, ref, get, set, update, push } from 'firebase/database';

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

const addProduto = async (produto) => {
  const db = getDatabase();
  const produtosRef = ref(db, 'produtos');
  const newProdutoRef = push(produtosRef);
  await set(newProdutoRef, produto);
  return { id: newProdutoRef.key, ...produto };
};

const updateProduto = async (id, produto) => {
  const db = getDatabase();
  const produtoRef = ref(db, `produtos/${id}`);
  await update(produtoRef, produto);
};

export { fetchProdutos, addProduto, updateProduto };