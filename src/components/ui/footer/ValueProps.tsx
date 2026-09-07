import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Headset } from 'lucide-react';

const VALUE_PROPS = [
  {
    icon: Truck,
    title: 'Free shipping with no minimum',
    description: 'Restrictions apply. Free 2-day delivery',
  },
  {
    icon: RotateCcw,
    title: 'Free & easy returns',
    description: '90-day return policy for peace of mind',
  },
  {
    icon: ShieldCheck,
    title: 'Amarzone Protection',
    description: '100% money back guarantee on orders',
  },
  {
    icon: Headset,
    title: '24/7 Customer Care',
    description: 'Live chat & instant phone support',
  },
];

const ValueProps = () => {
  return (
    <div className="bg-[#004f9a] py-6 px-4 sm:px-6 lg:px-8 border-b border-blue-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-white">
        {VALUE_PROPS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#ffc220] shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">{item.title}</h4>
                <p className="text-[11px] text-blue-200">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ValueProps;
