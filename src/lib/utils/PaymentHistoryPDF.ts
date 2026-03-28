import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePaymentHistoryPDF = (
  orders: any[],
  summary: any,
  userEmail: string = "",
  userName: string = "",
) => {
  const doc = new jsPDF();

  // Brand / Header
  doc.setFontSize(22);
  doc.setTextColor(52, 104, 83); // Emerald color
  doc.text("JayakHub", 15, 20);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Iraq's Premier Food Delivery", 15, 25);

  doc.setFontSize(24);
  doc.setTextColor(220); // Light gray
  doc.text("BILLING", 195, 25, { align: "right" });

  // Separator
  doc.setLineWidth(0.5);
  doc.setDrawColor(240);
  doc.line(15, 35, 195, 35);

  // Customer Details
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text("CUSTOMER DETAILS", 15, 45);

  doc.setFontSize(11);
  doc.setTextColor(0);
  const finalCustomerName = String(userName || "Guest User");
  doc.text(finalCustomerName, 15, 52);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(String(userEmail || "N/A"), 15, 57);

  // Summary Metrics
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text("SUMMARY", 110, 45);

  const detailsX = 110;
  const valuesX = 195;
  let currentY = 52;
  const lineHeight = 6;

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Total Orders", detailsX, currentY);
  doc.setTextColor(0);
  doc.text(
    String(summary?.totalOrdersCount || orders.length || 0),
    valuesX,
    currentY,
    {
      align: "right",
    },
  );

  currentY += lineHeight;
  doc.setTextColor(100);
  doc.text("Total Spend", detailsX, currentY);
  doc.setTextColor(0);
  doc.text(
    `$${Number(summary?.totalSpend || 0).toFixed(2)}`,
    valuesX,
    currentY,
    {
      align: "right",
    },
  );

  // Table configuration
  const tableStartY = 75;

  const tableData: any[][] = [];

  // Iterate over each order to generate its main row and then its item rows
  orders.forEach((order) => {
    const timing = `${order.orderDate || ""} ${order.orderTime || ""}`.trim();

    // Order Main Row
    tableData.push([
      {
        content: String(order.orderId || "N/A"),
        styles: { fontStyle: "bold", textColor: 40 },
      },
      {
        content: String(timing || "N/A"),
        styles: { fontStyle: "bold", textColor: 40 },
      },
      {
        content: String(order.restaurantName || "N/A"),
        styles: { fontStyle: "bold", textColor: 40 },
      },
      {
        content: String(order.paymentMethod || "N/A").toUpperCase(),
        styles: { fontStyle: "bold", textColor: 40 },
      },
      {
        content: String(order.status || "N/A").toUpperCase(),
        styles: { fontStyle: "bold", textColor: 40 },
      },
      {
        content: `$${(Number(order.totalAmount || 0) + 10).toFixed(2)}`,
        styles: { fontStyle: "bold", textColor: 40 },
      },
    ]);

    // Order Items
    const items = Array.isArray(order.items) ? order.items : [];

    if (items.length > 0) {
      items.forEach((item: any, index: number) => {
        const prefix = index === items.length - 1 ? "   " : "   ";
        const bullet = index === items.length - 1 ? "└" : "├";

        tableData.push([
          {
            content: `${prefix}${bullet} ${item.name || "Item"}`,
            colSpan: 3,
            styles: { textColor: 100, fontSize: 8 },
          },
          {
            content: `${item.quantity || 0}x`,
            styles: { textColor: 100, fontSize: 8 },
          },
          {
            content: `$${Number(item.price || 0).toFixed(2)}`,
            styles: { textColor: 100, fontSize: 8 },
          },
          {
            content: `$${(Number(item.price || 0) * (item.quantity || 0)).toFixed(2)}`,
            styles: { textColor: 100, fontSize: 8 },
          },
        ]);
      });

      // Add Delivery Fee
      tableData.push([
        {
          content: `   └ Delivery Fee`,
          colSpan: 5,
          styles: { textColor: 100, fontSize: 8 },
        },
        {
          content: `$10.00`,
          styles: { textColor: 100, fontSize: 8 },
        },
      ]);
    } else {
      tableData.push([
        {
          content: `   └ No items`,
          colSpan: 6,
          styles: { textColor: 150, fontStyle: "italic", fontSize: 8 },
        },
      ]);
    }
  });

  autoTable(doc, {
    startY: tableStartY,
    head: [
      [
        "ORDER ID / ITEM",
        "DATE",
        "RESTAURANT",
        "METHOD / Qty",
        "STATUS / PRICE",
        "TOTAL",
      ],
    ],
    body: tableData,
    theme: "plain",
    styles: {
      fontSize: 9,
      cellPadding: 4,
      textColor: 50,
    },
    headStyles: {
      fillColor: [249, 250, 251], // Gray 50
      textColor: 150,
      fontSize: 8,
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 25 },
      2: { cellWidth: 35 },
      3: { cellWidth: 30 },
      4: { cellWidth: 30 },
      5: { cellWidth: 25 },
    },
    willDrawCell: function (data) {
      if (
        data.row.raw &&
        Array.isArray(data.row.raw) &&
        (data.row.raw[0] as any)?.styles?.fontStyle === "bold" &&
        data.row.index > 0
      ) {
        doc.setDrawColor(240);
        doc.setLineWidth(0.2);
        doc.line(
          data.cell.x,
          data.cell.y,
          data.cell.x + data.cell.width,
          data.cell.y,
        );
      }
    },
  });

  // Save
  doc.save(`Billing_${new Date().toISOString().split("T")[0]}.pdf`);
};
