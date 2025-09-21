
import { AmortizationPayment } from '../types';

export const calculateMonthlyPayment = (principal: number, annualRate: number, termMonths: number): number => {
  if (principal <= 0 || termMonths <= 0) return 0;
  if (annualRate <= 0) return principal / termMonths;

  const monthlyRate = annualRate / 100 / 12;
  const numerator = monthlyRate * Math.pow(1 + monthlyRate, termMonths);
  const denominator = Math.pow(1 + monthlyRate, termMonths) - 1;
  const payment = principal * (numerator / denominator);
  
  return payment;
};

export const generateAmortizationSchedule = (
  principal: number,
  annualRate: number,
  termMonths: number,
  extraPayment: number = 0
): AmortizationPayment[] => {
  const schedule: AmortizationPayment[] = [];
  let remainingBalance = principal;
  
  const monthlyRate = annualRate / 100 / 12;
  const standardMonthlyPayment = calculateMonthlyPayment(principal, annualRate, termMonths);
  const totalMonthlyPayment = standardMonthlyPayment + extraPayment;

  if (principal <= 0) return [];

  for (let month = 1; month <= termMonths * 2 && remainingBalance > 0; month++) {
    const interest = remainingBalance * monthlyRate;
    let actualPayment = totalMonthlyPayment;

    if (remainingBalance + interest < totalMonthlyPayment) {
      actualPayment = remainingBalance + interest;
    }
    
    const principalPaid = actualPayment - interest;
    remainingBalance -= principalPaid;

    if (remainingBalance < 0.01) {
        remainingBalance = 0;
    }

    schedule.push({
      month,
      payment: actualPayment,
      principal: principalPaid,
      interest,
      remainingBalance,
    });

    if (remainingBalance <= 0) break;
  }

  return schedule;
};
