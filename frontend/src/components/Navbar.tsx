import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Package, ShoppingCart } from 'lucide-react';
export function Navbar() {
  const location = useLocation();
  const isActive = (path: string) => {
    return location.pathname === path ?
    'bg-slate-800 text-white' :
    'text-slate-300 hover:bg-slate-800 hover:text-white';
  };
  return (
    <nav className="bg-slate-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <LayoutDashboard className="h-8 w-8 text-emerald-500" />
              <span className="text-white font-bold text-xl">POS System</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/customers"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${isActive('/customers')}`}>

                  <Users className="h-4 w-4" />
                  Customers
                </Link>
                <Link
                  to="/items"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${isActive('/items')}`}>

                  <Package className="h-4 w-4" />
                  Items
                </Link>
                <Link
                  to="/orders"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${isActive('/orders')}`}>

                  <ShoppingCart className="h-4 w-4" />
                  Place Order
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>);

}