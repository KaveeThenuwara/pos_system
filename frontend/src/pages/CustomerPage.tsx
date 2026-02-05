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
    if(!formData.name || !formData.email) {
      setError('All fields are required');
      return;
    }
    try {
      const response = await api.customers.create(formData);
      console.log('Created customer:', response.code);
      if (response.code !== 201) {
        alert('Failed to create customer');
        return;
      }
      alert ('Customer created successfully');
      await fetchCustomers();
      handleClear();
    } catch (err) {
      setError('Failed to create customer');
    }
  };
  const handleUpdate = async () => {
    if (!formData.id) return;
    try {
      await api.customers.update(formData);
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
      <div className="p-6 bg-white border rounded-lg shadow-sm border-slate-200">
        <h2 className="flex items-center gap-2 mb-6 text-2xl font-bold text-slate-800">
          <Users className="w-6 h-6 text-emerald-600" />
          Customer Management
        </h2>

        {error &&
        <div className="flex items-center gap-2 p-4 mb-4 text-red-700 border-l-4 border-red-500 bg-red-50">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        }

        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
          <div>
            <label className="block mb-1 text-sm font-medium text-slate-700">
              Customer ID
            </label>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleInputChange}
              readOnly
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all ${isEditing ? 'bg-slate-100 text-slate-500' : 'border-slate-300'}`}
              placeholder="C001" />

          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 transition-all border rounded-md outline-none border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="John Doe" />

          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 transition-all border rounded-md outline-none border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="john@example.com" />

          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {!isEditing ?
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-2 font-medium text-white transition-colors rounded-md shadow-sm bg-emerald-600 hover:bg-emerald-700">

              <Plus className="w-4 h-4" /> Add Customer
            </button> :

          <>
              <button
              onClick={handleUpdate}
              className="flex items-center gap-2 px-6 py-2 font-medium text-white transition-colors bg-blue-600 rounded-md shadow-sm hover:bg-blue-700">

                <Save className="w-4 h-4" /> Update
              </button>
              <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-6 py-2 font-medium text-white transition-colors bg-red-600 rounded-md shadow-sm hover:bg-red-700">

                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </>
          }
          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-6 py-2 ml-auto font-medium transition-colors rounded-md bg-slate-200 text-slate-700 hover:bg-slate-300">

            <X className="w-4 h-4" /> Clear
          </button>
        </div>
      </div>

      <div className="overflow-hidden bg-white border rounded-lg shadow-sm border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="border-b bg-slate-50 border-slate-200">
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
                <th className="px-6 py-4 text-sm font-semibold text-right text-slate-700">
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

                    <RefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin" />
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

                    <td className="px-6 py-4 text-sm font-medium text-slate-700">
                      {customer.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {customer.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {customer.email}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="px-2 py-1 text-xs font-medium rounded text-slate-400 bg-slate-100">
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