import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import StarRating from '../components/StarRating';
import Loader from '../components/Loader';
import { HiOutlineArrowLeft, HiOutlineSave } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function FeedbackEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'General',
    priority: 'Medium',
    rating: 3,
    isAnonymous: false,
    customAnswers: []
  });

  useEffect(() => {
    fetchFeedback();
  }, [id]);

  const fetchFeedback = async () => {
    try {
      const res = await api.get(`/feedback/${id}`);
      const f = res.data.feedback;
      setForm({
        title: f.title,
        description: f.description,
        category: f.category,
        priority: f.priority,
        rating: f.rating,
        isAnonymous: f.isAnonymous,
        customAnswers: f.customAnswers || []
      });
    } catch {
      toast.error('Failed to load feedback');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomAnswerChange = (index, value) => {
    const updated = [...form.customAnswers];
    updated[index].value = value;
    setForm({ ...form, customAnswers: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put(`/feedback/${id}`, form);
      toast.success('Feedback updated successfully!');
      navigate(`/feedback/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader text="Loading editor..." />;

  return (
    <div className="page-enter" style={{ maxWidth: 600, margin: '0 auto', padding: '24px' }}>
      <button className="btn btn-ghost mb-4" onClick={() => navigate(-1)}>
        <HiOutlineArrowLeft /> Back
      </button>

      <div style={{ 
        backgroundColor: '#ffffff', 
        padding: '32px', 
        borderRadius: '12px', 
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--glass-shadow)'
      }}>
        <h1 style={{ 
          fontFamily: 'var(--font-display)', 
          fontSize: '1.8rem', 
          fontWeight: 800, 
          marginBottom: 24,
          color: 'var(--text-1)'
        }}>Edit Feedback</h1>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>

          {/* Category & Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="General">General</option>
                <option value="Bug">Bug</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Improvement">Improvement</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Rating */}
          <div className="form-group">
            <label className="form-label">Rating</label>
            <div style={{ padding: '8px 0' }}>
              <StarRating 
                value={form.rating} 
                onChange={(val) => setForm({ ...form, rating: val })} 
              />
            </div>
          </div>

          {/* Custom Answers */}
          {form.customAnswers.length > 0 && (
            <div style={{ 
              marginTop: 24, 
              paddingTop: 24, 
              borderTop: '1px solid var(--glass-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: 20
            }}>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--text-3)', textTransform: 'uppercase', fontWeight: 700 }}>Additional Info</h3>
              {form.customAnswers.map((answer, i) => (
                <div key={i} className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">{answer.label}</label>
                  {answer.type === 'textarea' ? (
                    <textarea
                      className="form-textarea"
                      value={answer.value}
                      onChange={(e) => handleCustomAnswerChange(i, e.target.value)}
                      style={{ minHeight: 80 }}
                    />
                  ) : answer.type === 'rating' ? (
                    <StarRating 
                      value={parseInt(answer.value) || 0} 
                      onChange={(val) => handleCustomAnswerChange(i, val.toString())} 
                    />
                  ) : (
                    <input
                      type="text"
                      className="form-input"
                      value={answer.value}
                      onChange={(e) => handleCustomAnswerChange(i, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Anonymous Toggle */}
          <div className="form-group" style={{ marginTop: 24 }}>
            <label className="form-checkbox">
              <input
                type="checkbox"
                checked={form.isAnonymous}
                onChange={(e) => setForm({ ...form, isAnonymous: e.target.checked })}
              />
              <span>Submit anonymously</span>
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: 24 }}
            disabled={submitting}
          >
            <HiOutlineSave /> {submitting ? 'Saving...' : 'Update Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
}
