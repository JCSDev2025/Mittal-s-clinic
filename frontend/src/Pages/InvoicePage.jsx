import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Logo from '../assets/Logo.webp';

const InvoicePage = () => {
  const { id } = useParams();
  const [bill, setBill] = useState(null);
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Invoice_${id}`,
  });

  const handleDownloadPDF = async () => {
    if (!componentRef.current) return;

    const canvas = await html2canvas(componentRef.current, {
      scale: 2,
      useCORS: true,
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Invoice_${id}.pdf`);
  };

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const response = await axios.get(`/api/bills/${id}`);
        setBill(response.data);
      } catch (error) {
        console.error('Failed to fetch bill details:', error);
      }
    };
    fetchBill();
  }, [id]);

  if (!bill) {
    return (
      <div className="text-center mt-10 text-xl text-gray-500">Loading invoice...</div>
    );
  }

  const invoiceNumber = `INV-${parseInt(id.slice(-4), 16) % 1000 + 1}`;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex flex-col items-center space-y-4">
      {/* Buttons (Hidden on Print) */}
      <div className="space-x-4 no-print">
        <button
          onClick={handlePrint}
          className="px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 shadow"
        >
          Print Invoice
        </button>
        <button
          onClick={handleDownloadPDF}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 shadow"
        >
          Download PDF
        </button>
      </div>

      {/* Invoice Content - A4 layout */}
      <div
        ref={componentRef}
        className="bg-white w-full max-w-[794px] p-8 rounded shadow-lg text-sm"
        style={{
          minHeight: '1122px', // A4 height in pixels at 96dpi
          boxSizing: 'border-box',
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mt-24">
          <div>
            <h1 className="text-xl font-bold text-green-700">Mittal's Hair Skin & Laser</h1>
            <p className="text-gray-600">Mittal's Wellness</p>
            <p>Swathi Theatre Rd</p>
            <p>Alankar Sweets and Bakers</p>
            <p>Bhavanipuram, V D Puram</p>
            <p>Vijayawada, Andhra Pradesh 520012</p>
          </div>
          <img src={Logo} alt="Clinic Logo" className="w-24 h-24 object-contain" />
        </div>

        {/* Invoice Info */}
        <div className="flex justify-between mb-4  my-20">
          <div>
            <h2 className="font-bold text-gray-700">Bill To:</h2>
            <p>{bill.clientName}</p>
          </div>
          <div className="text-right">
            <p><strong>Invoice No:</strong> {invoiceNumber}</p>
            <p><strong>Invoice Date:</strong> {bill.date?.split('T')[0]}</p>
          </div>
        </div>

        {/* Service Table */}
        <table className="w-full border border-gray-300 mb-4 text-xs my-16">
          <thead className="bg-green-100 text-green-800">
            <tr>
              <th className="border px-2 py-1 text-left">Sl.</th>
              <th className="border px-2 py-1 text-left">Service</th>
              <th className="border px-2 py-1 text-left">Doctor</th>
              <th className="border px-2 py-1 text-center">Total Sessions</th>
              <th className="border px-2 py-1 text-center">Completed</th>
              <th className="border px-2 py-1 text-right">Cost (₹)</th>
              <th className="border px-2 py-1 text-left">Payment</th>
              <th className="border px-2 py-1 text-left">Remarks</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-green-50">
              <td className="border px-2 py-1">1</td>
              <td className="border px-2 py-1">{bill.services}</td>
              <td className="border px-2 py-1">{bill.assignedDoctor}</td>
              <td className="border px-2 py-1 text-center">{bill.totalSessions}</td>
              <td className="border px-2 py-1 text-center">{bill.sessionsCompleted}</td>
              <td className="border px-2 py-1 text-right">{parseFloat(bill.cost).toFixed(2)}</td>
              <td className="border px-2 py-1">{bill.paymentMethod || '-'}</td>
              <td className="border px-2 py-1">{bill.notes || '-'}</td>
            </tr>
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mt-12">
          <div className="w-full max-w-sm space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{parseFloat(bill.totalAmount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total (Incl. 18% GST)</span>
              <span className="font-semibold text-gray-800">₹{parseFloat(bill.totalAmount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Paid</span>
              <span className="text-green-700">₹{parseFloat(bill.amountPaid).toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-1 font-semibold">
              <span>Balance Due</span>
              <span className="text-red-600">₹{parseFloat(bill.pendingAmount).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="mt-12 text-sm">
          <h3 className="font-bold text-gray-700">Payment Instructions:</h3>
          <p>Pay via UPI, Cash, or Cheque to: <strong>Mittal's Clinic</strong></p>
        </div>

        {/* Thank You Note */}
        <div className="mt-32 text-center text-green-700 font-semibold text-base italic">
          Thank you for choosing Mittal's Clinic. Wishing you good health and happiness!
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
