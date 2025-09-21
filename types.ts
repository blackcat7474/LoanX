export type LoanStatus = 'Active' | 'Paid Off' | 'Default';

export interface Loan {
  id: string;
  name: string; // A user-defined name for the loan, e.g., "Main Home Loan"
  loanType: string; // The category of the loan, e.g., 'Home', 'Car'
  principal: number;
  interestRate: number; // Annual percentage rate
  term: number; // In months
  dueDate: string; // e.g., '2024-08-05'
  status: LoanStatus;
}

export interface Customer {
  id: string;
  name: string;
  mobileNumber: string; // Registered mobile number for login
  loans: Loan[];
}

export interface AmortizationPayment {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}