import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ProdutosPage from './pages/ProdutosPage';
import OrcamentosPage from './pages/OrcamentosPage';
import NovoOrcamentoPage from "./pages/NovoOrcamentoPage";
import MelhorOfertaPage from "./pages/MelhorOfertaPage";
import OrcamentoDetalhesPage from "./pages/OrcamentoDetalhesPage";

function App() {
  return (
    <BrowserRouter>
      <nav className="bg-gray-900 text-white p-4">
        <Link to="/" className="mr-4">Produtos</Link>
        <Link to="/orcamentos">Orçamentos</Link>
      </nav>
      <Routes>
        <Route path="/" element={<ProdutosPage />} />
        <Route path="/orcamentos" element={<OrcamentosPage />} />
        <Route path="/orcamentos/novo" element={<NovoOrcamentoPage />} />
        <Route path="/melhores-ofertas/:produtoId" element={<MelhorOfertaPage />} />
        <Route path="/orcamentos/:id" element={<OrcamentoDetalhesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
