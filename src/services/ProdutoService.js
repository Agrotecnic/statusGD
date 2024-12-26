import { db } from '../firebase/firebase.config';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { logger } from '../utils/logger';
import { retryOperation } from '../utils/retryHelper';
import StaticDataService from './StaticDataService';


class ProdutoService {
    constructor() {
        this.collection = 'produtos';
    }

    async validateProdutoData(produto) {
        if (!produto) {
            throw new Error('Produto não pode ser nulo');
        }
        
        if (!produto.produtoId) {
            throw new Error('ID do produto base é obrigatório');
        }

        if (!produto.cliente || typeof produto.cliente !== 'string') {
            throw new Error('Cliente é obrigatório');
        }

        // Validar se o produto base existe
        const produtoBase = await StaticDataService.getProdutoById(produto.produtoId);
        if (!produtoBase) {
            throw new Error('Produto base não encontrado');
        }

        return true;
    }

    async getProdutos() {
        try {
            const querySnapshot = await getDocs(collection(db, this.collection));
            return Promise.all(querySnapshot.docs.map(async doc => {
                const data = doc.data();
                const produtoBase = await StaticDataService.getProdutoById(data.produtoId);
                return {
                    id: doc.id,
                    ...data,
                    nome: produtoBase?.nome,
                    marca: produtoBase?.marca,
                    categoria: produtoBase?.categoria
                };
            }));
        } catch (error) {
            logger.error(`Erro ao buscar produtos: ${error.message}`);
            throw error;
        }
    }

    async getProdutoById(id) {
        try {
            const docRef = doc(db, this.collection, id);
            const docSnap = await getDoc(docRef);
            
            if (!docSnap.exists()) {
                throw new Error('Produto não encontrado');
            }

            const data = docSnap.data();
            const produtoBase = await StaticDataService.getProdutoById(data.produtoId);
            
            return {
                id: docSnap.id,
                ...data,
                nome: produtoBase?.nome,
                marca: produtoBase?.marca,
                categoria: produtoBase?.categoria
            };
        } catch (error) {
            logger.error(`Erro ao buscar produto por ID: ${error.message}`);
            throw error;
        }
    }

    async createProduto(produto) {
        try {
            await this.validateProdutoData(produto);
            
            const produtoBase = await StaticDataService.getProdutoById(produto.produtoId);
            const novoProduto = {
                ...produto,
                nome: produtoBase.nome,
                marca: produtoBase.marca,
                categoria: produtoBase.categoria,
                createdAt: new Date().toISOString()
            };

            const docRef = await addDoc(collection(db, this.collection), novoProduto);
            return { id: docRef.id, ...novoProduto };
        } catch (error) {
            logger.error(`Erro ao criar produto: ${error.message}`);
            throw error;
        }
    }

    async updateProduto(id, produto) {
        try {
            if (!id) {
                throw new Error('ID do produto é obrigatório');
            }

            await this.validateProdutoData(produto);
            
            return await retryOperation(async () => {
                const docRef = doc(db, this.collection, id);
                const docSnap = await getDoc(docRef);
                
                if (!docSnap.exists()) {
                    throw new Error('Produto não encontrado');
                }

                const produtoBase = await StaticDataService.getProdutoById(produto.produtoId);
                const updatedProduto = {
                    ...produto,
                    nome: produtoBase.nome,
                    marca: produtoBase.marca,
                    categoria: produtoBase.categoria,
                    updatedAt: new Date().toISOString()
                };

                await updateDoc(docRef, updatedProduto);
                logger.info(`Produto ${id} atualizado com sucesso`);
                
                return { id, ...updatedProduto };
            });
        } catch (error) {
            logger.error('Erro ao atualizar produto:', { error, produtoId: id });
            throw error;
        }
    }

    async deleteProduto(id) {
        try {
            const docRef = doc(db, this.collection, id);
            const docSnap = await getDoc(docRef);
            
            if (!docSnap.exists()) {
                throw new Error('Produto não encontrado');
            }

            await deleteDoc(docRef);
            return true;
        } catch (error) {
            logger.error(`Erro ao deletar produto: ${error.message}`);
            throw error;
        }
    }

    async getProdutosByCategoria(categoria) {
        try {
            const produtos = await this.getProdutos();
            return produtos.filter(produto => produto.categoria === categoria);
        } catch (error) {
            logger.error(`Erro ao buscar produtos por categoria: ${error.message}`);
            throw error;
        }
    }
}

export default new ProdutoService();