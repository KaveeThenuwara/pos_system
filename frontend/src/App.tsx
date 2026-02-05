import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { CustomerPage } from './pages/CustomerPage';
import { ItemPage } from './pages/ItemPage';
import { OrderPlacePage } from './pages/OrderPlacePage';
export function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/customers" replace />} />
            <Route path="/customers" element={<CustomerPage />} />
            <Route path="/items" element={<ItemPage />} />
            <Route path="/orders" element={<OrderPlacePage />} />
          </Routes>
        </main>
      </div>
    </HashRouter>);

}