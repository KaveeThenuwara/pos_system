import React, { useEffect, useState } from 'react';
import { api } from '../api/api';
import { Item } from '../types';
import {
  Plus,
  Save,
  Trash2,
  X,
  RefreshCw,
  AlertCircle,
  Package } from
'lucide-react';
export function ItemPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Item>({
    id: '',
    name: '',
    description: '',
    availableQty: 0,
    price: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await api.items.getAll();
      setItems(data);
      setError(null);
    } catch (err) {
      setError('Failed to load items. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchItems();
  }, []);
  const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
  {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
      name === 'availableQty' || name === 'price' ? Number(value) : value
    }));
  };
  const handleAdd = async () => {
    if (!formData.id || !formData.name) {
      setError('ID and Name are required');
      return;
    }
    try {
      await api.items.create(formData);
      await fetchItems();
      handleClear();
    } catch (err) {
      setError('Failed to create item');
    }
  };
  const handleUpdate = async () => {
    if (!formData.id) return;
    try {
      await api.items.update(formData.id, formData);
      await fetchItems();
      handleClear();
    } catch (err) {
      setError('Failed to update item');
    }
  };
  const handleDelete = async () => {
    if (!formData.id) return;
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.items.delete(formData.id);
      await fetchItems();
      handleClear();
    } catch (err) {
      setError('Failed to delete item');
    }
  };
  const handleClear = () => {
    setFormData({
      id: '',
      name: '',
      description: '',
      availableQty: 0,
      price: 0
    });
    setIsEditing(false);
    setError(null);
  };
  const handleSelect = (item: Item) => {
    setFormData(item);
    setIsEditing(true);
    setError(null);
  };
  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6 border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Package className="h-6 w-6 text-emerald-600" />
          Item Management
        </h2>

        {error &&
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        }

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Item ID
            </label>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleInputChange}
              readOnly={isEditing}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all ${isEditing ? 'bg-slate-100 text-slate-500' : 'border-slate-300'}`}
              placeholder="I001" />

          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="Product Name" />

          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />

          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Available Qty
            </label>
            <input
              type="number"
              name="availableQty"
              value={formData.availableQty}
              onChange={handleInputChange}
              min="0"
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />

          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={1}
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"
              placeholder="Item description..." />

          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {!isEditing ?
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors font-medium shadow-sm">

              <Plus className="h-4 w-4" /> Add Item
            </button> :

          <>
              <button
              onClick={handleUpdate}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium shadow-sm">

                <Save className="h-4 w-4" /> Update
              </button>
              <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium shadow-sm">

                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </>
          }
          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-6 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors font-medium ml-auto">

            <X className="h-4 w-4" /> Clear
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                  ID
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                  Name
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                  Description
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 text-right">
                  Qty
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 text-right">
                  Price
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ?
              <tr>
                  <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-slate-500">

                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                    Loading items...
                  </td>
                </tr> :
              items.length === 0 ?
              <tr>
                  <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-slate-500">

                    No items found. Add one to get started.
                  </td>
                </tr> :

              items.map((item) =>
              <tr
                key={item.id}
                onClick={() => handleSelect(item)}
                className={`cursor-pointer transition-colors hover:bg-slate-50 ${formData.id === item.id ? 'bg-emerald-50 hover:bg-emerald-100' : ''}`}>

                    <td className="px-6 py-4 text-sm text-slate-700 font-medium">
                      {item.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 truncate max-w-xs">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 text-right">
                      {item.availableQty}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 text-right">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded">
                        Click to Edit
                      </span>
                    </td>
                  </tr>
              )
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>);

}