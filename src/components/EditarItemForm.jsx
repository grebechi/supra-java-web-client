import { useState, useEffect } from "react";
import api from "../services/api";

function EditarItemForm({ item, orcamentoId, onCancel, onSalvo }) {
  const [quantidade, setQuantidade] = useState(item.quantidade);
  const [valorTotal, setValorTotal] = useState(item.valorTotal);
  const [quantidadeValida, setQuantidadeValida] = useState(true);

  const tipo = item.produto?.unidadeMedida?.tipo;
  const sigla = item.produto?.unidadeMedida?.sigla;

  const validarQuantidade = (qtd, tipo) => {
    if (tipo === "TEMPO") {
      const partes = qtd.trim().split(":");
      if (partes.length < 1 || partes.length > 3) return false;
      if (qtd.includes(".") || qtd.includes(",")) return false;
      return partes.every(p => !isNaN(p));
    }
    if (tipo === "INTEIRA") return /^\d+(\.0+)?$/.test(qtd.trim());
    if (tipo === "FRACIONADA") return !isNaN(parseFloat(qtd.replace(",", ".")));
    return false;
  };

  useEffect(() => {
    setQuantidadeValida(validarQuantidade(quantidade, tipo));
  }, [quantidade, tipo]);

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

  const salvar = async () => {
    if (!validarQuantidade(quantidade, tipo)) {
      setQuantidadeValida(false);
      alert("Quantidade inválida para o tipo de unidade.");
      return;
    }
    try {
      await api.put(`/itens/${item.id}`, {
        orcamentoId,
        produtoId: item.produto?.id,
        quantidade: formatarQuantidade(quantidade, tipo),
        valorTotal: parseFloat(valorTotal)
      });
      if (onSalvo) onSalvo();
    } catch (err) {
      alert("Erro ao salvar item");
      console.error(err);
    }
  };

  const placeholderPorTipo = {
    TEMPO: "Ex: 2:00 ou 02:00",
    INTEIRA: "Ex: 3",
    FRACIONADA: "Ex: 2.5"
  };

  return (
    <div className="flex flex-col md:flex-row md:items-end gap-2 bg-gray-50 p-2 rounded border">
      <div className="flex-1 flex flex-col justify-between min-h-[4.5rem]">
        <p className="font-medium text-sm mb-1">{item.produto?.nome} ({sigla})</p>
        <label className="text-sm text-gray-700">Quantidade</label>
        <input
          value={quantidade}
          onChange={e => setQuantidade(e.target.value)}
          placeholder={placeholderPorTipo[tipo] || "Quantidade"}
          className={`border text-sm p-1 w-full ${quantidadeValida ? "" : "border-red-500"}`}
        />
        <div className="text-xs text-gray-600 mt-1 min-h-[1.25rem]">
          Tipo: <strong>{tipo}</strong>
        </div>
        {!quantidadeValida && (
          <p className="text-xs text-red-600 absolute -bottom-5">Quantidade inválida para tipo {tipo}</p>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between min-h-[4.5rem]">
        <label className="text-sm text-gray-700">Valor total (R$)</label>
        <input
          value={valorTotal}
          onChange={e => setValorTotal(e.target.value)}
          placeholder="Ex: 100.00"
          className="border text-sm p-1 w-full"
        />
        <div className="invisible text-xs mt-1">placeholder</div>
      </div>

      <div className="flex items-end gap-2 min-h-[4.5rem]">
        <button
          onClick={salvar}
          className="bg-green-600 text-white text-sm px-3 py-1 rounded"
        >
          Salvar
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-300 text-sm text-gray-800 px-3 py-1 rounded"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default EditarItemForm;
