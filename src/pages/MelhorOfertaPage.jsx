import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

function MelhorOfertaPage() {
  const { produtoId } = useParams();
  const [oferta, setOferta] = useState(null);

  const formatarMoeda = (valor) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);

  useEffect(() => {
    api.get(`/produtos/${produtoId}/melhores-ofertas`)
      .then(res => setOferta(res.data))
      .catch(err => console.error(err));
  }, [produtoId]);

  if (!oferta) {
    return <div className="p-6 text-gray-500">Carregando...</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link to="/" className="text-blue-600 underline text-sm">← Voltar</Link>

      <h1 className="text-2xl font-bold mt-2">Melhor Oferta para: {oferta.produto}</h1>

      <div className="bg-white border rounded p-4 mt-4 shadow">
        <p><strong>Fornecedor:</strong> {oferta.fornecedor.nome}</p>
        <p><strong>Preço Unitário:</strong> {formatarMoeda(oferta.precoUnitario)}</p>
        <p><strong>Quantidade:</strong> {oferta.quantidade}</p>
        <p><strong>Valor Total:</strong> {formatarMoeda(oferta.valorTotal)}</p>
        <p><strong>Data do Orçamento:</strong> {new Date(oferta.dataOrcamento).toLocaleDateString('pt-BR')}</p>
        {oferta.observacao && (
          <p className="italic text-sm mt-2 text-gray-600">"{oferta.observacao}"</p>
        )}
      </div>
    </div>
  );
}

export default MelhorOfertaPage;
