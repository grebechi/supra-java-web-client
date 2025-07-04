import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function MelhorOfertaPage() {
  const { produtoId: produtoIdUrl } = useParams();
  const [produtos, setProdutos] = useState([]);
  const [produtoId, setProdutoId] = useState("");
  const [filtroProduto, setFiltroProduto] = useState("");
  const [ofertas, setOfertas] = useState([]);

  useEffect(() => {
    api.get("/produtos", { params: { page: 0, size: 1000 } }).then((res) => {
      setProdutos(res.data.content || []);
      if (produtoIdUrl) {
        setProdutoId(produtoIdUrl);
        buscarOfertas(produtoIdUrl);
      }
    });
  }, []);

  useEffect(() => {
    if (produtoId) {
      buscarOfertas(produtoId);
    } else {
      setOfertas([]);
    }
  }, [produtoId]);

  const buscarOfertas = async (id) => {
    try {
      const res = await api.get(`/produtos/${id}/melhores-ofertas`);
      setOfertas(res.data || []);
    } catch (err) {
      alert("Erro ao buscar ofertas");
      console.error(err);
    }
  };

  const formatarData = (dataISO) => {
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const produtoSelecionado = produtos.find(p => p.id === parseInt(produtoId));
  const melhor = ofertas.reduce((menor, atual) =>
    atual.precoUnitario < menor.precoUnitario ? atual : menor,
    ofertas[0] || {}
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Melhores Ofertas por Produto</h1>
        <Link to="/orcamentos" className="text-blue-600 hover:underline text-sm">
          ← Voltar
        </Link>
      </div>

      <div className="mb-6">
        <input
          value={filtroProduto}
          onChange={(e) => setFiltroProduto(e.target.value)}
          placeholder="Filtrar produtos"
          className="border p-2 w-full mb-2"
        />
        <select
          value={produtoId}
          onChange={(e) => setProdutoId(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">Selecione o produto</option>
          {produtos
            .filter((p) =>
              p.nome.toLowerCase().includes(filtroProduto.toLowerCase())
            )
            .map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} ({p.unidadeMedida?.sigla})
              </option>
            ))}
        </select>
      </div>

      {produtoSelecionado && (
        <h2 className="text-xl font-semibold mb-2">
          Ofertas para: {produtoSelecionado.nome}
        </h2>
      )}

      {ofertas.length === 0 ? (
        <p className="text-gray-500">Nenhuma oferta encontrada.</p>
      ) : (
        <div className="overflow-x-auto border rounded bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2">Fornecedor</th>
                <th className="p-2">Quantidade</th>
                <th className="p-2">
                  Preço por (
                  {produtoSelecionado?.unidadeMedida?.sigla || "unidade"})
                </th>
                <th className="p-2">Subtotal</th>
                <th className="p-2">Data</th>
                <th className="p-2">Observação</th>
              </tr>
            </thead>
            <tbody>
              {ofertas.map((oferta, index) => {
                const isMelhor = oferta === melhor;
                return (
                  <tr key={index} className={isMelhor ? "bg-green-50 font-semibold" : ""}>
                    <td className="p-2">{oferta.fornecedor?.nome || "-"}</td>
                    <td className="p-2">{oferta.quantidade}</td>
                    <td className="p-2">R$ {oferta.precoUnitario.toFixed(2)}</td>
                    <td className="p-2">R$ {oferta.valorTotal.toFixed(2)}</td>
                    <td className="p-2">{formatarData(oferta.dataOrcamento)}</td>
                    <td className="p-2 text-gray-500 italic">{oferta.observacao || "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MelhorOfertaPage;
