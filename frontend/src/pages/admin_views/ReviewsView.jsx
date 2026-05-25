import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, MessageSquare } from 'lucide-react';

const ReviewsView = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://127.0.0.1:5000/api/admin/reviews', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReviews(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="admin-view animate-fade-in">
      <div className="view-header">
        <h2>Customer Feedback</h2>
        <p className="text-muted">Monitor and moderate product reviews and ratings.</p>
      </div>
      <div className="table-responsive glass">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Product</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="5">Loading real reviews...</td></tr>
            ) : reviews.length === 0 ? (
              <tr><td colSpan="5">No reviews yet.</td></tr>
            ) : (
              reviews.map(rev => (
                <tr key={rev.id}>
                  <td><strong>{rev.user}</strong></td>
                  <td>{rev.product}</td>
                  <td>
                    <div className="flex-center" style={{justifyContent: 'flex-start', color: '#fbbf24'}}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < rev.rating ? '#fbbf24' : 'transparent'} />
                      ))}
                    </div>
                  </td>
                  <td style={{maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                    <MessageSquare size={14} style={{display: 'inline', marginRight: '4px', verticalAlign: 'middle'}}/>
                    {rev.comment}
                  </td>
                  <td>{rev.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ReviewsView;
