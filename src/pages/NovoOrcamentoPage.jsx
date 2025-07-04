import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function NovoOrcamentoPage() {
  const [nome, setNome] = useState("");
  const [data, setData] = useState("");
  const [observacao, setObservacao] = useState("");
  const [fornecedores, setFornecedores] = useState([]);
  const [filtroFornecedor, setFiltroFornecedor] = useState("");
  const [fornecedorId, setFornecedorId] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    api.get("/fornecedores", { params: { page: 0, size: 1000 } })
    .then(res => setFornecedores(res.data.content || []));
  }, []);

  const criarOrcamento = async () => {
    if (!nome || !data || !fornecedorId) {
      alert("Preencha nome, data e fornecedor para criar o orçamento.");
      return;
    }
    try {
      const res = await api.post("/orcamentos", {
        nome,
        data,
        fornecedorId: parseInt(fornecedorId),
        observacao
      });
      alert("Orçamento criado com sucesso!");
      navigate(`/orcamentos/${res.data.id}`);
    } catch (err) {
      alert("Erro ao criar orçamento");
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Novo Orçamento</h1>
        <Link
          to="/orcamentos"
          className="text-blue-600 hover:underline text-sm"
        >
          ← Voltar para Orçamentos
        </Link>
      </div>

      <div className="space-y-3 mb-6">
        <div>
          <label className="block text-sm font-medium">Nome do orçamento</label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Data</label>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Observação</label>
          <textarea
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Fornecedor</label>
          <input
            value={filtroFornecedor}
            onChange={(e) => setFiltroFornecedor(e.target.value)}
            placeholder="Filtrar fornecedores"
            className="border p-2 w-full mb-1"
          />
          <select
            value={fornecedorId}
            onChange={(e) => setFornecedorId(e.target.value)}
            className="border p-2 w-full"
          >
            <option value="">Selecione o fornecedor</option>
            {fornecedores
              .filter((f) =>
                f.nome.toLowerCase().includes(filtroFornecedor.toLowerCase())
              )
              .map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nome}
                </option>
              ))}
          </select>
        </div>

        <button
          onClick={criarOrcamento}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Criar Orçamento
        </button>
      </div>
    </div>
  );
}

export default NovoOrcamentoPage;
