import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';

interface ExportPDFOptions {
    element: HTMLElement | null;
    filename: string;
    onSuccess?: () => void;
    onError?: (error: any) => void;
}

/**
 * Utility to export an HTML element to a PDF file.
 * We use html-to-image instead of html2canvas because it handles modern
 * CSS features like `oklch` colors much better by relying on native browser rendering.
 */
export const exportToPDF = async ({ element, filename, onSuccess, onError }: ExportPDFOptions) => {
    if (!element) {
        console.error("No element provided for PDF export");
        return;
    }

    try {
        // We get the high quality PNG from the DOM element
        const dataUrl = await toPng(element, {
            quality: 1,
            pixelRatio: 2,
            backgroundColor: '#ffffff',
            style: {
                transform: 'scale(1)',
                transformOrigin: 'top left'
            }
        });

        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;

        const pageHeight = pdf.internal.pageSize.getHeight();
        let heightLeft = pdfHeight;
        let position = 0;

        // Add first page
        pdf.addImage(dataUrl, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;

        // Add subsequent pages if the content is taller than A4
        while (heightLeft >= 0) {
            position = heightLeft - pdfHeight;
            pdf.addPage();
            pdf.addImage(dataUrl, "PNG", 0, position, pdfWidth, pdfHeight);
            heightLeft -= pageHeight;
        }

        // Trigger download
        pdf.save(filename);

        toast.success("PDF downloaded successfully!");
        if (onSuccess) onSuccess();

    } catch (error: any) {
        console.error("Error generating PDF:", error);
        toast.error(`Failed to export PDF: ${error.message || "Unknown error occurred"}`);
        if (onError) onError(error);
    }
};
