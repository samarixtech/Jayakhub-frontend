import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoicePDF = (order: any) => {
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
  doc.text("INVOICE", 150, 25, { align: "right" });

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
  doc.text(order.paymentDetails?.ownerName || "Guest User", 15, 52);
  doc.setFontSize(10);
  doc.setTextColor(100);
  // Mock address since not in payload
  doc.text("123 Main Street, Apt 4B", 15, 57);
  doc.text("Baghdad, Iraq 10001", 15, 62);
  doc.text("user@example.com", 15, 67);

  // Invoice Details
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text("INVOICE DETAILS", 110, 45);

  const detailsX = 110;
  const valuesX = 160;
  let currentY = 52;
  const lineHeight = 6;

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Invoice Number", detailsX, currentY);
  doc.setTextColor(0);
  doc.text(`#INV-${order.orderId.substring(0, 8)}`, valuesX, currentY);

  currentY += lineHeight;
  doc.setTextColor(100);
  doc.text("Date Issued", detailsX, currentY);
  doc.setTextColor(0);
  doc.text(order.orderDate, valuesX, currentY);

  currentY += lineHeight;
  doc.setTextColor(100);
  doc.text("Payment Method", detailsX, currentY);
  doc.setTextColor(0);
  const cardInfo =
    order.paymentDetails?.cardType === "Cash/Other"
      ? "Cash on Delivery"
      : `${order.paymentDetails?.cardType || "Card"} •• ${order.paymentDetails?.cardNumber?.slice(-4) || "XXXX"}`;
  doc.text(cardInfo, valuesX, currentY);

  currentY += lineHeight;
  doc.setTextColor(100);
  doc.text("Transaction ID", detailsX, currentY);
  doc.setTextColor(0);
  doc.text(`tx_${order.orderId.substring(0, 10)}`, valuesX, currentY);

  // Table
  const tableSeparation = 15; // gap between header and table
  const tableStartY = 85;

  const tableData = order.items.map((item: any) => [
    item.name,
    item.quantity,
    `$${Number(item.price).toFixed(2)}`,
    `$${(Number(item.price) * item.quantity).toFixed(2)}`,
  ]);

  // Service Fee Row
  tableData.push(["Service Fee", "1", "$2.50", "$2.50"]);

  autoTable(doc, {
    startY: tableStartY,
    head: [["ITEM DESCRIPTION", "QTY", "UNIT PRICE", "TOTAL"]],
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
      1: { cellWidth: 20, halign: "center" }, // Qty
      2: { cellWidth: 40, halign: "right" }, // Unit Price
      3: { cellWidth: 40, halign: "right" }, // Total
    },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;

  // Totals Section
  const itemTotal = order.items.reduce(
    (acc: number, item: any) => acc + Number(item.price) * item.quantity,
    0,
  );
  const serviceFee = 2.5;
  const calcTotal = itemTotal + serviceFee;

  // Right align totals
  const rightColX = 140;
  const valColX = 190;
  let totalY = finalY;

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Subtotal", rightColX, totalY);
  doc.setTextColor(0);
  doc.text(`$${itemTotal.toFixed(2)}`, valColX, totalY, { align: "right" });

  totalY += 8;
  doc.setTextColor(100);
  doc.text("Tax (0%)", rightColX, totalY);
  doc.setTextColor(0);
  doc.text("$0.00", valColX, totalY, { align: "right" });

  totalY += 8;
  doc.setTextColor(100);
  doc.text("Delivery Fee", rightColX, totalY);
  doc.setTextColor(0);
  doc.text("Free", valColX, totalY, { align: "right" });

  // Divider
  doc.setDrawColor(230);
  doc.line(rightColX, totalY + 5, 195, totalY + 5);

  // Grand Total
  totalY += 15;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(52, 104, 83); // Emerald
  doc.text("Total Paid", rightColX, totalY);
  doc.text(`$${calcTotal.toFixed(2)}`, valColX, totalY, { align: "right" });

  // Save
  doc.save(`Invoice_${order.orderId}.pdf`);
};
