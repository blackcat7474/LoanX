import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc, getDoc, query, where, getDocs } from 'firebase/firestore';
import { db, firebaseError } from './services/firebase';
import { Customer, Loan } from './types';
import Header from './components/Header';
import CompanyView from './components/CompanyView';
import CustomerView from './components/CustomerView';
import Login from './components/Login';
import CompanyLogin from './components/CompanyLogin';
import Spinner from './components/ui/Spinner';
import Card from './components/ui/Card';
import Toast from './components/ui/Toast';

type UserRole = 'company' | 'customer';

interface ToastState {
  message: string;
  type: 'success' | 'error';
}

const App: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(firebaseError);

  const [userRole, setUserRole] = useState<UserRole>('customer');
  const [authenticatedCustomer, setAuthenticatedCustomer] = useState<Customer | null>(null);
  const [isCompanyAuthenticated, setIsCompanyAuthenticated] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };


  useEffect(() => {
    if (error) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = collection(db, 'customers');
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const customersData: Customer[] = [];
      querySnapshot.forEach((doc) => {
        customersData.push({ ...doc.data(), id: doc.id } as Customer);
      });
      setCustomers(customersData);
      setLoading(false);
    }, (err) => {
      console.error("Firebase subscription error: ", err);
      setError("Failed to connect to the database. Please check your internet connection and Firebase setup.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [error]);

  const handleLogin = async (mobileNumber: string): Promise<boolean> => {
    const q = query(collection(db, "customers"), where("mobileNumber", "==", mobileNumber));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const customerDoc = querySnapshot.docs[0];
      setAuthenticatedCustomer({ ...customerDoc.data(), id: customerDoc.id } as Customer);
      return true;
    }
    return false;
  };

  const handleCompanyLogin = async (username: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (username === 'irfuu' && password === '#Irfan@2013') {
      setIsCompanyAuthenticated(true);
      return true;
    }
    return false;
  }

  const handleLogout = () => {
    setAuthenticatedCustomer(null);
  };
  
  const handleCompanyLogout = () => {
    setIsCompanyAuthenticated(false);
  }
  
  const switchRole = (role: UserRole) => {
    setUserRole(role);
    handleLogout();
    handleCompanyLogout();
  }

  const handleAddLoan = async (customerId: string, loan: Omit<Loan, 'id'>) => {
    const newLoan = { ...loan, id: new Date().toISOString() };
    const customerRef = doc(db, 'customers', customerId);
    try {
      const customerSnap = await getDoc(customerRef);
      if (customerSnap.exists()) {
        const customerData = customerSnap.data();
        const updatedLoans = [...(customerData.loans || []), newLoan];
        await updateDoc(customerRef, { loans: updatedLoans });
        showToast('Loan added successfully!', 'success');
      }
    } catch (err) {
      console.error("Error adding loan: ", err);
      showToast('Failed to add loan.', 'error');
    }
  };

  const handleUpdateLoan = async (customerId: string, updatedLoan: Loan) => {
    const customerRef = doc(db, 'customers', customerId);
    try {
      const customerSnap = await getDoc(customerRef);
      if (customerSnap.exists()) {
        const customerData = customerSnap.data();
        const updatedLoans = customerData.loans.map((l: Loan) => l.id === updatedLoan.id ? updatedLoan : l);
        await updateDoc(customerRef, { loans: updatedLoans });
        showToast('Loan updated successfully!', 'success');
      }
    } catch (err) {
        console.error("Error updating loan: ", err);
        showToast('Failed to update loan.', 'error');
    }
  };

  const handleDeleteLoan = async (customerId: string, loanId: string) => {
    const customerRef = doc(db, 'customers', customerId);
    try {
      const customerSnap = await getDoc(customerRef);
      if (customerSnap.exists()) {
        const customerData = customerSnap.data();
        const updatedLoans = customerData.loans.filter((l: Loan) => l.id !== loanId);
        await updateDoc(customerRef, { loans: updatedLoans });
        showToast('Loan deleted successfully!', 'success');
      }
    } catch (err) {
        console.error("Error deleting loan: ", err);
        showToast('Failed to delete loan.', 'error');
    }
  };

  const handleAddCustomer = async (customerData: Omit<Customer, 'id' | 'loans'>) => {
    try {
      const newCustomer = { ...customerData, loans: [] };
      await addDoc(collection(db, 'customers'), newCustomer);
      showToast('Customer added successfully!', 'success');
    } catch (err) {
      console.error("Error adding customer: ", err);
      showToast('Failed to add customer.', 'error');
    }
  };

  const handleUpdateCustomer = async (updatedCustomer: Omit<Customer, 'loans'>) => {
    try {
      const customerRef = doc(db, 'customers', updatedCustomer.id);
      await updateDoc(customerRef, {
        name: updatedCustomer.name,
        mobileNumber: updatedCustomer.mobileNumber,
      });
      showToast('Customer updated successfully!', 'success');
    } catch (err) {
      console.error("Error updating customer: ", err);
      showToast('Failed to update customer.', 'error');
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    try {
      await deleteDoc(doc(db, 'customers', customerId));
      showToast('Customer deleted successfully!', 'success');
    } catch (err) {
      console.error("Error deleting customer: ", err);
      showToast('Failed to delete customer.', 'error');
    }
  };
  
  const renderContent = () => {
    if (error) {
      return (
        <div className="flex justify-center items-center pt-16">
          <Card className="max-w-lg w-full text-center bg-red-900/50 border-red-700">
            <h2 className="text-2xl font-bold mb-4 text-red-300">Configuration Error</h2>
            <p className="text-red-200">{error}</p>
          </Card>
        </div>
      );
    }
    
    if (loading) {
      return (
        <div className="flex justify-center items-center pt-24">
          <Spinner />
          <span className="ml-4 text-lg text-slate-300">Loading Data...</span>
        </div>
      );
    }

    if (userRole === 'company') {
      if (isCompanyAuthenticated) {
        return (
          <CompanyView
            customers={customers}
            onAddCustomer={handleAddCustomer}
            onUpdateCustomer={handleUpdateCustomer}
            onDeleteCustomer={handleDeleteCustomer}
            onAddLoan={handleAddLoan}
            onUpdateLoan={handleUpdateLoan}
            onDeleteLoan={handleDeleteLoan}
          />
        );
      }
      return <CompanyLogin onLogin={handleCompanyLogin} />
    }
    
    // Customer role
    if (authenticatedCustomer) {
      // Find the latest customer data from state, in case it was updated in real-time
      const currentCustomerData = customers.find(c => c.id === authenticatedCustomer.id) || authenticatedCustomer;
      return <CustomerView customer={currentCustomerData} />;
    }
    return <Login onLogin={handleLogin} />;
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      <Header 
        userRole={userRole} 
        setUserRole={switchRole} 
        authenticatedCustomer={authenticatedCustomer}
        onLogout={handleLogout}
        isCompanyAuthenticated={isCompanyAuthenticated}
        onCompanyLogout={handleCompanyLogout}
      />
      <main className="container mx-auto p-4 md:p-8">
        {renderContent()}
      </main>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default App;