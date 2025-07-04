import { useEffect, useState } from 'react';
import api from '../services/api';

function ProdutosPage() {
  const [produtos, setProdutos] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [unidadeMedidaId, setUnidadeMedidaId] = useState('');
  const [filtroUnidade, setFiltroUnidade] = useState('');
  const [pagina, setPagina] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [busca, setBusca] = useState('');
  const [size, setSize] = useState(10);

  const carregarProdutos = async (paginaParaBuscar = pagina) => {
    setCarregando(true);

    try {
      const res = await api.get('/produtos', {
        params: { page: paginaParaBuscar, size, busca }
      });
      setProdutos(res.data.content);
      setTotalPaginas(res.data.totalPages);
      setPagina(paginaParaBuscar);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
    }

    setCarregando(false);
  };

  useEffect(() => {
    carregarProdutos(0);
    api.get('/unidades').then(res => setUnidades(res.data.content || []));
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      carregarProdutos(0);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [busca]);

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
      await carregarProdutos(0);
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
    }
  };

  const salvarEdicao = async () => {
    try {
      await api.put(`/produtos/${produtoEditando.id}`, {
        nome: produtoEditando.nome,
        descricao: produtoEditando.descricao,
        unidadeMedidaId: produtoEditando.unidadeMedida?.id,
      });
      setProdutoEditando(null);
      await carregarProdutos(pagina);
    } catch (err) {
      alert("Erro ao salvar produto editado.");
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
      <input
        value={busca}
        onChange={e => setBusca(e.target.value)}
        placeholder="Buscar produtos por nome ou descrição"
        className="border p-2 w-full mb-4"
      />

      {carregando ? (
        <p className="text-gray-600">Carregando produtos...</p>
      ) : produtos.length === 0 ? (
        <p className="text-gray-500 italic">Nenhum produto encontrado.</p>
      ) : (
        <>
          <ul className="space-y-2">
            {produtos.map(p => (
              <li key={p.id} className="bg-white p-4 shadow rounded border">
                {produtoEditando?.id === p.id ? (
                  <div className="space-y-1">
                    <input
                      value={produtoEditando.nome}
                      onChange={e => setProdutoEditando({ ...produtoEditando, nome: e.target.value })}
                      className="border p-2 w-full"
                    />
                    <textarea
                      value={produtoEditando.descricao}
                      onChange={e => setProdutoEditando({ ...produtoEditando, descricao: e.target.value })}
                      className="border p-2 w-full"
                    />
                    <button onClick={salvarEdicao} className="text-sm text-green-600">Salvar</button>
                    <button onClick={() => setProdutoEditando(null)} className="text-sm text-gray-600 ml-2">Cancelar</button>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div>
                      <strong>{p.nome}</strong> — {p.unidadeMedida?.sigla}
                      <p className="text-sm text-gray-600">{p.descricao}</p>
                    </div>
                    <button
                      onClick={() => setProdutoEditando(p)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {totalPaginas > 1 && (
            <div className="mt-4 flex gap-4 justify-center items-center">
              <button
                onClick={() => carregarProdutos(pagina - 1)}
                disabled={pagina <= 0}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Página anterior
              </button>
              <span className="text-sm">Página {pagina + 1} de {totalPaginas}</span>
              <button
                onClick={() => carregarProdutos(pagina + 1)}
                disabled={pagina + 1 >= totalPaginas}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Próxima página
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ProdutosPage;
