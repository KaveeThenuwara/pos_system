import React, { useEffect, useState } from 'react';
import { api } from '../api/api';
import { Customer } from '../types';
import {
  Plus,
  Save,
  Trash2,
  X,
  RefreshCw,
  AlertCircle,
  Users } from
'lucide-react';
export function CustomerPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Customer>({
    id: '',
    name: '',
    email: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await api.customers.getAll();
      setCustomers(data);
      setError(null);
    } catch (err) {
      setError('Failed to load customers. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCustomers();
  }, []);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  const handleAdd = async () => {
    if (!formData.id || !formData.name || !formData.email) {
      setError('All fields are required');
      return;
    }
    try {
      await api.customers.create(formData);
      await fetchCustomers();
      handleClear();
    } catch (err) {
      setError('Failed to create customer');
    }
  };
  const handleUpdate = async () => {
    if (!formData.id) return;
    try {
      await api.customers.update(formData.id, formData);
      await fetchCustomers();
      handleClear();
    } catch (err) {
      setError('Failed to update customer');
    }
  };
  const handleDelete = async () => {
    if (!formData.id) return;
    if (!window.confirm('Are you sure you want to delete this customer?'))
    return;
    try {
      await api.customers.delete(formData.id);
      await fetchCustomers();
      handleClear();
    } catch (err) {
      setError('Failed to delete customer');
    }
  };
  const handleClear = () => {
    setFormData({
      id: '',
      name: '',
      email: ''
    });
    setIsEditing(false);
    setError(null);
  };
  const handleSelect = (customer: Customer) => {
    setFormData(customer);
    setIsEditing(true);
    setError(null);
  };
  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6 border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Users className="h-6 w-6 text-emerald-600" />
          Customer Management
        </h2>

        {error &&
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        }

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Customer ID
            </label>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleInputChange}
              readOnly={isEditing}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all ${isEditing ? 'bg-slate-100 text-slate-500' : 'border-slate-300'}`}
              placeholder="C001" />

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
              placeholder="John Doe" />

          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="john@example.com" />

          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {!isEditing ?
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors font-medium shadow-sm">

              <Plus className="h-4 w-4" /> Add Customer
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
                  Email
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
                  colSpan={4}
                  className="px-6 py-8 text-center text-slate-500">

                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                    Loading customers...
                  </td>
                </tr> :
              customers.length === 0 ?
              <tr>
                  <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-slate-500">

                    No customers found. Add one to get started.
                  </td>
                </tr> :

              customers.map((customer) =>
              <tr
                key={customer.id}
                onClick={() => handleSelect(customer)}
                className={`cursor-pointer transition-colors hover:bg-slate-50 ${formData.id === customer.id ? 'bg-emerald-50 hover:bg-emerald-100' : ''}`}>

                    <td className="px-6 py-4 text-sm text-slate-700 font-medium">
                      {customer.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {customer.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {customer.email}
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