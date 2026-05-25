import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CreditCard, DollarSign } from 'lucide-react';

const PaymentsView = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://127.0.0.1:5000/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Sort by newest first
        setPayments(res.data.sort((a, b) => b.id - a.id));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="admin-view animate-fade-in">
      <div className="view-header">
        <h2>Payment Tracking</h2>
        <p className="text-muted">Transaction IDs, revenue tracking, and refunds.</p>
      </div>
      <div className="table-responsive glass">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Order ID</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="6">Loading payments...</td></tr>
            ) : payments.length === 0 ? (
              <tr><td colSpan="6">No payments found.</td></tr>
            ) : (
              payments.map(pay => (
                <tr key={pay.id}>
                  <td><strong>TXN-{pay.id.toString().padStart(4, '0')}</strong></td>
                  <td>#{pay.id}</td>
                  <td>₹{pay.total_amount.toFixed(2)}</td>
                  <td>Online Payment</td>
                  <td>{pay.created_at.split(' ')[0]}</td>
                  <td>
                    <span className={`status-badge ${pay.status === 'refunded' ? 'status-pending' : 'status-completed'}`}>
                      {pay.status === 'refunded' ? 'Refunded' : 'Completed'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default PaymentsView;
