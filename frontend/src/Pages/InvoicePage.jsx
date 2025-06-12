import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Logo from '../assets/Logo.webp';

const InvoicePage = () => {
  const { id } = useParams();
  const [bill, setBill] = useState(null);
  const componentRef = useRef(null);

  const handlePrint = () => {
    const originalContent = document.body.innerHTML;
    const printArea = componentRef.current.innerHTML;
    document.body.innerHTML = printArea;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // reload to restore original view
  };

  const handleDownloadPDF = async () => {
    if (!componentRef.current) return;

    if (typeof html2canvas === 'undefined' || typeof window.jspdf === 'undefined') {
      alert('PDF libraries are not loaded. Please check CDN script tags in index.html.');
      return;
    }

    const canvas = await html2canvas(componentRef.current, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new window.jspdf.jsPDF('p', 'mm', 'a4');
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
        console.error('Failed to fetch bill:', error);
      }
    };
    fetchBill();
  }, [id]);

  if (!bill) {
    return <div className="text-center mt-10 text-xl text-gray-500">Loading invoice...</div>;
  }

  const invoiceNumber = `INV-${parseInt(id.slice(-6), 16) % 100000 + 1}`;
  const formatCurrency = (amount) =>
    amount == null || isNaN(amount) ? '₹0.00' : `₹${parseFloat(amount).toFixed(2)}`;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex flex-col items-center">
      {/* Buttons */}
      <div className="space-x-4 mb-6 no-print">
        <button
          onClick={handlePrint}
          className="px-6 py-2 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 shadow-md"
        >
          Print Invoice
        </button>
        <button
          onClick={handleDownloadPDF}
          className="px-6 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 shadow-md"
        >
          Download PDF
        </button>
      </div>

      {/* Invoice Content */}
      <div
        ref={componentRef}
        className="bg-white w-full max-w-[210mm] min-h-[297mm] p-8 sm:p-12 shadow-2xl relative"
        style={{ boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' }}
      >
        {/* Header */}
        <div className="flex justify-between items-start pb-8 border-b border-gray-200 mb-8">
          <div>
            <img src={Logo} alt="Clinic Logo" className="w-24 h-24 mb-4 object-contain" />
            <h1 className="text-xl font-bold text-blue-800">Mittal's Hair Skin & Laser</h1>
            <p className="text-sm text-gray-700">Mittal's Wellness</p>
            <p className="text-xs text-gray-600">Swathi Theatre Rd, Alankar Sweets</p>
            <p className="text-xs text-gray-600">Bhavanipuram, V D Puram</p>
            <p className="text-xs text-gray-600">Vijayawada, Andhra Pradesh 520012</p>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 uppercase">Invoice</h2>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Invoice No:</span> {invoiceNumber}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Issue Date:</span> {bill.date?.split('T')[0]}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Due Date:</span> {bill.date?.split('T')[0]}
            </p>
          </div>
        </div>

        {/* Client Details */}
        <div className=" flex mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">Bill To:</h3>
          <p className=" px-3 text-lg font-medium text-gray-800">{bill.clientName}</p>
        </div>

        {/* Services Table */}
        <table className="w-full text-sm text-left table-auto border-collapse mb-12">
          <thead>
            <tr className="bg-blue-100 text-blue-800 uppercase text-xs font-semibold">
              <th className="py-3 px-4 border-b border-blue-200 text-lg">Description</th>
              <th className="py-3 px-4 border-b border-blue-200 text-center text-lg">Qty</th>
              <th className="py-3 px-4 border-b border-blue-200 text-right text-lg">Unit Price</th>
              <th className="py-3 px-4 border-b border-blue-200 text-right text-lg">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200 hover:bg-blue-50">
              <td className="py-3 px-4 text-gray-800">{bill.services}</td>
              <td className="py-3 px-4 text-center text-gray-700">1</td>
              <td className="py-3 px-4 text-right text-gray-700">{formatCurrency(bill.cost)}</td>
              <td className="py-3 px-4 text-right text-gray-800 font-medium">{formatCurrency(bill.cost)}</td>
            </tr>
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-12">
          <div className="w-full sm:w-1/2 md:w-1/3 space-y-1">
            <div className="flex justify-between items-center py-2 px-4 text-gray-700">
              <span className="font-semibold">Subtotal:</span>
              <span>{formatCurrency(bill.cost)}</span>
            </div>
            <div className="flex justify-between items-center py-2 px-4 text-gray-700 border-t border-gray-200">
              <span className="font-semibold">GST (18%):</span>
              <span>{formatCurrency(bill.totalAmount - bill.cost)}</span>
            </div>
            <div className="flex justify-between items-center py-3 px-4 bg-blue-50 text-gray-800 font-bold text-lg rounded-b-lg border-t border-blue-200">
              <span>TOTAL:</span>
              <span>{formatCurrency(bill.totalAmount)}</span>
            </div>
            <div className="flex justify-between items-center py-2 px-4 text-gray-700 border-t border-gray-200">
              <span className="font-semibold">Amount Paid:</span>
              <span>{formatCurrency(bill.amountPaid)}</span>
            </div>
            <div className="flex justify-between items-center py-2 px-4 text-gray-700 border-t border-gray-200">
              <span className="font-semibold">Pending Amount:</span>
              <span>{formatCurrency(bill.totalAmount - bill.amountPaid)}</span>
            </div>
            
          </div>
        </div>

        {/* Footer Notes */}
        <div className="absolute bottom-16 left-12 right-12">
          <div className="flex justify-between items-end">
            <div className="text-xs text-gray-600">
              <p className="font-semibold">Notes:</p>
              <p className="mb-1">{bill.notes || 'N/A'}</p>
              <p className="font-semibold">Payment Method:</p>
              <p>{bill.paymentMethod || 'N/A'}</p>
              <p className="font-semibold mt-2">Sessions Info:</p>
              <p>Total: {bill.totalSessions || 0}</p>
              <p>Completed: {bill.sessionsCompleted || 0}</p>
              <p>Pending: {(bill.totalSessions - bill.sessionsCompleted) || 0}</p>
            </div>
            <div className="text-right text-xs text-gray-600">
              <p className="font-semibold text-blue-700">Mittal's Hair Skin & Laser</p>
              <p>Thank you for your business!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
