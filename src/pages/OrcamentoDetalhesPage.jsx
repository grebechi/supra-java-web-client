import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import AdicionarItemForm from "../components/AdicionarItemForm";
import EditarItemForm from "../components/EditarItemForm";
import ItemListado from "../components/ItemListado";
import OrcamentoForm from "../components/OrcamentoForm";

function OrcamentoDetalhesPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [orcamento, setOrcamento] = useState(null);
  const [fornecedores, setFornecedores] = useState([]);
  const [produtos, setProdutos] = useState([]);

  const [editandoDados, setEditandoDados] = useState(false);
  const [itemEditando, setItemEditando] = useState(null);
  const [mostrarFormularioItem, setMostrarFormularioItem] = useState(false);

  useEffect(() => {
    api.get(`/orcamentos/${id}`).then(res => setOrcamento(res.data));
  
    api.get("/fornecedores", { params: { page: 0, size: 1000 } })
      .then(res => setFornecedores(res.data.content || []));
  
    api.get("/produtos", { params: { page: 0, size: 1000 } })
      .then(res => setProdutos(res.data.content || []));
  }, [id]);
  

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

  const handleDeleteItem = async (itemId) => {
    try {
      await api.delete(`/itens/${itemId}`);
      const res = await api.get(`/orcamentos/${id}`);
      setOrcamento(res.data);
    } catch (err) {
      alert("Erro ao excluir item");
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
      <OrcamentoForm
        orcamento={orcamento}
        fornecedores={fornecedores}
        editando={editandoDados}
        onChange={setOrcamento}
        onEditar={() => setEditandoDados(true)}
        onSalvar={handleUpdateOrcamento}
      />
      </div>

      <h2 className="text-lg font-semibold mb-2">Itens</h2>
      <ul className="divide-y bg-gray-50 border rounded mb-4">
        {orcamento.itens.map(item => (
          <li key={item.id} className="p-3">
            {itemEditando === item.id ? (
              <EditarItemForm
                item={item}
                orcamentoId={orcamento.id}
                onCancel={() => setItemEditando(null)}
                onSalvo={async () => {
                  const res = await api.get(`/orcamentos/${orcamento.id}`);
                  setOrcamento(res.data);
                  setItemEditando(null);
                }}
              />
            ) : (
              <ItemListado
                item={item}
                onEditar={setItemEditando}
                onExcluir={handleDeleteItem}
              />
            )}
          </li>
        ))}
      </ul>

      {!mostrarFormularioItem ? (
        <button
          onClick={() => setMostrarFormularioItem(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Adicionar item
        </button>
      ) : (
        <AdicionarItemForm
          orcamentoId={orcamento.id}
          onItemAdicionado={async () => {
            const res = await api.get(`/orcamentos/${orcamento.id}`);
            setOrcamento(res.data);
            setMostrarFormularioItem(false);
          }}
        />
      )}
    </div>
  );
}

export default OrcamentoDetalhesPage;
