import React from 'react';

const PaymentMethods = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="px-2.5 py-1 bg-white text-[#0071dc] font-black text-xs rounded shadow-sm">
        VISA
      </div>
      <div className="px-2.5 py-1 bg-white text-slate-900 font-bold text-xs rounded shadow-sm flex items-center gap-1">
        <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block -ml-2" />
      </div>
      <div className="px-2.5 py-1 bg-[#006fcf] text-white font-black text-[10px] rounded shadow-sm">
        AMEX
      </div>
      <div className="px-2.5 py-1 bg-white text-[#003087] font-black text-xs rounded shadow-sm italic">
        PayPal
      </div>
    </div>
  );
}

export default PaymentMethods;
