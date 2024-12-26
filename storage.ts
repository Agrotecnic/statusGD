
export interface Product {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

export class ProductStorage {
    private readonly STORAGE_KEY = 'products';

    saveProducts(products: Product[]): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
    }

    getProducts(): Product[] {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }
}