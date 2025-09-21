import React, { useState, useEffect } from 'react';
import { Customer } from '../types';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';

interface CustomerFormProps {
  onSubmit: (customerData: Omit<Customer, 'id' | 'loans'> | Omit<Customer, 'loans'>) => void;
  initialData?: Customer | null;
  onCancel: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ onSubmit, initialData, onCancel }) => {
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setMobileNumber(initialData.mobileNumber);
    } else {
      setName('');
      setMobileNumber('');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
      alert('Please fill out all fields with a valid 10-digit mobile number.');
      return;
    }
    
    const customerData = { name, mobileNumber };

    if (initialData) {
      onSubmit({ ...customerData, id: initialData.id });
    } else {
      onSubmit(customerData);
    }
  };
  
  const isEditMode = !!initialData;

  return (
    <Card className="bg-slate-700/50">
      <h3 className="text-xl font-semibold mb-4 text-sky-300">{isEditMode ? 'Edit Customer' : 'Add New Customer'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-slate-300">Customer Name</label>
          <Input id="customerName" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Rohan Sharma" />
        </div>
        <div>
          <label htmlFor="mobileNumber" className="block text-sm font-medium text-slate-300">Mobile Number</label>
          <Input id="mobileNumber" type="tel" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} placeholder="e.g., 9876543210" maxLength={10} />
        </div>
        <div className="flex gap-4">
          <Button type="button" onClick={onCancel} className="w-full bg-slate-600 hover:bg-slate-500">Cancel</Button>
          <Button type="submit" className="w-full">{isEditMode ? 'Update Customer' : 'Add Customer'}</Button>
        </div>
      </form>
    </Card>
  );
};

export default CustomerForm;