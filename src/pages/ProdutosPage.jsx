import { useEffect, useState } from 'react';
import api from '../services/api';

function ProdutosPage() {
  const [produtos, setProdutos] = useState([]);
  const [unidades, setUnidades] = useState([]);

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [unidadeMedidaId, setUnidadeMedidaId] = useState('');
  const [filtroUnidade, setFiltroUnidade] = useState('');

  useEffect(() => {
    api.get('/produtos').then(res => setProdutos(res.data));
    api.get('/unidades').then(res => setUnidades(res.data));
  }, []);

  const criarProduto = async () => {
    if (!nome || !unidadeMedidaId) {
      alert("Preencha o nome e selecione a unidade de medida.");
      return;
    }
  
    const payload = {
      nome,
      descricao,
      unidadeMedidaId: parseInt(unidadeMedidaId)
    };
  
    try {
      await api.post('/produtos', payload);
      const res = await api.get('/produtos');
      setProdutos(res.data);
  
      // Resetar formulário
      setNome('');
      setDescricao('');
      setUnidadeMedidaId('');
      setFiltroUnidade('');
    } catch (err) {
      const msg = err.response?.data;
      if (msg?.includes("já está em uso")) {
        alert("Este nome de produto já foi cadastrado. Escolha outro nome.");
      } else {
        alert("Erro ao cadastrar produto.");
      }
      console.error("❌ Erro ao cadastrar produto:", msg || err.message);
    }
  };
  

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Produtos</h1>

      <div className="mb-6 space-y-2 bg-gray-50 p-4 rounded border">
        <h2 className="text-lg font-semibold">Cadastrar novo produto</h2>
        <input
          value={nome}
          onChange={e => setNome(e.target.value)}
          placeholder="Nome do produto"
          className="border p-2 w-full"
        />
        <textarea
          value={descricao}
          onChange={e => setDescricao(e.target.value)}
          placeholder="Descrição (opcional)"
          className="border p-2 w-full"
        />
        <input
          value={filtroUnidade}
          onChange={(e) => setFiltroUnidade(e.target.value)}
          placeholder="Filtrar unidades de medida"
          className="border p-2 w-full"
        />
        <select
          value={unidadeMedidaId}
          onChange={(e) => setUnidadeMedidaId(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">Selecione a unidade de medida</option>
          {unidades
            .filter((u) =>
              u.nome.toLowerCase().includes(filtroUnidade.toLowerCase()) ||
              u.sigla.toLowerCase().includes(filtroUnidade.toLowerCase())
            )
            .map((u) => (
              <option key={u.id} value={u.id}>
                {u.nome} ({u.sigla}) - {u.tipo}
              </option>
            ))}
        </select>
        <button
          onClick={criarProduto}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Cadastrar Produto
        </button>
      </div>

      <h2 className="text-lg font-semibold mb-2">Lista de produtos</h2>
      <ul className="space-y-2">
        {produtos.map(p => (
          <li key={p.id} className="bg-white p-4 shadow rounded border">
            <strong>{p.nome}</strong> — {p.unidadeMedida?.sigla}
            <p className="text-sm text-gray-600">{p.descricao}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProdutosPage;
