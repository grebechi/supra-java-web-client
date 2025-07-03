import { useEffect, useState } from 'react';
import api from '../services/api';

function ProdutosPage() {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [unidadeMedidaId, setUnidadeMedidaId] = useState('');

  useEffect(() => {
    api.get('/produtos').then(res => setProdutos(res.data));
  }, []);

  const criarProduto = async () => {
    await api.post('/produtos', { nome, descricao, unidadeMedidaId });
    const res = await api.get('/produtos');
    setProdutos(res.data);
    setNome('');
    setDescricao('');
    setUnidadeMedidaId('');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Produtos</h1>

      <div className="mb-6 space-y-2">
        <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome" className="border p-2 w-full" />
        <input value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Descrição" className="border p-2 w-full" />
        <input value={unidadeMedidaId} onChange={e => setUnidadeMedidaId(e.target.value)} placeholder="ID Unidade Medida" className="border p-2 w-full" />
        <button onClick={criarProduto} className="bg-blue-600 text-white px-4 py-2 rounded">Cadastrar Produto</button>
      </div>

      <ul className="space-y-2">
        {produtos.map(p => (
          <li key={p.id} className="bg-white p-4 shadow rounded">
            <strong>{p.nome}</strong> — {p.unidadeMedida?.sigla}
            <p className="text-sm">{p.descricao}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProdutosPage;
