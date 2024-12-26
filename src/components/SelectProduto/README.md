# SelectProduto

Componente para seleção de produtos com filtros por marca e categoria.

## Propriedades

| Prop | Tipo | Obrigatório | Padrão | Descrição |
|------|------|-------------|---------|-----------|
| value | string | Sim | - | ID do produto selecionado |
| onChange | function | Sim | - | Função chamada quando um produto é selecionado |
| error | string | Não | - | Mensagem de erro para exibição |
| disabled | boolean | Não | false | Desabilita o componente |
| showCategoria | boolean | Não | true | Mostra ou esconde o select de categoria |

## Exemplo de Uso

```jsx
import SelectProduto from './components/SelectProduto';

function MyComponent() {
  const [produtoId, setProdutoId] = useState('');
  
  return (
    <SelectProduto
      value={produtoId}
      onChange={setProdutoId}
      error={error}
      disabled={false}
      showCategoria={true}
    />
  );
}
```

## Estrutura dos Dados

O componente espera que os produtos tenham a seguinte estrutura:

```typescript
interface Produto {
  id: string;
  nome: string;
  marca: string;
  categoria: string;
}
```

## Marcas Suportadas
- AMINOAGRO
- DIMICRON

## Categorias Suportadas
- ADJUVANTES
- BIOZ
- ORGANICS
- COND.SOLOS
- TS
- PROG.USO