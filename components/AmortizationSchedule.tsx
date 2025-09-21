
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loan } from '../types';
import { generateAmortizationSchedule } from '../services/loanCalculator';
import Card from './ui/Card';

interface AmortizationScheduleProps {
  loan: Loan;
}

const AmortizationSchedule: React.FC<AmortizationScheduleProps> = ({ loan }) => {
  const schedule = useMemo(() => generateAmortizationSchedule(loan.principal, loan.interestRate, loan.term), [loan]);

  const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <Card>
      <h3 className="text-xl font-semibold mb-4 text-sky-300">Amortization Schedule</h3>
      <div className="h-80 w-full mb-6">
        <ResponsiveContainer>
          <AreaChart data={schedule} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis tickFormatter={(tick) => `₹${(tick / 100000).toFixed(1)}L`} stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                borderColor: '#38bdf8',
                color: '#e2e8f0',
              }}
              formatter={(value: number) => formatCurrency(value)}
            />
            <Area type="monotone" dataKey="remainingBalance" stackId="1" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.3} name="Remaining Balance" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="max-h-96 overflow-y-auto rounded-lg border border-slate-700">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs text-sky-300 uppercase bg-slate-800 sticky top-0">
            <tr>
              <th scope="col" className="px-6 py-3">Month</th>
              <th scope="col" className="px-6 py-3">Payment</th>
              <th scope="col" className="px-6 py-3">Principal</th>
              <th scope="col" className="px-6 py-3">Interest</th>
              <th scope="col" className="px-6 py-3">Balance</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((p) => (
              <tr key={p.month} className="bg-slate-900 border-b border-slate-700 hover:bg-slate-800/50">
                <td className="px-6 py-4">{p.month}</td>
                <td className="px-6 py-4">{formatCurrency(p.payment)}</td>
                <td className="px-6 py-4">{formatCurrency(p.principal)}</td>
                <td className="px-6 py-4">{formatCurrency(p.interest)}</td>
                <td className="px-6 py-4 font-medium">{formatCurrency(p.remainingBalance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default AmortizationSchedule;