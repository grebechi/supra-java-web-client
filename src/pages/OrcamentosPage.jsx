import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function OrcamentosPage() {
  const [orcamentos, setOrcamentos] = useState([]);

  useEffect(() => {
    api.get('/orcamentos')
      .then(res => setOrcamentos(res.data))
      .catch(err => console.error(err));
  }, []);

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

      {orcamentos.length === 0 ? (
        <p className="text-gray-500">Nenhum orçamento cadastrado ainda.</p>
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
                      {item.produto?.nome} ({item.produto?.unidadeMedida?.sigla})
                      <br />
                      <Link
                        to={`/melhores-ofertas/${item.produto?.id}`}
                        className="text-blue-600 hover:underline text-xs"
                      >
                        Ver melhor oferta
                      </Link>
                    </span>
                    <span>
                      {item.quantidade} × {formatarMoeda(item.precoUnitario)} ={" "}
                      <strong>{formatarMoeda(item.valorTotal)}</strong>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex gap-3">
                <Link to={`/orcamentos/${orc.id}`}className="text-sm text-blue-600 hover:underline"> Ver detalhes</Link>
                <button className="text-sm text-red-600 hover:underline">Excluir</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrcamentosPage;
