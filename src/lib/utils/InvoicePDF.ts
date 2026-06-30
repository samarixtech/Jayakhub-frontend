import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

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
  // Priority: profile name -> order customer name -> payment owner name
  const finalCustomerName = String(
    userName ||
      order.customerName ||
      order.paymentDetails?.ownerName ||
      "Guest User",
  );
  doc.text(finalCustomerName, 15, 52);

  doc.setFontSize(10);
  doc.setTextColor(100);

  // Use actual address from order with fallback check
  const rawAddress = String(
    order.address || order.fullAddress || order.shippingAddress || "N/A",
  );
  const addressLines = rawAddress.split(",");
  let addrY = 57;
  addressLines.slice(0, 3).forEach((line: string) => {
    doc.text(line.trim(), 15, addrY);
    addrY += 5;
  });

  // User email
  doc.text(String(userEmail || order.customerEmail || "N/A"), 15, addrY + 2);

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
  // Invoice Number label and show Order ID there
  doc.text("Invoice Number", detailsX, currentY);
  doc.setTextColor(0);
  doc.text(String(order.orderId || "N/A"), valuesX, currentY, {
    align: "right",
  });

  currentY += lineHeight;
  doc.setTextColor(100);
  doc.text("Date Issued", detailsX, currentY);
  doc.setTextColor(0);
  const timing = `${order.orderDate || ""} ${order.orderTime || ""}`.trim();
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

  // Very robust transaction ID check
  doc.text(
    String(order.transactionId || "N/A").substring(0, 20),
    valuesX,
    currentY,
    { align: "right" },
  );

  // Table
  const tableStartY = Math.max(addrY + 15, 85);

  const allItems = Array.isArray(order.items) ? order.items : [];
  // Exclude any "Delivery Fee" line item — it's shown separately in the totals
  const itemsArr = allItems.filter(
    (item: any) => item.name?.toLowerCase() !== "delivery fee",
  );
  const tableData = itemsArr.map((item: any) => [
    item.name || "Item",
    item.quantity || 0,
    formatPrice(Number(item.price || 0)),
    formatPrice(Number(item.price || 0) * (item.quantity || 0)),
  ]);

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
  const subTotalAmount = itemsArr.reduce(
    (acc: number, item: any) =>
      acc + Number(item.price || 0) * (item.quantity || 0),
    0,
  );
  const deliveryFee = Number(order.deliveryFee || 0);
  const finalTotalAmount = Number(order.totalAmount || subTotalAmount + deliveryFee);

  // Right align totals
  const rightColLabelX = 140;
  const rightColValueX = 195;
  let summaryLineY = bottomY;

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Subtotal", rightColLabelX, summaryLineY);
  doc.setTextColor(0);
  doc.text(formatPrice(subTotalAmount), rightColValueX, summaryLineY, {
    align: "right",
  });

  summaryLineY += 8;
  doc.setTextColor(100);
  doc.text("Delivery Fee", rightColLabelX, summaryLineY);
  doc.setTextColor(0);
  doc.text(formatPrice(deliveryFee), rightColValueX, summaryLineY, {
    align: "right",
  });

  // Divider
  doc.setDrawColor(230);
  doc.line(rightColLabelX, summaryLineY + 5, 195, summaryLineY + 5);

  // Grand Total
  summaryLineY += 15;
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
