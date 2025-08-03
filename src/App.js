import { BrowserRouter as Router, Routes , Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Checkpoints from './pages/Checkpoints';
import Reports from './pages/Reports';
import Navbar from './components/Navbar';

function Layout({ children }) {
  return (
    <div className="flex">
      <Navbar />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Layout><Dashboard /> </Layout>} />
        <Route path="/users" element={<Layout><Users /></Layout>} />
        <Route path="/checkpoints" element={<Layout><Checkpoints /></Layout>} />
        <Route path="/reports" element={<Layout><Reports /></Layout>} />
      </Routes>
    </Router>
  );
}




export default App;
