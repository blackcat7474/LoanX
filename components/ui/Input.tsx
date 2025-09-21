
import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<InputProps> = (props) => {
  return (
    <input
      {...props}
      className={`mt-1 block w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-500
        focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
        disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed
        ${props.className || ''}`}
    />
  );
};

export default Input;
