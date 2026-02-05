import React, { useEffect, useState } from 'react';
import { api } from '../api/api';
import { Customer, Item, CartItem } from '../types';
import {
  ShoppingCart,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle } from
'lucide-react';
export function OrderPlacePage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [qty, setQty] = useState<number>(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const loadData = async () => {
      try {
        const [custData, itemData] = await Promise.all([
        api.customers.getAll(),
        api.items.getAll()]
        );
        setCustomers(custData);
        setItems(itemData);
      } catch (err) {
        setError('Failed to load initial data');
      }
    };
    loadData();
  }, []);
  const addToCart = () => {
    if (!selectedItem || qty <= 0) return;
    const item = items.find((i) => i.id === selectedItem);
    if (!item) return;
    if (item.availableQty < qty) {
      setError(`Only ${item.availableQty} items available`);
      return;
    }
    const existingItem = cart.find((c) => c.item.id === selectedItem);
    if (existingItem) {
      const newQty = existingItem.qty + qty;
      if (item.availableQty < newQty) {
        setError(`Cannot add more. Only ${item.availableQty} available`);
        return;
      }
      setCart(
        cart.map((c) =>
        c.item.id === selectedItem ?
        {
          ...c,
          qty: newQty
        } :
        c
        )
      );
    } else {
      setCart([
      ...cart,
      {
        item,
        qty
      }]
      );
    }
    setError(null);
    setSelectedItem('');
    setQty(1);
  };
  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((c) => c.item.id !== itemId));
  };
  const calculateTotal = () => {
    return cart.reduce((sum, c) => sum + c.item.price * c.qty, 0);
  };
  const handlePlaceOrder = async () => {
    if (!selectedCustomer || cart.length === 0) {
      setError('Please select a customer and add items to cart');
      return;
    }
    setLoading(true);
    try {
      await api.orders.create({
        customerId: selectedCustomer,
        items: cart.map((c) => ({
          itemId: c.item.id,
          qty: c.qty
        }))
      });
      setSuccess('Order placed successfully!');
      setCart([]);
      setSelectedCustomer('');
      setError(null);
      // Refresh items to get updated quantities
      const itemData = await api.items.getAll();
      setItems(itemData);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to place order');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white shadow-sm rounded-lg p-6 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-emerald-600" />
              Order Details
            </h2>

            {error &&
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                {error}
              </div>
            }

            {success &&
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded text-sm text-emerald-700 flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                {success}
              </div>
            }

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Select Customer
                </label>
                <select
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white">

                  <option value="">-- Select Customer --</option>
                  {customers.map((c) =>
                  <option key={c.id} value={c.id}>
                      {c.name} ({c.id})
                    </option>
                  )}
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Select Item
                </label>
                <select
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white mb-3">

                  <option value="">-- Select Item --</option>
                  {items.map((i) =>
                  <option
                    key={i.id}
                    value={i.id}
                    disabled={i.availableQty === 0}>

                      {i.name} - ${i.price} ({i.availableQty} avail)
                    </option>
                  )}
                </select>

                <div className="flex gap-3">
                  <div className="w-24">
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Qty
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={qty}
                      onChange={(e) => setQty(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none" />

                  </div>
                  <div className="flex-1 flex items-end">
                    <button
                      onClick={addToCart}
                      disabled={!selectedItem}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">

                      <Plus className="h-4 w-4" /> Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cart Display */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-sm rounded-lg border border-slate-200 overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">Current Cart</h2>
              <span className="text-sm text-slate-500">
                {cart.length} items
              </span>
            </div>

            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                      Price
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                      Qty
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                      Total
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cart.length === 0 ?
                  <tr>
                      <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-slate-400">

                        Cart is empty. Add items to start an order.
                      </td>
                    </tr> :

                  cart.map((c) =>
                  <tr key={c.item.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-sm font-medium text-slate-700">
                          {c.item.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 text-right">
                          ${c.item.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 text-right">
                          {c.qty}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-800 text-right">
                          ${(c.item.price * c.qty).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                        onClick={() => removeFromCart(c.item.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors">

                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                  )
                  }
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg text-slate-600">Total Amount:</span>
                <span className="text-3xl font-bold text-slate-900">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={cart.length === 0 || !selectedCustomer || loading}
                className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-bold text-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2">

                {loading ?
                <>
                    <RefreshCw className="h-5 w-5 animate-spin" /> Processing...
                  </> :

                <>Place Order</>
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>);

}