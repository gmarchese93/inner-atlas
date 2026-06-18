import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from '@/lib/AuthContext';
import Home from './pages/Home';
import MoodSelector from './pages/MoodSelector';
import Session from './pages/Session';
import History from './pages/History';

function SessionRoute() {
  const location = useLocation();
  return <Session key={location.search} />;
}

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mood" element={<MoodSelector />} />
            <Route path="/session" element={<SessionRoute />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
