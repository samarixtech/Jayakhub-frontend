import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Temporary types - ideally move to a types file
export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  status: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
}

interface OrderDetailsSheetProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onAccept?: (orderId: string) => void;
}

const OrderDetailsSheet: React.FC<OrderDetailsSheetProps> = ({
  order,
  isOpen,
  onClose,
  onAccept,
}) => {
  if (!order) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md p-0 overflow-y-auto">
        {/* Header */}
        <SheetHeader className="p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-lg font-bold text-gray-900">
                Order {order.id}
              </SheetTitle>
              <p className="text-xs text-gray-500 font-medium">{order.date}</p>
            </div>
            <SheetClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-gray-100"
              >
                <X className="w-4 h-4 text-gray-500" />
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>

        <div className="p-6 space-y-6">
          {/* Status */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              Status
            </h4>
            <span className="text-sm font-bold text-gray-900">
              {order.status}
            </span>
          </div>

          {/* Customer */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              Customer
            </h4>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
                {order.customerName.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  {order.customerName}
                </p>
                <p className="text-xs text-gray-500">{order.customerPhone}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Items */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              Items
            </h4>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <span className="text-sm font-bold text-gray-900 w-6">
                      {item.quantity}x
                    </span>
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Payment Summary */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              Payment Summary
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900 font-medium">
                  ${order.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax</span>
                <span className="text-gray-900 font-medium">
                  ${order.tax.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold mt-2 pt-2 border-t border-gray-100">
                <span className="text-gray-900">Total</span>
                <span className="text-emerald-600">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 sticky bottom-0">
          <div className="flex gap-3 justify-end">
            <SheetClose asChild>
              <Button variant="ghost" className="font-semibold text-gray-600">
                Close
              </Button>
            </SheetClose>
            <Button
              className="bg-primary hover:bg-primary/90 text-white font-bold"
              onClick={() => onAccept && onAccept(order.id)}
            >
              Accept Order
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default OrderDetailsSheet;
