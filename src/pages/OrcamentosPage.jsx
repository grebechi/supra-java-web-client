import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function OrcamentosPage() {
  const [orcamentos, setOrcamentos] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(false);

  const carregarOrcamentos = async (paginaParaBuscar = pagina) => {
    setCarregando(true);
    try {
      const res = await api.get('/orcamentos', {
        params: {
          page: paginaParaBuscar,
          size: 3,
          busca: busca.trim()
        }
      });
      setOrcamentos(res.data.content);
      setTotalPaginas(res.data.totalPages);
      setPagina(paginaParaBuscar);
    } catch (err) {
      console.error('Erro ao carregar orçamentos:', err);
    }
    setCarregando(false);
  };

  useEffect(() => {
    carregarOrcamentos();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      carregarOrcamentos(0);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [busca]);

  const formatarData = (dataISO) =>
    new Date(dataISO).toLocaleDateString('pt-BR');

  const formatarMoeda = (valor) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor || 0);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Orçamentos</h1>
        <Link
          to="/orcamentos/novo"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Novo Orçamento
        </Link>
      </div>

      <input
        value={busca}
        onChange={e => setBusca(e.target.value)}
        placeholder="Buscar orçamentos por nome ou observação"
        className="border p-2 w-full mb-4"
      />

      {carregando ? (
        <p className="text-gray-500">Carregando orçamentos...</p>
      ) : orcamentos.length === 0 ? (
        <p className="text-gray-500">Nenhum orçamento encontrado.</p>
      ) : (
        <div className="space-y-4">
          {orcamentos.map((orc) => (
            <div key={orc.id} className="bg-white p-4 shadow rounded border">
              <div className="mb-2">
                <h2 className="text-xl font-semibold">{orc.nome}</h2>
                <p className="text-sm text-gray-600">
                  Fornecedor: <strong>{orc.fornecedor?.nome}</strong> • Data: {formatarData(orc.data)} • Total: {formatarMoeda(orc.valorTotal)}
                </p>
                {orc.observacao && (
                  <p className="text-sm italic text-gray-500 mt-1">"{orc.observacao}"</p>
                )}
              </div>

              <ul className="mt-2 divide-y">
                {orc.itens?.map((item) => (
                  <li key={item.id} className="py-2 text-sm flex justify-between">
                    <span>
                      {item.produto?.nome} ({item.produto?.unidadeMedida?.sigla})<br />
                      <Link
                        to={`/melhor-oferta/${item.produto?.id}`}
                        className="text-blue-600 hover:underline text-xs mt-1 inline-block"
                      >
                        Ver melhor oferta
                      </Link>
                    </span>
                    <span>
                      {item.quantidade} × {formatarMoeda(item.precoUnitario)} = <strong>{formatarMoeda(item.valorTotal)}</strong>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex gap-3">
                <Link to={`/orcamentos/${orc.id}`} className="text-sm text-blue-600 hover:underline">Ver detalhes</Link>
                <button className="text-sm text-red-600 hover:underline">Excluir</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {orcamentos.length > 0 && (
        <div className="mt-4 flex gap-4 justify-center items-center">
          <button
            onClick={() => carregarOrcamentos(pagina - 1)}
            disabled={pagina <= 0}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Página anterior
          </button>
          <span className="text-sm">Página {pagina + 1} de {totalPaginas}</span>
          <button
            onClick={() => carregarOrcamentos(pagina + 1)}
            disabled={pagina + 1 >= totalPaginas}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Próxima página
          </button>
        </div>
      )}
    </div>
  );
}

export default OrcamentosPage;
