function OrcamentoForm({ orcamento, fornecedores, editando, onChange, onEditar, onSalvar }) {
    return (
      <div className="space-y-2 mb-6">
        <div>
          <label className="text-sm text-gray-700">Nome do Orçamento</label>
          <input
            value={orcamento.nome}
            onChange={e => onChange({ ...orcamento, nome: e.target.value })}
            className="border p-2 w-full"
            disabled={!editando}
          />
        </div>
  
        <div>
          <label className="text-sm text-gray-700">Data</label>
          <input
            type="date"
            value={orcamento.data}
            onChange={e => onChange({ ...orcamento, data: e.target.value })}
            className="border p-2 w-full"
            disabled={!editando}
          />
        </div>
  
        <div>
          <label className="text-sm text-gray-700">Fornecedor</label>
          <select
            value={orcamento.fornecedor?.id || ''}
            onChange={e => onChange({
              ...orcamento,
              fornecedor: fornecedores.find(f => f.id === parseInt(e.target.value))
            })}
            className="border p-2 w-full"
            disabled={!editando}
          >
            <option value="">Selecione o fornecedor</option>
            {fornecedores.map(f => (
              <option key={f.id} value={f.id}>{f.nome}</option>
            ))}
          </select>
        </div>
  
        <div>
          <label className="text-sm text-gray-700">Observação</label>
          <textarea
            value={orcamento.observacao}
            onChange={e => onChange({ ...orcamento, observacao: e.target.value })}
            className="border p-2 w-full"
            disabled={!editando}
          />
        </div>
  
        <div className="flex justify-between items-center">
          {!editando ? (
            <button
              onClick={onEditar}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Editar dados
            </button>
          ) : (
            <button
              onClick={onSalvar}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Salvar alterações
            </button>
          )}
  
          <div className="text-sm text-gray-700">
            <span className="font-medium">Valor total:</span> R$ {orcamento.valorTotal?.toFixed(2)}
          </div>
        </div>
      </div>
    );
  }
  
  export default OrcamentoForm;
  