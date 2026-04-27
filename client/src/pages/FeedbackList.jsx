import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import FeedbackCard from '../components/FeedbackCard';
import FilterBar from '../components/FilterBar';
import Pagination from '../components/Pagination';
import { SkeletonCard } from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { HiOutlinePlusCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function FeedbackList() {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 0 });
  const [filters, setFilters] = useState({ search: '', status: '', category: '', priority: '', sort: '-createdAt' });
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      Object.entries(filters).forEach(([key, val]) => {
        if (val) params[key] = val;
      });
      const res = await api.get('/feedback', { params });
      setFeedbacks(res.data.feedbacks);
      setPagination(res.data.pagination);
    } catch {
      toast.error('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timeout = setTimeout(() => fetchFeedbacks(1), 300);
    return () => clearTimeout(timeout);
  }, [fetchFeedbacks]);

  const handleUpvote = async (id) => {
    try {
      const res = await api.post(`/feedback/${id}/upvote`);
      setFeedbacks(prev => prev.map(f =>
        f._id === id ? { ...f, upvotes: res.data.upvotes } : f
      ));
    } catch {
      toast.error('Failed to upvote');
    }
  };

  return (
    <div className="page-enter">
      <div className="page-header">
        <h1 className="page-title">Feedback</h1>
        <Link to="/feedback/new" className="btn btn-primary">
          <HiOutlinePlusCircle /> Submit
        </Link>
      </div>

      <FilterBar filters={filters} onFilterChange={(update) => setFilters(prev => ({ ...prev, ...update }))} />

      {loading ? (
        <div className="cards-grid">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : feedbacks.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No results"
          message={filters.search ? 'Try different search terms or filters.' : 'No feedback submitted yet.'}
          action={!filters.search && <Link to="/feedback/new" className="btn btn-primary btn-sm">Submit Feedback</Link>}
        />
      ) : (
        <>
          <p style={{ marginBottom: 10, fontSize: '0.75rem', color: 'var(--text-3)' }}>
            {pagination.total} result{pagination.total !== 1 ? 's' : ''}
          </p>
          <div className="cards-grid">
            {feedbacks.map(fb => (
              <FeedbackCard key={fb._id} feedback={fb} onUpvote={handleUpvote} currentUserId={user?._id} />
            ))}
          </div>
          <Pagination pagination={pagination} onPageChange={(page) => fetchFeedbacks(page)} />
        </>
      )}
    </div>
  );
}
