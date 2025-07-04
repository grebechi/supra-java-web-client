function ItemListado({ item, onEditar, onExcluir }) {
    const sigla = item.produto?.unidadeMedida?.sigla;
  
    return (
      <li className="p-3">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">{item.produto?.nome} ({sigla})</p>
  
            <div className="text-sm text-gray-600 grid grid-cols-3 gap-2">
              <div className="flex flex-col items-start">
                <span className="text-xs text-gray-500">Qtd.</span>
                <span>{item.quantidade} {sigla}</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs text-gray-500">Valor por {sigla}</span>
                <span>R$ {item.precoUnitario?.toFixed(2)}</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs text-gray-500">Subtotal</span>
                <span className="font-semibold">R$ {item.valorTotal?.toFixed(2)}</span>
              </div>
            </div>
          </div>
  
          <div className="flex gap-3">
            <button onClick={() => onEditar(item.id)} className="text-blue-600 text-sm">Editar</button>
            <button onClick={() => onExcluir(item.id)} className="text-red-600 text-sm">Excluir</button>
          </div>
        </div>
      </li>
    );
  }
  
  export default ItemListado;
  