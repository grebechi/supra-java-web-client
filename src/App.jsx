import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ProdutosPage from './pages/ProdutosPage';
import OrcamentosPage from './pages/OrcamentosPage';
import NovoOrcamentoPage from "./pages/NovoOrcamentoPage";
import MelhorOfertaPage from "./pages/MelhorOfertaPage";
import OrcamentoDetalhesPage from "./pages/OrcamentoDetalhesPage";
import UnidadesPage from './pages/UnidadesPage';
import FornecedoresPage from './pages/FornecedoresPage';

function App() {
  return (
    <BrowserRouter>
      <nav className="bg-gray-900 text-white p-4">
        <Link to="/unidades" className="mr-4">Unidades de Medida</Link>
        <Link to="/" className="mr-4">Produtos</Link>
        <Link to="/orcamentos" className="mr-4">Orçamentos</Link>
        <Link to="/fornecedores" className="mr-4">Fornecedores</Link>
        <Link to="/melhor-oferta/" >Melhores Ofertas</Link>
      </nav>
      <Routes>
        <Route path="/" element={<ProdutosPage />} />
        <Route path="/orcamentos" element={<OrcamentosPage />} />
        <Route path="/orcamentos/novo" element={<NovoOrcamentoPage />} />
        <Route path="/melhor-oferta/:produtoId?" element={<MelhorOfertaPage />} />
        <Route path="/orcamentos/:id" element={<OrcamentoDetalhesPage />} />
        <Route path="/unidades" element={<UnidadesPage />} />
        <Route path="*" element={<h2 className="p-6 text-red-600">Página não encontrada</h2>} />
        <Route path="/fornecedores" element={<FornecedoresPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
