import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { RootStore } from './stores/RootStore';
import { Layout } from './components/layout';

interface AppProps {
  rootStore: RootStore;
}

const App: React.FC<AppProps> = observer(({ rootStore }) => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Enterprise Expense Tracker
                </h1>
                <p className="text-xl text-gray-600">
                  Welcome to your expense management system
                </p>
                <div className="mt-8 space-y-4">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Getting Started</h2>
                    <p className="text-gray-600">Your expense tracking application is ready to use!</p>
                  </div>
                </div>
              </div>
            </div>
          } />
        </Routes>
      </Layout>
    </Router>
  );
});

export default App;