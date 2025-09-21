
import React, { useState, useMemo } from 'react';
import { Loan } from '../types';
import { calculateMonthlyPayment, generateAmortizationSchedule } from '../services/loanCalculator';
import { getRepaymentAdvice } from '../services/geminiService';
import Input from './ui/Input';
import Button from './ui/Button';
import Card from './ui/Card';
import Spinner from './ui/Spinner';

interface PaymentStrategyProps {
  loan: Loan;
}

const PaymentStrategy: React.FC<PaymentStrategyProps> = ({ loan }) => {
  const [extraPayment, setExtraPayment] = useState(0);
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const standardMonthlyPayment = useMemo(() => calculateMonthlyPayment(loan.principal, loan.interestRate, loan.term), [loan]);
  
  const { savings, earlyPayoffMonths } = useMemo(() => {
    if (extraPayment <= 0) {
      return { savings: 0, earlyPayoffMonths: 0 };
    }
    const standardSchedule = generateAmortizationSchedule(loan.principal, loan.interestRate, loan.term);
    const acceleratedSchedule = generateAmortizationSchedule(loan.principal, loan.interestRate, loan.term, extraPayment);

    const standardTotalInterest = standardSchedule.reduce((acc, p) => acc + p.interest, 0);
    const acceleratedTotalInterest = acceleratedSchedule.reduce((acc, p) => acc + p.interest, 0);

    const savings = standardTotalInterest - acceleratedTotalInterest;
    const earlyPayoffMonths = standardSchedule.length - acceleratedSchedule.length;

    return { savings, earlyPayoffMonths };
  }, [loan, extraPayment]);
  
  const handleGetAIAdvice = async () => {
    setIsLoading(true);
    setAiAdvice('');
    try {
      const advice = await getRepaymentAdvice(loan, extraPayment, standardMonthlyPayment);
      setAiAdvice(advice);
    } catch (error) {
      console.error("Error fetching AI advice:", error);
      setAiAdvice("Sorry, I couldn't fetch advice at the moment. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatAdvice = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          // FIX: Use replace with a global regex for wider compatibility instead of replaceAll.
          return <p key={index} className="font-bold text-lg my-2 text-sky-300">{line.replace(/\*\*/g, '')}</p>;
        }
        if (line.startsWith('* ')) {
          return <li key={index} className="ml-5 list-disc">{line.substring(2)}</li>;
        }
        return <p key={index} className="mb-2">{line}</p>;
      })
      .reduce((acc, elem) => acc.concat(elem), [] as JSX.Element[]);
  };

  return (
    <Card>
      <h3 className="text-xl font-semibold mb-4 text-sky-300">Repayment Strategy Analyzer</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div>
          <label htmlFor="extraPayment" className="block text-sm font-medium text-slate-300">Extra Monthly Payment (₹)</label>
          <Input 
            id="extraPayment"
            type="number"
            value={extraPayment || ''}
            onChange={(e) => setExtraPayment(parseFloat(e.target.value) || 0)}
            placeholder="e.g., 10000"
          />
          {extraPayment > 0 && (
            <div className="mt-4 space-y-2 p-4 bg-slate-800 rounded-lg">
              <div className="flex justify-between items-baseline">
                <span className="text-slate-400">Interest Saved:</span>
                <span className="text-2xl font-bold text-emerald-400">₹{savings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-slate-400">Paid Off Early by:</span>
                <span className="text-2xl font-bold text-emerald-400">{earlyPayoffMonths} months</span>
              </div>
            </div>
          )}
          <Button onClick={handleGetAIAdvice} disabled={isLoading || extraPayment <= 0} className="mt-4 w-full">
            {isLoading ? <Spinner /> : 'Get AI-Powered Insights'}
          </Button>
        </div>
        <div className="min-h-[150px] bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <h4 className="font-semibold text-slate-200 mb-2">Gemini's Analysis:</h4>
          {isLoading && <div className="flex justify-center items-center h-full"><Spinner /></div>}
          {aiAdvice && <div className="text-slate-300 prose prose-invert prose-sm max-w-none">{formatAdvice(aiAdvice)}</div>}
          {!aiAdvice && !isLoading && <p className="text-slate-400 text-sm">Enter an extra payment amount and click the button to get personalized advice.</p>}
        </div>
      </div>
    </Card>
  );
};

export default PaymentStrategy;