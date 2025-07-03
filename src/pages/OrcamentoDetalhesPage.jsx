import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function OrcamentoDetalhesPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [orcamento, setOrcamento] = useState(null);
  const [fornecedores, setFornecedores] = useState([]);
  const [produtos, setProdutos] = useState([]);

  const [editandoDados, setEditandoDados] = useState(false);
  const [novoProdutoId, setNovoProdutoId] = useState("");
  const [novaQuantidade, setNovaQuantidade] = useState("");
  const [novoValorTotal, setNovoValorTotal] = useState("");
  const [quantidadeValida, setQuantidadeValida] = useState(true);

  const [itemEditando, setItemEditando] = useState(null);
  const [quantidadeEditada, setQuantidadeEditada] = useState("");
  const [valorEditado, setValorEditado] = useState("");

  useEffect(() => {
    api.get(`/orcamentos/${id}`).then(res => setOrcamento(res.data));
    api.get("/fornecedores").then(res => setFornecedores(res.data));
    api.get("/produtos").then(res => setProdutos(res.data));
  }, [id]);

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

  const handleUpdateOrcamento = async () => {
    try {
      await api.put(`/orcamentos/${id}`, {
        nome: orcamento.nome,
        data: orcamento.data,
        fornecedorId: orcamento.fornecedor.id,
        observacao: orcamento.observacao
      });
      alert("Orçamento atualizado com sucesso!");
      setEditandoDados(false);
    } catch (err) {
      alert("Erro ao atualizar orçamento");
    }
  };

  const handleAddItem = async () => {
    const produto = produtos.find(p => p.id === parseInt(novoProdutoId));
    if (!validarQuantidade(novaQuantidade, produto.unidadeMedida?.tipo)) {
      alert("Quantidade inválida para o tipo de unidade.");
      setQuantidadeValida(false);
      return;
    }
    try {
      await api.post("/itens", {
        orcamentoId: orcamento.id,
        produtoId: produto.id,
        quantidade: formatarQuantidade(novaQuantidade, produto.unidadeMedida?.tipo),
        valorTotal: parseFloat(novoValorTotal)
      });
      const res = await api.get(`/orcamentos/${id}`);
      setOrcamento(res.data);
      setNovoProdutoId("");
      setNovaQuantidade("");
      setNovoValorTotal("");
    } catch (err) {
      alert("Erro ao adicionar item");
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await api.delete(`/itens/${itemId}`);
      const res = await api.get(`/orcamentos/${id}`);
      setOrcamento(res.data);
    } catch (err) {
      alert("Erro ao excluir item");
    }
  };

  const handleUpdateItem = async (item) => {
    const tipo = item.produto.unidadeMedida?.tipo;
    if (!validarQuantidade(quantidadeEditada, tipo)) {
      alert("Quantidade inválida para o tipo de unidade.");
      return;
    }
    try {
      await api.put(`/itens/${item.id}`, {
        quantidade: formatarQuantidade(quantidadeEditada, tipo),
        valorTotal: parseFloat(valorEditado)
      });
      const res = await api.get(`/orcamentos/${id}`);
      setOrcamento(res.data);
      setItemEditando(null);
    } catch (err) {
      alert("Erro ao editar item");
    }
  };

  if (!orcamento) return <div className="p-6">Carregando...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Detalhes do Orçamento</h1>
        <Link to="/orcamentos" className="text-sm text-blue-600 hover:underline">← Voltar</Link>
      </div>

      <div className="space-y-2 mb-6">
        <input value={orcamento.nome} onChange={e => setOrcamento({ ...orcamento, nome: e.target.value })} className="border p-2 w-full" disabled={!editandoDados} />
        <input type="date" value={orcamento.data} onChange={e => setOrcamento({ ...orcamento, data: e.target.value })} className="border p-2 w-full" disabled={!editandoDados} />
        <select value={orcamento.fornecedor.id} onChange={e => setOrcamento({ ...orcamento, fornecedor: fornecedores.find(f => f.id === parseInt(e.target.value)) })} className="border p-2 w-full" disabled={!editandoDados}>
          <option value="">Selecione o fornecedor</option>
          {fornecedores.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
        </select>
        <textarea value={orcamento.observacao} onChange={e => setOrcamento({ ...orcamento, observacao: e.target.value })} className="border p-2 w-full" disabled={!editandoDados} />
        {!editandoDados ? (
          <button onClick={() => setEditandoDados(true)} className="bg-blue-600 text-white px-4 py-2 rounded">Editar dados</button>
        ) : (
          <button onClick={handleUpdateOrcamento} className="bg-green-600 text-white px-4 py-2 rounded">Salvar alterações</button>
        )}
      </div>

      <h2 className="text-lg font-semibold mb-2">Itens</h2>
      <ul className="divide-y bg-gray-50 border rounded mb-4">
        {orcamento.itens.map(item => (
          <li key={item.id} className="p-3">
            {itemEditando === item.id ? (
              <div className="flex flex-col md:flex-row items-center gap-2">
                <div className="flex-1">
                  <p className="font-medium">{item.produto?.nome} ({item.produto?.unidadeMedida?.sigla})</p>
                  <input value={quantidadeEditada} onChange={e => setQuantidadeEditada(e.target.value)} placeholder="Quantidade" className="border p-1 w-full" />
                  <input value={valorEditado} onChange={e => setValorEditado(e.target.value)} placeholder="Valor total" className="border p-1 w-full" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleUpdateItem(item)} className="text-green-600 text-sm">Salvar</button>
                  <button onClick={() => setItemEditando(null)} className="text-gray-600 text-sm">Cancelar</button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.produto?.nome} ({item.produto?.unidadeMedida?.sigla})</p>
                  <p className="text-sm text-gray-600">Qtd: {item.quantidade} • Total: R$ {item.valorTotal?.toFixed(2)}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => {
                    setItemEditando(item.id);
                    setQuantidadeEditada(item.quantidade);
                    setValorEditado(item.valorTotal);
                  }} className="text-blue-600 text-sm">Editar</button>
                  <button onClick={() => handleDeleteItem(item.id)} className="text-red-600 text-sm">Excluir</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      <h3 className="font-semibold mb-2">Adicionar novo item</h3>
      <div className="flex flex-col md:flex-row gap-2">
        <select value={novoProdutoId} onChange={e => setNovoProdutoId(e.target.value)} className="border p-2 flex-1">
          <option value="">Produto</option>
          {produtos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
        </select>
        <input value={novaQuantidade} onChange={e => setNovaQuantidade(e.target.value)} placeholder="Quantidade" className={`border p-2 flex-1 ${quantidadeValida ? "" : "border-red-500"}`} />
        <input value={novoValorTotal} onChange={e => setNovoValorTotal(e.target.value)} placeholder="Valor Total" className="border p-2 flex-1" />
        <button onClick={handleAddItem} className="bg-blue-600 text-white px-4 py-2 rounded">Adicionar</button>
      </div>
    </div>
  );
}

export default OrcamentoDetalhesPage;
