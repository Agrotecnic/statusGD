interface Product {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

export const saveProducts = (products: Product[]): void => {
    try {
        localStorage.setItem('products', JSON.stringify(products));
    } catch (error) {
        console.error('Erro ao salvar produtos:', error);
    }
};

export const loadProducts = (): Product[] => {
    try {
        const products = localStorage.getItem('products');
        return products ? JSON.parse(products) : [];
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        return [];
    }
};
