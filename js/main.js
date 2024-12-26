// Array inicial de produtos para teste
const produtos = [
    {
        id: 1,
        nome: 'Produto Teste',
        preco: 99.99,
        quantidade: 10,
        status: 'Ativo'
    }
];

function renderProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.nome}</td>
            <td>R$ ${product.preco.toFixed(2)}</td>
            <td>${product.quantidade}</td>
            <td><span class="badge ${product.status === 'Ativo' ? 'bg-success' : 'bg-danger'}">${product.status}</span></td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editProduct(${product.id})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})">Excluir</button>
            </td>
        `;
        productList.appendChild(row);
    });
}

// Chamada inicial para renderizar os produtos
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(produtos);
});

// ...existing code...
