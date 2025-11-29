import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Layout from './components/layout/Layout';
import UsersList from './pages/UsersList';
import UserDetails from './pages/UserDetails';
import Analytics from './pages/Analytics';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<UsersList />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/users/:id" element={<UserDetails />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;