import { useEffect, useState } from "react";
import api from "../services/api";

function UnidadesPage() {
  const [unidades, setUnidades] = useState([]);
  const [nome, setNome] = useState("");
  const [sigla, setSigla] = useState("");
  const [tipo, setTipo] = useState("INTEIRA");
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [carregando, setCarregando] = useState(false);
  const [unidadeEditando, setUnidadeEditando] = useState(null);

  const carregarUnidades = async (paginaParaBuscar = pagina) => {
    setCarregando(true);
    try {
      const res = await api.get("/unidades", {
        params: { page: paginaParaBuscar, size: 10, busca }
      });
      setUnidades(res.data.content);
      setTotalPaginas(res.data.totalPages);
      setPagina(paginaParaBuscar);
    } catch (err) {
      alert("Erro ao buscar unidades de medida.");
    }
    setCarregando(false);
  };

  useEffect(() => {
    carregarUnidades();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => carregarUnidades(0), 500);
    return () => clearTimeout(delay);
  }, [busca]);

  const criarUnidade = async () => {
    if (!nome || !sigla || !tipo) {
      alert("Preencha todos os campos.");
      return;
    }

    try {
      await api.post("/unidades", { nome, sigla, tipo });
      await carregarUnidades(0);
      setNome("");
      setSigla("");
      setTipo("INTEIRA");
    } catch (err) {
      alert("Erro ao cadastrar unidade.");
    }
  };

  const salvarEdicao = async () => {
    try {
      await api.put(`/unidades/${unidadeEditando.id}`, unidadeEditando);
      setUnidadeEditando(null);
      await carregarUnidades(pagina);
    } catch (err) {
      alert("Erro ao salvar edição.");
    }
  };

  const excluirUnidade = async (id) => {
    if (!confirm("Tem certeza que deseja excluir esta unidade?")) return;
    try {
      await api.delete(`/unidades/${id}`);
      await carregarUnidades(pagina);
    } catch (err) {
      alert("Erro ao excluir unidade.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Unidades de Medida</h1>

      <div className="mb-6 space-y-2 bg-gray-50 p-4 rounded border">
        <h2 className="text-lg font-semibold">Cadastrar nova unidade</h2>
        <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome" className="border p-2 w-full" />
        <input value={sigla} onChange={e => setSigla(e.target.value)} placeholder="Sigla" className="border p-2 w-full" />
        <select value={tipo} onChange={e => setTipo(e.target.value)} className="border p-2 w-full">
          <option value="INTEIRA">INTEIRA</option>
          <option value="FRACIONADA">FRACIONADA</option>
          <option value="TEMPO">TEMPO</option>
        </select>
        <button onClick={criarUnidade} className="bg-blue-600 text-white px-4 py-2 rounded">Cadastrar Unidade</button>
      </div>

      <input
        value={busca}
        onChange={e => setBusca(e.target.value)}
        placeholder="Buscar por nome ou sigla"
        className="border p-2 w-full mb-4"
      />

      {carregando ? (
        <p className="text-gray-600">Carregando unidades...</p>
      ) : unidades.length === 0 ? (
        <p className="text-gray-500">Nenhuma unidade encontrada.</p>
      ) : (
        <ul className="space-y-2">
          {unidades.map(u => (
            <li key={u.id} className="bg-white p-4 shadow rounded border">
              {unidadeEditando?.id === u.id ? (
                <div className="space-y-1">
                  <input value={unidadeEditando.nome} onChange={e => setUnidadeEditando({ ...unidadeEditando, nome: e.target.value })} className="border p-2 w-full" />
                  <input value={unidadeEditando.sigla} onChange={e => setUnidadeEditando({ ...unidadeEditando, sigla: e.target.value })} className="border p-2 w-full" />
                  <select value={unidadeEditando.tipo} onChange={e => setUnidadeEditando({ ...unidadeEditando, tipo: e.target.value })} className="border p-2 w-full">
                    <option value="INTEIRA">INTEIRA</option>
                    <option value="FRACIONADA">FRACIONADA</option>
                    <option value="TEMPO">TEMPO</option>
                  </select>
                  <button onClick={salvarEdicao} className="text-sm text-green-600">Salvar</button>
                  <button onClick={() => setUnidadeEditando(null)} className="text-sm text-gray-600 ml-2">Cancelar</button>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    <strong>{u.nome}</strong> ({u.sigla}) — {u.tipo}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setUnidadeEditando(u)} className="text-sm text-blue-600 hover:underline">Editar</button>
                    <button onClick={() => excluirUnidade(u.id)} className="text-sm text-red-600 hover:underline">Excluir</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {unidades.length > 0 && (
        <div className="mt-4 flex gap-4 justify-center items-center">
          <button
            onClick={() => carregarUnidades(pagina - 1)}
            disabled={pagina <= 0}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Página anterior
          </button>
          <span className="text-sm">Página {pagina + 1} de {totalPaginas}</span>
          <button
            onClick={() => carregarUnidades(pagina + 1)}
            disabled={pagina + 1 >= totalPaginas}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Próxima página
          </button>
        </div>
      )}
    </div>
  );
}

export default UnidadesPage;
