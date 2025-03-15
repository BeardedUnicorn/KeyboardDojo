import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './features/dashboard/Dashboard';
import Lessons from './features/lessons/Lessons';
import Practice from './features/practice/Practice';
import Profile from './features/profile/Profile';
import Settings from './features/settings/Settings';
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
