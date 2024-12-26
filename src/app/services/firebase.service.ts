import { Injectable } from '@angular/core';
import { IProduto } from './interfaces/produto.interface';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private firestore: Firestore) {}

  async createProduto(produtoData: Partial<IProduto>): Promise<string> {
    try {
      // Validação dos dados
      if (!produtoData.nome || produtoData.nome.trim().length === 0) {
        throw new Error('Nome do produto é obrigatório');
      }
      if (!produtoData.preco || produtoData.preco <= 0) {
        throw new Error('Preço deve ser maior que zero');
      }
      if (!produtoData.categoria) {
        throw new Error('Categoria é obrigatória');
      }

      // Estrutura do produto
      const produto: IProduto = {
        nome: produtoData.nome.trim(),
        descricao: produtoData.descricao?.trim() || '',
        preco: Number(produtoData.preco),
        categoria: produtoData.categoria,
        imagemUrl: produtoData.imagemUrl || '',
        disponivel: produtoData.disponivel ?? true,
        dataCriacao: new Date()
      };

      // Criação no Firebase
      const produtoRef = collection(this.firestore, 'produtos');
      const docRef = await addDoc(produtoRef, produto);

      return docRef.id;

    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Erro ao criar produto: ${error.message}`);
      }
      throw new Error('Erro desconhecido ao criar produto');
    }
  }
}
