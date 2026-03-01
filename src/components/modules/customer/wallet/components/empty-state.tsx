import { CreditCard } from "lucide-react";

export const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-dashed border-gray-200">
    <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
      <CreditCard className="h-8 w-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-1">No cards added</h3>
    <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
      Please make a order so your card will automatically be saved .
    </p>
  </div>
);
