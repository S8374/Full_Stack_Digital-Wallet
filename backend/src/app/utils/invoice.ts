// src/utils/pdfGenerator.ts
import PDFDocument from 'pdfkit';
import AppError from '../errorHelpers/appError';

export interface IPaymentInvoiceData {
  transactionId: string;
  paymentDate: Date;
  userName: string;
  userEmail: string;
  paymentType: string;
  amount: number;
  status: string;
  reference: string;
  paymentMethod: string;
  walletBalance?: number;
}

export const generatePaymentInvoicePdf = async (invoiceData: IPaymentInvoiceData): Promise<Buffer> => {
  try {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      // Add logo or header
      doc.fontSize(20).fillColor('#2c5aa0').text('DIGITAL WALLET', 50, 50);
      doc.fontSize(10).fillColor('#666').text('Secure Digital Transactions', 50, 75);
      
      // Draw line
      doc.moveTo(50, 90).lineTo(550, 90).strokeColor('#2c5aa0').lineWidth(2).stroke();
      
      // Invoice title
      doc.fontSize(16).fillColor('#000').text('PAYMENT INVOICE', 50, 110, { align: 'center' });
      
      // Invoice details section
      doc.fontSize(12).fillColor('#000');
      doc.text('Invoice Details:', 50, 150);
      
      // Create table for invoice details
      const detailsY = 170;
      doc.text('Transaction ID:', 50, detailsY);
      doc.text(invoiceData.transactionId, 200, detailsY);
      
      doc.text('Payment Date:', 50, detailsY + 20);
      doc.text(invoiceData.paymentDate.toLocaleString(), 200, detailsY + 20);
      
      doc.text('Payment Status:', 50, detailsY + 40);
      doc.text(invoiceData.status, 200, detailsY + 40);
      
      doc.text('Payment Method:', 50, detailsY + 60);
      doc.text(invoiceData.paymentMethod, 200, detailsY + 60);
      
      doc.text('Reference:', 50, detailsY + 80);
      doc.text(invoiceData.reference, 200, detailsY + 80);
      
      // Customer details
      doc.text('Customer Details:', 50, detailsY + 120);
      doc.text('Name:', 50, detailsY + 140);
      doc.text(invoiceData.userName, 200, detailsY + 140);
      
      doc.text('Email:', 50, detailsY + 160);
      doc.text(invoiceData.userEmail, 200, detailsY + 160);
      
      // Payment summary
      doc.moveTo(50, detailsY + 200).lineTo(550, detailsY + 200).strokeColor('#ccc').lineWidth(1).stroke();
      
      doc.fontSize(14).fillColor('#2c5aa0').text('Payment Summary', 50, detailsY + 220);
      
      doc.fontSize(12).fillColor('#000');
      doc.text('Payment Type:', 50, detailsY + 250);
      doc.text(invoiceData.paymentType, 200, detailsY + 250);
      
      doc.text('Amount:', 50, detailsY + 270);
      doc.fontSize(14).fillColor('#2c5aa0').text(`$${invoiceData.amount.toFixed(2)}`, 200, detailsY + 270);
      
      // Wallet balance if available
      if (invoiceData.walletBalance !== undefined) {
        doc.fontSize(12).fillColor('#000');
        doc.text('New Wallet Balance:', 50, detailsY + 300);
        doc.fontSize(14).fillColor('#2c5aa0').text(`$${invoiceData.walletBalance.toFixed(2)}`, 200, detailsY + 300);
      }
      
      // Footer
      doc.moveTo(50, 650).lineTo(550, 650).strokeColor('#ccc').lineWidth(1).stroke();
      doc.fontSize(10).fillColor('#666').text('Thank you for using our Digital Wallet service!', 50, 670, { align: 'center' });
      doc.text('For any queries, contact support@digitalwallet.com', 50, 685, { align: 'center' });
      doc.text('This is an automated invoice, no signature required.', 50, 700, { align: 'center' });

      doc.end();
    });
  } catch (error: any) {
    console.error('PDF generation error:', error);
    throw new AppError(500, `PDF creation error: ${error.message}`);
  }
};