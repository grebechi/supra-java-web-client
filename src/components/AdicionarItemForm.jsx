import { useEffect, useState } from "react";
import api from "../services/api";

function AdicionarItemForm({ orcamentoId, onItemAdicionado }) {
  const [produtos, setProdutos] = useState([]);
  const [produtoId, setProdutoId] = useState("");
  const [filtroProduto, setFiltroProduto] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [valorTotal, setValorTotal] = useState("");
  const [quantidadeValida, setQuantidadeValida] = useState(true);

  useEffect(() => {
    api.get("/produtos").then(res => setProdutos(res.data));
  }, []);

  const produtoSelecionado = produtos.find(p => p.id === parseInt(produtoId));

  const validarQuantidade = (qtd, tipo) => {
    if (tipo === "TEMPO") {
      const partes = qtd.trim().split(":");
      if (partes.length < 1 || partes.length > 3) return false;
      if (qtd.includes(".") || qtd.includes(",")) return false;
      return partes.every(p => !isNaN(p));
    }
    if (tipo === "INTEIRA") return /^\d+$/.test(qtd);
    if (tipo === "FRACIONADA") return !isNaN(parseFloat(qtd.replace(",", ".")));
    return false;
  };

  const formatarQuantidade = (qtd, tipo) => {
    if (tipo === "TEMPO") {
      const partes = qtd.trim().split(":");
      const h = partes[0]?.padStart(2, "0") || "00";
      const m = partes[1]?.padStart(2, "0") || "00";
      const s = partes[2]?.padStart(2, "0") || "00";
      return `${h}:${m}:${s}`;
    }
    if (tipo === "FRACIONADA") return qtd.trim().replace(",", ".");
    if (tipo === "INTEIRA") return parseInt(qtd.trim(), 10).toString();
    return qtd.trim();
  };

  const adicionarItem = async () => {
    if (!produtoId || !quantidade || !valorTotal) return;
    const produto = produtos.find(p => p.id === parseInt(produtoId));
    const tipo = produto?.unidadeMedida?.tipo;

    if (!validarQuantidade(quantidade, tipo)) {
      alert("Quantidade inválida para o tipo de unidade.");
      setQuantidadeValida(false);
      return;
    }

    try {
      await api.post("/itens", {
        orcamentoId,
        produtoId: produto.id,
        quantidade: formatarQuantidade(quantidade, tipo),
        valorTotal: parseFloat(valorTotal)
      });
      setProdutoId("");
      setQuantidade("");
      setValorTotal("");
      setQuantidadeValida(true);
      if (onItemAdicionado) onItemAdicionado();
    } catch (err) {
      alert("Erro ao adicionar item");
    }
  };

  return (
    <div className="border p-4 mb-4 rounded bg-gray-50">
      <h2 className="font-semibold mb-2">Adicionar Item</h2>

      <input
        value={filtroProduto}
        onChange={(e) => setFiltroProduto(e.target.value)}
        placeholder="Filtrar produtos"
        className="border p-2 w-full mb-1"
      />
      <select
        value={produtoId}
        onChange={(e) => setProdutoId(e.target.value)}
        className="border p-2 w-full mb-2"
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

      <div className="flex flex-col md:flex-row gap-2">
        <input
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          placeholder="Quantidade"
          className={`border p-2 flex-1 ${quantidadeValida ? "" : "border-red-500"}`}
        />
        <input
          value={valorTotal}
          onChange={(e) => setValorTotal(e.target.value)}
          placeholder="Valor total (R$)"
          className="border p-2 flex-1"
        />
        <button
          onClick={adicionarItem}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Adicionar
        </button>
      </div>

      {produtoSelecionado && (
        <p className="text-xs text-gray-600 mt-1">
          Unidade: <strong>{produtoSelecionado.unidadeMedida?.sigla}</strong> • Tipo: <strong>{produtoSelecionado.unidadeMedida?.tipo}</strong>
        </p>
      )}
    </div>
  );
}

export default AdicionarItemForm;
