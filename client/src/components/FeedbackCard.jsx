import { useNavigate } from 'react-router-dom';
import { HiOutlineArrowUp, HiOutlineChatAlt2, HiOutlinePhotograph, HiOutlineTrash } from 'react-icons/hi';
import { getStatusBadgeClass, getInitials, formatDate } from '../utils/helpers';
import StarRating from './StarRating';

export default function FeedbackCard({ feedback, onUpvote, onDelete, currentUserId }) {
  const navigate = useNavigate();

  const hasUpvoted = feedback.upvotes?.some(u => (u._id || u) === currentUserId);
  const isAuthor = feedback.author?._id === currentUserId || (typeof feedback.author === 'string' && feedback.author === currentUserId);
  
  // Author logic: User > Guest Email > Anonymous
  let authorName = 'Anonymous';
  if (feedback.isAnonymous) {
    authorName = 'Anonymous';
  } else if (feedback.author) {
    authorName = feedback.author.name || 'User';
  } else if (feedback.guestEmail) {
    authorName = feedback.guestEmail.split('@')[0] + ' (Guest)';
  }

  return (
    <div
      className="feedback-card"
      onClick={() => navigate(`/feedback/${feedback._id}`)}
      id={`feedback-card-${feedback._id}`}
    >
      <div className="feedback-card-header">
        <h3 className="feedback-card-title">{feedback.title}</h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {feedback.image && (
            <div className="feedback-card-image-indicator" title="Has attachment">
              <HiOutlinePhotograph style={{ color: 'var(--accent)', fontSize: '1.1rem' }} />
            </div>
          )}
          {onDelete && (
            <button 
              className="btn-icon-danger"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(feedback._id);
              }}
              title="Delete Feedback"
              style={{ padding: 4, borderRadius: 4 }}
            >
              <HiOutlineTrash />
            </button>
          )}
        </div>
      </div>

      <div className="feedback-card-badges" style={{ alignItems: 'center', gap: 12 }}>
        <span className={`badge ${getStatusBadgeClass(feedback.status)}`}>{feedback.status}</span>
        {feedback.rating && (
          <div style={{ pointerEvents: 'none' }}>
            <StarRating value={feedback.rating} readonly size="1rem" />
          </div>
        )}
      </div>

      <p className="feedback-card-description">{feedback.description}</p>

      {feedback.image && (
        <div className="feedback-card-preview-img" style={{ marginBottom: 12, borderRadius: 4, overflow: 'hidden', height: 100, border: '1px solid var(--glass-border)' }}>
          <img 
            src={feedback.image} 
            alt="Feedback" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>
      )}

      <div className="feedback-card-footer">
        <div className="feedback-card-author">
          <div className="feedback-card-author-avatar">
            {getInitials(authorName)}
          </div>
          <div>
            <div style={{ color: 'var(--text-1)', fontWeight: 500, fontSize: '0.75rem' }}>{authorName}</div>
            <div style={{ fontSize: '0.65rem' }}>{formatDate(feedback.createdAt)}</div>
          </div>
        </div>

        <div className="feedback-card-stats">
          <div className="feedback-card-stat">
            <HiOutlineChatAlt2 /> {feedback.comments?.length || 0}
          </div>
          <button
            className={`upvote-btn ${hasUpvoted ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onUpvote?.(feedback._id);
            }}
            id={`upvote-${feedback._id}`}
          >
            <HiOutlineArrowUp /> {feedback.upvotes?.length || 0}
          </button>
        </div>
      </div>
    </div>
  );
}
