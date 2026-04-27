import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import StarRating from '../components/StarRating';
import ConfirmModal from '../components/ConfirmModal';
import Loader from '../components/Loader';
import {
  getStatusBadgeClass,
  getInitials, formatDate, formatFullDate
} from '../utils/helpers';
import {
  HiOutlineArrowUp, HiOutlinePencil, HiOutlineTrash,
  HiOutlineArrowLeft, HiOutlineChatAlt2
} from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function FeedbackDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState(null);

  useEffect(() => {
    fetchFeedback();
  }, [id]);

  const fetchFeedback = async () => {
    try {
      const res = await api.get(`/feedback/${id}`);
      setFeedback(res.data.feedback);
    } catch {
      toast.error('Feedback not found');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    try {
      const res = await api.post(`/feedback/${id}/upvote`);
      setFeedback(prev => ({ ...prev, upvotes: res.data.upvotes }));
    } catch {
      toast.error('Failed to toggle upvote');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmittingComment(true);
    try {
      const res = await api.post(`/feedback/${id}/comment`, { text: commentText });
      setFeedback(prev => ({ ...prev, comments: res.data.comments }));
      setCommentText('');
      toast.success('Comment added');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteFeedback = async () => {
    try {
      await api.delete(`/feedback/${id}`);
      toast.success('Feedback deleted');
      navigate(`/board/${feedback.project}`);
    } catch {
      toast.error('Failed to delete feedback');
    }
    setShowDelete(false);
  };

  const handleDeleteComment = async () => {
    if (!deleteCommentId) return;
    try {
      const res = await api.delete(`/feedback/${id}/comment/${deleteCommentId}`);
      setFeedback(prev => ({ ...prev, comments: res.data.comments }));
      toast.success('Comment deleted');
    } catch {
      toast.error('Failed to delete comment');
    }
    setDeleteCommentId(null);
  };

  if (loading) return <Loader text="Loading feedback..." />;
  if (!feedback) return null;

  const hasUpvoted = feedback.upvotes?.some(u => (u._id || u) === user?._id);
  const isAuthor = feedback.author?._id === user?._id;
  const isAdmin = user?.role === 'admin';
  const isProjectOwner = feedback.project?.owner === user?._id || feedback.project?.owner?._id === user?._id;
  
  const canEdit = isAuthor || isAdmin;
  const canDelete = isAuthor || isAdmin || isProjectOwner;
  
  // Author name logic
  let authorName = 'Anonymous';
  if (feedback.isAnonymous && !isAuthor && !isAdmin) {
    authorName = 'Anonymous';
  } else if (feedback.author) {
    authorName = feedback.author.name;
  } else if (feedback.guestEmail) {
    authorName = feedback.guestEmail.split('@')[0] + ' (Guest)';
  }

  return (
    <div className="page-enter detail-container">
      <button className="btn btn-ghost mb-4" onClick={() => navigate(-1)}>
        <HiOutlineArrowLeft /> Back
      </button>

      {/* Header */}
      <div className="detail-header">
        <h1 className="detail-title">{feedback.title}</h1>
        <div className="detail-meta">
          <span className={`badge ${getStatusBadgeClass(feedback.status)}`}>{feedback.status}</span>
          <span style={{ color: 'var(--text-3)', fontSize: '0.78rem' }}>
            {formatFullDate(feedback.createdAt)}
          </span>
        </div>

        {(canEdit || canDelete) && (
          <div className="flex gap-2">
            {canEdit && (
              <button className="btn btn-sm btn-secondary" onClick={() => navigate(`/feedback/${id}/edit`)} title="Edit">
                <HiOutlinePencil /> Edit
              </button>
            )}
            {canDelete && (
              <button className="btn btn-sm btn-danger" onClick={() => setShowDelete(true)} title="Delete">
                <HiOutlineTrash /> Delete
              </button>
            )}
          </div>
        )}
      </div>

      {/* Attachment Image */}
      {feedback.image && (
        <div style={{ margin: '24px 0', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
          <a href={feedback.image} target="_blank" rel="noreferrer">
            <img 
              src={feedback.image} 
              alt="Attachment" 
              style={{ width: '100%', maxHeight: 400, objectFit: 'contain', backgroundColor: '#000' }} 
            />
          </a>
        </div>
      )}

      {/* Description */}
      <div className="detail-description">{feedback.description}</div>

      {/* Custom Answers */}
      {feedback.customAnswers?.length > 0 && (
        <div style={{ margin: '24px 0', padding: 20, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid var(--glass-border)' }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>Additional Info</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {feedback.customAnswers.map((answer, i) => (
              <div key={i}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-2)', marginBottom: 4 }}>{answer.label}</div>
                <div style={{ fontSize: '1rem', color: 'var(--text-1)', fontWeight: 500 }}>{answer.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Grid */}
      <div className="detail-sidebar-info">
        <div className="detail-info-item">
          <div className="detail-info-label">Author</div>
          <div className="detail-info-value flex items-center gap-2">
            <div className="feedback-card-author-avatar" style={{ width: 24, height: 24, fontSize: '0.6rem' }}>
              {getInitials(authorName)}
            </div>
            {authorName}
          </div>
        </div>
        <div className="detail-info-item">
          <div className="detail-info-label">Rating</div>
          <div className="detail-info-value"><StarRating value={feedback.rating} readonly size="1.1rem" /></div>
        </div>
        <div className="detail-info-item">
          <div className="detail-info-label">Upvotes</div>
          <div className="detail-info-value">{feedback.upvotes?.length || 0}</div>
        </div>
        {feedback.assignedTo && (
          <div className="detail-info-item">
            <div className="detail-info-label">Assigned To</div>
            <div className="detail-info-value">{feedback.assignedTo?.name || 'Unassigned'}</div>
          </div>
        )}
      </div>

      {/* Tags */}
      {feedback.tags?.length > 0 && (
        <div style={{ margin: '16px 0' }}>
          <div className="detail-info-label mb-2">Tags</div>
          <div className="flex flex-wrap gap-2">
            {feedback.tags.map((t, i) => <span key={i} className="tag">{t}</span>)}
          </div>
        </div>
      )}

      {/* Upvote Button */}
      <div style={{ margin: '24px 0' }}>
        <button
          className={`upvote-btn ${hasUpvoted ? 'active' : ''}`}
          onClick={handleUpvote}
          id="detail-upvote"
          style={{ padding: '8px 20px', fontSize: '0.88rem' }}
        >
          <HiOutlineArrowUp /> {hasUpvoted ? 'Upvoted' : 'Upvote'} ({feedback.upvotes?.length || 0})
        </button>
      </div>

      {/* Comments */}
      <div className="comments-section">
        <h3 className="comments-title">
          <HiOutlineChatAlt2 style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />
          Comments ({feedback.comments?.length || 0})
        </h3>

        <form className="comment-form" onSubmit={handleComment}>
          <input
            type="text"
            className="form-input"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            id="comment-input"
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!commentText.trim() || submittingComment}
            id="comment-submit"
          >
            {submittingComment ? '...' : 'Post'}
          </button>
        </form>

        {feedback.comments?.length === 0 ? (
          <p style={{ color: 'var(--text-3)', fontSize: '0.8rem', textAlign: 'center', padding: 20 }}>
            No comments yet. Be the first to comment!
          </p>
        ) : (
          feedback.comments?.map(comment => (
            <div key={comment._id} className="comment-item">
              <div className="comment-avatar">
                {getInitials(comment.user?.name)}
              </div>
              <div className="comment-body">
                <div>
                  <span className="comment-author">{comment.user?.name || 'Unknown'}</span>
                  <span className="comment-date">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="comment-text">{comment.text}</p>
                {(comment.user?._id === user?._id || isAdmin) && (
                  <div className="comment-actions">
                    <button
                      className="btn btn-sm btn-ghost"
                      style={{ color: 'var(--red)', fontSize: '0.72rem' }}
                      onClick={() => setDeleteCommentId(comment._id)}
                    >
                      <HiOutlineTrash /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Feedback Modal */}
      <ConfirmModal
        isOpen={showDelete}
        title="Delete Feedback"
        message="Are you sure you want to delete this feedback? This action cannot be undone."
        confirmText="Delete"
        danger
        onConfirm={handleDeleteFeedback}
        onCancel={() => setShowDelete(false)}
      />

      {/* Delete Comment Modal */}
      <ConfirmModal
        isOpen={!!deleteCommentId}
        title="Delete Comment"
        message="Are you sure you want to delete this comment?"
        confirmText="Delete"
        danger
        onConfirm={handleDeleteComment}
        onCancel={() => setDeleteCommentId(null)}
      />
    </div>
  );
}
