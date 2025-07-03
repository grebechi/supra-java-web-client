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

  const [produtos, setProdutos] = useState([]);
  const [filtroProduto, setFiltroProduto] = useState("");
  const [produtoId, setProdutoId] = useState("");

  const [quantidade, setQuantidade] = useState("");
  const [valorTotal, setValorTotal] = useState("");
  const [quantidadeValida, setQuantidadeValida] = useState(true);

  const [itens, setItens] = useState([]);
  const [orcamentoId, setOrcamentoId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    api.get("/fornecedores").then((res) => setFornecedores(res.data));
    api.get("/produtos").then((res) => setProdutos(res.data));
  }, []);

  const produtoSelecionado = produtos.find(p => p.id === parseInt(produtoId));

  const validarQuantidade = () => {
    if (!produtoSelecionado) return false;
    const tipo = produtoSelecionado.unidadeMedida?.tipo;

    if (tipo === "TEMPO") {
      // Aceita 2, 2:00, 02:00, 2:00:30 — rejeita 2.5 ou 2,5
      const regex = /^(\d+)(:\d{1,2}){0,2}$/;
      const valido = regex.test(quantidade) && !quantidade.includes(".") && !quantidade.includes(",");
      setQuantidadeValida(valido);
      if (!valido) alert("Tempo inválido. Use formatos como 2, 2:00 ou 2:00:30");
      return valido;
    }

    if (tipo === "INTEIRA") {
      const valido = /^\d+$/.test(quantidade);
      setQuantidadeValida(valido);
      if (!valido) alert("A quantidade deve ser um número inteiro.");
      return valido;
    }

    if (tipo === "FRACIONADA") {
      const valido = !isNaN(parseFloat(quantidade));
      setQuantidadeValida(valido);
      if (!valido) alert("A quantidade fracionada deve ser um número decimal válido.");
      return valido;
    }

    setQuantidadeValida(true);
    return true;
  };

        const formatarQuantidade = () => {
  const tipo = produtoSelecionado?.unidadeMedida?.tipo;

  if (tipo === "TEMPO") {
    const partes = quantidade.trim().split(":");

    let horas = "00", minutos = "00", segundos = "00";

    if (partes.length === 1) {
      horas = partes[0].padStart(2, "0");
    } else if (partes.length === 2) {
      horas = partes[0].padStart(2, "0");
      minutos = partes[1].padStart(2, "0");
    } else if (partes.length === 3) {
      horas = partes[0].padStart(2, "0");
      minutos = partes[1].padStart(2, "0");
      segundos = partes[2].padStart(2, "0");
    } else {
      alert("Formato inválido para tempo. Use HH:mm ou HH:mm:ss");
      return null;
    }

    return `${horas}:${minutos}:${segundos}`; // sempre HH:mm:ss
  }

  if (tipo === "FRACIONADA") {
    return quantidade.trim().replace(",", ".");
  }

  if (tipo === "INTEIRA") {
    return parseInt(quantidade.trim(), 10).toString();
  }

  return quantidade.trim();
};


  const salvarOrcamento = async () => {
    const response = await api.post("/orcamentos", {
      nome,
      fornecedorId: parseInt(fornecedorId),
      data,
      observacao,
    });
    const id = response.data.id;
    setOrcamentoId(id);
    return id;
  };

  const adicionarItem = async () => {
    if (!produtoId || !quantidade || !valorTotal || !validarQuantidade()) return;

    let idOrcamento = orcamentoId;

    if (!orcamentoId) {
        if (!nome || !fornecedorId || !data) {
            alert("Preencha nome, data e fornecedor antes de adicionar um item.");
            return;
        }
        idOrcamento = await salvarOrcamento();
        alert("Orçamento criado com sucesso!");
    }

    const item = {
      produto: produtoSelecionado,
      produtoId: produtoSelecionado.id,
      quantidade: formatarQuantidade(),
      valorTotal: parseFloat(valorTotal),
    };

    await api.post("/itens", {
      orcamentoId: idOrcamento,
      produtoId: item.produtoId,
      quantidade: item.quantidade,
      valorTotal: item.valorTotal,
    });

    setItens([...itens, item]);
    setProdutoId("");
    setQuantidade("");
    setValorTotal("");
    setQuantidadeValida(true);
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
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do orçamento"
          disabled={!!orcamentoId}
          className="border p-2 w-full"
        />
        <input
          value={data}
          onChange={(e) => setData(e.target.value)}
          type="date"
          disabled={!!orcamentoId}
          className="border p-2 w-full"
        />
        <textarea
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          placeholder="Observação"
          disabled={!!orcamentoId}
          className="border p-2 w-full"
        />

        <div>
          <input
            value={filtroFornecedor}
            onChange={(e) => setFiltroFornecedor(e.target.value)}
            placeholder="Filtrar fornecedores"
            disabled={!!orcamentoId}
            className="border p-2 w-full mb-1"
          />
          <select
            value={fornecedorId}
            onChange={(e) => setFornecedorId(e.target.value)}
            disabled={!!orcamentoId}
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
      </div>

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
            className={`border p-2 flex-1 ${
              quantidadeValida ? "" : "border-red-500"
            }`}
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
            Unidade: <strong>{produtoSelecionado.unidadeMedida?.sigla}</strong>{" "}
            • Tipo:{" "}
            <strong>{produtoSelecionado.unidadeMedida?.tipo}</strong>
          </p>
        )}
      </div>

      <ul className="mb-6 divide-y">
        {itens.map((item, index) => (
          <li key={index} className="py-2 text-sm flex justify-between">
            <span>
              {item.produto.nome} — {item.quantidade}{" "}
              {item.produto.unidadeMedida?.sigla}
            </span>
            <span>R$ {item.valorTotal.toFixed(2)}</span>
          </li>
        ))}
      </ul>

      {!orcamentoId && (
        <p className="text-gray-500 text-sm">Preencha os dados e adicione o primeiro item para salvar o orçamento.</p>
      )}
    </div>
  );
}

export default NovoOrcamentoPage;
