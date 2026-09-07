
import PaymentMethods from './PaymentMethods';
import Spark from './Spark';



const Copyright = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-300">
      <div className="flex items-center gap-2">
        <span className="font-bold text-white text-sm tracking-tight">Amarzone</span>
        <Spark className="w-4 h-4 text-[#ffc220]" />
        <span>&copy; 2026 Amarzone. All Rights Reserved.</span>
      </div>

      <PaymentMethods />
    </div>
  );
}

export default Copyright;
