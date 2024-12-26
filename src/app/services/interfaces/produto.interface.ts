
export interface IProduto {
    nome: string;
    descricao: string;
    preco: number;
    categoria: string;
    imagemUrl?: string;
    disponivel: boolean;
    dataCriacao: Date;
}