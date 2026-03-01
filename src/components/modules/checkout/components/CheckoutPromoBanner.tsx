export const CheckoutPromoBanner = () => {
  return (
    <div className="w-full bg-[#346853] rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between text-white shadow-lg relative overflow-hidden">
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-1">
          Sign up to get free delivery on
        </h2>
        <h2 className="text-2xl font-bold">your first order</h2>
      </div>
      {/* Simple Logo Placeholder */}
      <div className="flex items-center gap-2 mt-4 md:mt-0 relative z-10">
        <div className="text-right">
          <h3 className="font-black text-xl tracking-tight">JAYAK HUB</h3>
          <p className="text-[10px] tracking-widest opacity-80">
            Iraq's Premier Food Delivery Platform
          </p>
        </div>
      </div>
    </div>
  );
};
