import { Customer, Item, OrderRequest } from '../types';

const BASE_URL = 'http://localhost:8080/api/v1';

export const api = {
  customers: {
    getAll: async (): Promise<Customer[]> => {
      const res = await fetch(`${BASE_URL}/customers/getAll`);
      if (!res.ok) throw new Error('Failed to fetch customers');
      return res.json();
    },
    getCustomerById: async (id: string): Promise<Customer> => {
      const res = await fetch(`${BASE_URL}/customers/getCustomer/${id}`);
      if (!res.ok) throw new Error('Failed to fetch customer');
      return res.json();
    },
    create: async (customer: Customer): Promise<Customer> => {
      const res = await fetch(`${BASE_URL}/customers/saveCustomer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer)
      });
      if (!res.ok) throw new Error('Failed to create customer');
      return res.json();
    },
    update: async (customer: Customer): Promise<Customer> => {
      const res = await fetch(`${BASE_URL}/customers/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer)
      });
      if (!res.ok) throw new Error('Failed to update customer');
      return res.json();
    },
    delete: async (id: string): Promise<void> => {
      const res = await fetch(`${BASE_URL}/customers/delete/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete customer');
    }
  },
  items: {
    getAll: async (): Promise<Item[]> => {
      const res = await fetch(`${BASE_URL}/items`);
      if (!res.ok) throw new Error('Failed to fetch items');
      return res.json();
    },
    create: async (item: Item): Promise<Item> => {
      const res = await fetch(`${BASE_URL}/items/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (!res.ok) throw new Error('Failed to create item');
      return res.json();
    },
    update: async (item: Item): Promise<Item> => {
      const res = await fetch(`${BASE_URL}/items/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (!res.ok) throw new Error('Failed to update item');
      return res.json();
    },
    delete: async (id: string): Promise<void> => {
      const res = await fetch(`${BASE_URL}/items/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete item');
    }
  },
  orders: {
    create: async (order: OrderRequest): Promise<void> => {
      const res = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      if (!res.ok) throw new Error('Failed to place order');
    }
  }
};