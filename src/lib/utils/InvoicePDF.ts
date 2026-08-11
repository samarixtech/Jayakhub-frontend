import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatOrderDateTime, formatOrderDateTimeFromISO } from "@/lib/utils/date";

export const generateInvoicePDF = (
  order: any,
  userEmail: string = "",
  userName: string = "",
  formatPrice: (amount: number) => string = (n) => `$${n.toFixed(2)}`,
) => {
  const doc = new jsPDF();

  // Brand / Header
  doc.setFontSize(22);
  doc.setTextColor(52, 104, 83); // Emerald color
  doc.text("JayakHub", 15, 20);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Iraq's Premier Food Delivery", 15, 25);

  doc.setFontSize(30);
  doc.setTextColor(220); // Light gray
  doc.text("INVOICE", 195, 25, { align: "right" });

  // Separator
  doc.setLineWidth(0.5);
  doc.setDrawColor(240);
  doc.line(15, 35, 195, 35);

  // Bill To
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text("BILL TO", 15, 45);

  doc.setFontSize(11);
  doc.setTextColor(0);
  // Priority: profile name -> order user name -> customer name -> payment owner name
  const finalCustomerName = String(
    userName ||
      order.userName ||
      order.customerName ||
      order.paymentDetails?.ownerName ||
      "Valued Customer",
  );
  doc.text(finalCustomerName, 15, 52);

  doc.setFontSize(10);
  doc.setTextColor(100);

  // Robust address extraction
  const rawAddress =
    typeof order.address === "string"
      ? order.address
      : order.address?.fullAddress ||
        order.fullAddress ||
        order.shippingAddress ||
        "N/A";

  const addressLines = String(rawAddress).split(",");
  let addrY = 57;
  addressLines.slice(0, 3).forEach((line: string) => {
    doc.text(line.trim(), 15, addrY);
    addrY += 5;
  });

  // User email
  doc.text(String(userEmail || order.customerEmail || order.email || "N/A"), 15, addrY + 2);

  // Invoice Details
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text("INVOICE DETAILS", 110, 45);

  const detailsX = 110;
  const valuesX = 195;
  let currentY = 52;
  const lineHeight = 6;

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Invoice Number", detailsX, currentY);
  doc.setTextColor(0);
  doc.text(String(order.orderId || order._id || "N/A"), valuesX, currentY, {
    align: "right",
  });

  currentY += lineHeight;
  doc.setTextColor(100);
  doc.text("Date Issued", detailsX, currentY);
  doc.setTextColor(0);
  const timing = order.rawTimestamp
    ? formatOrderDateTimeFromISO(order.rawTimestamp)
    : `${order.orderDate || ""} ${order.orderTime || ""}`.trim();
  doc.text(timing || "N/A", valuesX, currentY, { align: "right" });

  currentY += lineHeight;
  doc.setTextColor(100);
  doc.text("Payment Method", detailsX, currentY);
  doc.setTextColor(0);
  const payMethod = String(order.paymentMethod || "N/A").toUpperCase();
  doc.text(payMethod, valuesX, currentY, { align: "right" });

  currentY += lineHeight;
  doc.setTextColor(100);
  doc.text("Transaction ID", detailsX, currentY);
  doc.setTextColor(0);
  const transactionId = String(
    order.transactionId || order.riderOrderId || order.paymentDetails?.transactionId || order.orderId || "N/A"
  );
  doc.text(transactionId.substring(0, 20), valuesX, currentY, {
    align: "right",
  });

  // Table Setup
  const tableStartY = Math.max(addrY + 15, 85);

  const dealsArr = Array.isArray(order.deals) ? order.deals : [];
  const allItems = Array.isArray(order.items) ? order.items : [];

  // Collect deal item IDs
  const dealItemIds = new Set<string>();
  dealsArr.forEach((deal: any) => {
    if (Array.isArray(deal.items)) {
      deal.items.forEach((di: any) => {
        if (di.itemId) dealItemIds.add(String(di.itemId));
        if (di.id) dealItemIds.add(String(di.id));
      });
    }
  });

  // Filter standalone items
  const standaloneItems = allItems.filter((item: any) => {
    if (item.name?.toLowerCase() === "delivery fee") return false;
    if (item.dealId || item.isDealItem || item.parentDealId) return false;
    const idToCheck = String(item.itemId || item.id || item.orderItemId || "");
    if ((!item.price || Number(item.price) === 0) && idToCheck && dealItemIds.has(idToCheck)) {
      return false;
    }
    return true;
  });

  const tableData: any[] = [];
  let calculatedSubtotal = 0;

  // Add Deals to PDF Table
  dealsArr.forEach((deal: any) => {
    const qty = Number(deal.quantity || 1);
    const unitPrice = Number(deal.price ?? deal.dealPrice ?? deal.totalPrice ?? deal.amount ?? 0);
    const totalPrice = unitPrice * qty;
    calculatedSubtotal += totalPrice;

    let title = `${deal.title || deal.name || "Deal"} (Combo Deal)`;
    if (deal.items && Array.isArray(deal.items) && deal.items.length > 0) {
      const itemNames = deal.items.map((i: any) => `${i.quantity || 1}x ${i.name}`).join(", ");
      title += `\nIncluded: ${itemNames}`;
    }

    tableData.push([title, qty, formatPrice(unitPrice), formatPrice(totalPrice)]);
  });

  // Add Standalone Items to PDF Table
  standaloneItems.forEach((item: any) => {
    const qty = Number(item.quantity || 1);
    const unitPrice = Number(item.price || 0);
    const totalPrice = unitPrice * qty;
    calculatedSubtotal += totalPrice;

    tableData.push([item.name || "Item", qty, formatPrice(unitPrice), formatPrice(totalPrice)]);
  });

  autoTable(doc, {
    startY: tableStartY,
    head: [["ITEM DESCRIPTION", "Qty", "UNIT PRICE", "TOTAL"]],
    body: tableData,
    theme: "plain",
    styles: {
      fontSize: 10,
      cellPadding: 8,
      textColor: 50,
    },
    headStyles: {
      fillColor: [249, 250, 251], // Gray 50
      textColor: 150,
      fontSize: 9,
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 80 }, // Description
      1: { cellWidth: 25 }, // Qty
      2: { cellWidth: 35 }, // Unit Price
      3: { cellWidth: 40 }, // Total
    },
  });

  const lastTableBottom =
    (doc as any).lastAutoTable?.finalY || tableStartY + 20;
  const bottomY = lastTableBottom + 10;

  // Totals Section
  const subTotalAmount =
    order.subtotal != null ? Number(order.subtotal) : calculatedSubtotal;
  const deliveryFee = Number(order.deliveryFee || 0);
  const couponDiscount = order.coupon?.discountAmount
    ? Number(order.coupon.discountAmount)
    : 0;

  const finalTotalAmount = Number(
    order.totalAmount || Math.max(0, subTotalAmount + deliveryFee - couponDiscount)
  );

  // Right align totals
  const rightColLabelX = 130;
  const rightColValueX = 195;
  let summaryLineY = bottomY;

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Subtotal", rightColLabelX, summaryLineY);
  doc.setTextColor(0);
  doc.text(formatPrice(subTotalAmount), rightColValueX, summaryLineY, {
    align: "right",
  });

  summaryLineY += 7;
  doc.setTextColor(100);
  doc.text("Delivery Fee", rightColLabelX, summaryLineY);
  doc.setTextColor(0);
  doc.text(
    deliveryFee === 0 ? "Free" : formatPrice(deliveryFee),
    rightColValueX,
    summaryLineY,
    { align: "right" }
  );

  if (couponDiscount > 0) {
    summaryLineY += 7;
    doc.setTextColor(100);
    doc.text(`Coupon (${order.coupon?.code || ""})`, rightColLabelX, summaryLineY);
    doc.setTextColor(52, 104, 83);
    doc.text(`-${formatPrice(couponDiscount)}`, rightColValueX, summaryLineY, {
      align: "right",
    });
  }

  // Divider
  doc.setDrawColor(230);
  doc.line(rightColLabelX, summaryLineY + 5, 195, summaryLineY + 5);

  // Grand Total
  summaryLineY += 14;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(52, 104, 83); // Emerald
  doc.text("Total Paid", rightColLabelX, summaryLineY);
  doc.text(formatPrice(finalTotalAmount), rightColValueX, summaryLineY, {
    align: "right",
  });

  // Save
  doc.save(`Invoice_${order.orderId || "Order"}.pdf`);
};
