import { useEffect, useState } from "react";
import api from "../services/api";

function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState([]);
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [carregando, setCarregando] = useState(false);
  const [fornecedorEditando, setFornecedorEditando] = useState(null);

  const carregarFornecedores = async (paginaParaBuscar = 0) => {
    console.log("📤 Carregando fornecedores", { page: paginaParaBuscar, size: 10, busca });
    setCarregando(true);
    try {
      const res = await api.get("/fornecedores", {
        params: { page: paginaParaBuscar, size: 3, busca },
      });

      console.log("✅ Resposta da API:", res.data);

      const lista = res.data?.content || [];
      setFornecedores(lista);
      setTotalPaginas(res.data?.totalPages ?? 1);
      setPagina(paginaParaBuscar);
    } catch (err) {
      alert("Erro ao buscar fornecedores.");
      setFornecedores([]);
    }
    setCarregando(false);
  };

  useEffect(() => {
    carregarFornecedores(0);
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      console.log("🔎 Filtro de busca alterado:", busca);
      carregarFornecedores(0);
    }, 500);
    return () => clearTimeout(delay);
  }, [busca]);

  const criarFornecedor = async () => {
    if (!nome || !cnpj) {
      alert("Preencha o nome e CNPJ.");
      return;
    }
    try {
      await api.post("/fornecedores", { nome, cnpj, email, telefone });
      await carregarFornecedores(0);
      setNome("");
      setCnpj("");
      setEmail("");
      setTelefone("");
    } catch (err) {
      alert("Erro ao cadastrar fornecedor.");
    }
  };

  const salvarEdicao = async () => {
    try {
      await api.put(`/fornecedores/${fornecedorEditando.id}`, fornecedorEditando);
      setFornecedorEditando(null);
      await carregarFornecedores(pagina);
    } catch (err) {
      alert("Erro ao salvar fornecedor editado.");
    }
  };

  const excluirFornecedor = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este fornecedor?")) return;
    try {
      await api.delete(`/fornecedores/${id}`);
      await carregarFornecedores(pagina);
    } catch (err) {
      alert("Erro ao excluir fornecedor.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Fornecedores</h1>

      <div className="mb-6 space-y-2 bg-gray-50 p-4 rounded border">
        <h2 className="text-lg font-semibold">Cadastrar novo fornecedor</h2>
        <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome" className="border p-2 w-full" />
        <input value={cnpj} onChange={(e) => setCnpj(e.target.value)} placeholder="CNPJ" className="border p-2 w-full" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail (opcional)" className="border p-2 w-full" />
        <input value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="Telefone (opcional)" className="border p-2 w-full" />
        <button onClick={criarFornecedor} className="bg-blue-600 text-white px-4 py-2 rounded">Cadastrar Fornecedor</button>
      </div>

      <input
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar por nome ou CNPJ"
        className="border p-2 w-full mb-4"
      />

      {carregando ? (
        <p className="text-gray-600">Carregando fornecedores...</p>
      ) : fornecedores?.length === 0 ? (
        <p className="text-gray-500">Nenhum fornecedor encontrado.</p>
      ) : (
        <>
          <ul className="space-y-2">
            {fornecedores.map(f => (
              <li key={f.id} className="bg-white p-4 shadow rounded border">
                {fornecedorEditando?.id === f.id ? (
                  <div className="space-y-1">
                    <input value={fornecedorEditando.nome} onChange={e => setFornecedorEditando({ ...fornecedorEditando, nome: e.target.value })} className="border p-2 w-full" />
                    <input value={fornecedorEditando.cnpj} onChange={e => setFornecedorEditando({ ...fornecedorEditando, cnpj: e.target.value })} className="border p-2 w-full" />
                    <input value={fornecedorEditando.email} onChange={e => setFornecedorEditando({ ...fornecedorEditando, email: e.target.value })} className="border p-2 w-full" />
                    <input value={fornecedorEditando.telefone} onChange={e => setFornecedorEditando({ ...fornecedorEditando, telefone: e.target.value })} className="border p-2 w-full" />
                    <button onClick={salvarEdicao} className="text-sm text-green-600">Salvar</button>
                    <button onClick={() => setFornecedorEditando(null)} className="text-sm text-gray-600 ml-2">Cancelar</button>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div>
                      <strong>{f.nome}</strong><br />
                      <span className="text-sm text-gray-600">CNPJ: {f.cnpj}</span><br />
                      <span className="text-sm text-gray-600">Email: {f.email || '-'}</span><br />
                      <span className="text-sm text-gray-600">Telefone: {f.telefone || '-'}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button onClick={() => setFornecedorEditando(f)} className="text-sm text-blue-600 hover:underline">Editar</button>
                      <button onClick={() => excluirFornecedor(f.id)} className="text-sm text-red-600 hover:underline">Excluir</button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {totalPaginas > 1 && (
            <div className="mt-4 flex gap-4 justify-center items-center">
              <button
                onClick={() => carregarFornecedores(pagina - 1)}
                disabled={pagina <= 0}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Página anterior
              </button>
              <span className="text-sm">Página {pagina + 1} de {totalPaginas}</span>
              <button
                onClick={() => carregarFornecedores(pagina + 1)}
                disabled={pagina + 1 >= totalPaginas}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Próxima página
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default FornecedoresPage;
