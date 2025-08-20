import { BrowserRouter as Router, Routes , Route } from 'react-router-dom';
import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
// import Checkpoints from './pages/Checkpoints';
import Reports from './pages/Reports';
import Navbar from './components/Navbar';
import SignUp from './pages/SignUp';
//superadmin 
import AddCheckpoint from './pages/Superadmin/AddCheckpoint';
import GuardDashboard from './pages/Guard/GuardDashboard';

// Supervisor pages
import SupervisorDashboard from './pages/Supervisor/SupervisorDashboard';
import Checkpoints from './pages/Supervisor/CheckPoints';
import ScanCheckpoint from './pages/Supervisor/ScanCheckpoint';
import AssignCheckpoints from './pages/Supervisor/AssignCheckpoints';
import Guards from './pages/Supervisor/Guards';

function Layout({ children }) {
  return (
    <div className="flex min-h screen">
      <Navbar />
      <main className="flex-1 p-6 ">{children}</main>
    </div>
  );
}


function App() {
  return (
    <Router>
      <Routes>
        
{/* public */}
        <Route path="/login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp/>} />

        {/* superadmin */}
        <Route path='/addcheckpoint' element={<Layout><AddCheckpoint /></Layout>} />

        {/* supervisor */}
         <Route path="/supervisor/dashboard" element={<Layout><SupervisorDashboard /></Layout>} />
        <Route path="/supervisor/checkPoints" element={<Layout><Checkpoints /></Layout>} />
        <Route path="/supervisor/scancheckpoint" element={<Layout><ScanCheckpoint /></Layout>} />
        <Route path="/supervisor/assignment" element={<Layout><AssignCheckpoints /></Layout>} />
        <Route path="/supervisor/guards" element={<Layout><Guards /></Layout>} />
        <Route path="/Guarddashboard" element={<Layout><GuardDashboard /></Layout>} />

        {/* <Route path="/dashboard" element={<Layout><Dashboard /> </Layout>} /> */}
        <Route path="/users" element={<Layout><Users /></Layout>} />
        {/* <Route path="/checkpoints" element={<Layout><Checkpoints /></Layout>} /> */}
        <Route path="/Reports" element={<Layout><Reports /></Layout>} />
      </Routes>
    </Router>
  );
}




export default App;
