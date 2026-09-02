import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ModulePage } from './pages/ModulePage';
import { ToolsPage } from './pages/ToolsPage';
import { GlossaryPage } from './pages/GlossaryPage';
import { ProgressPage } from './pages/ProgressPage';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/modulo/:id" element={<ModulePage />} />
        <Route path="/ferramentas" element={<ToolsPage />} />
        <Route path="/glossario" element={<GlossaryPage />} />
        <Route path="/progresso" element={<ProgressPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
