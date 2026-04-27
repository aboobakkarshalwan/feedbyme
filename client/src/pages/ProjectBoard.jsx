import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import api from '../utils/api';
import FeedbackCard from '../components/FeedbackCard';
import { SkeletonCard } from '../components/Loader';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';
import { HiOutlinePlusCircle, HiOutlineFolder, HiOutlineClipboardCopy } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function ProjectBoard() {
  const { projectId } = useParams();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { fetchProject } = useProjects();
  
  const [project, setProject] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, [projectId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const projData = await fetchProject(projectId);
      setProject(projData);
      
      if (projData) {
        const res = await api.get('/feedback', { params: { projectId, limit: 100, sort: '-createdAt' } });
        setFeedbacks(res.data.feedbacks);
      }
    } catch (error) {
      toast.error('Failed to load board');
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (id) => {
    if (!isAuthenticated) {
      toast.error('Please log in to upvote');
      return;
    }
    try {
      await api.post(`/feedback/${id}/upvote`);
      loadData(); // Refresh to get updated upvotes
    } catch {
      toast.error('Failed to upvote');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/feedback/${deleteId}`);
      toast.success('Feedback deleted');
      setFeedbacks(prev => prev.filter(f => f._id !== deleteId));
    } catch {
      toast.error('Failed to delete feedback');
    } finally {
      setDeleteId(null);
    }
  };

  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Share link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="page-enter">
        <div className="page-header" style={{ marginBottom: 32 }}>
          <div>
            <div className="skeleton-card" style={{ height: 40, width: 200, marginBottom: 8, background: 'var(--bg-secondary)' }}></div>
            <div className="skeleton-card" style={{ height: 20, width: 300, background: 'var(--bg-secondary)' }}></div>
          </div>
        </div>
        <div className="cards-grid">
          {[1,2,3].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="page-enter">
        <EmptyState
          icon="🚫"
          title="Board Not Found"
          message="This feedback form does not exist or you don't have access to it."
          action={<Link to={isAuthenticated ? "/dashboard" : "/"} className="btn btn-primary btn-sm">Go Back</Link>}
        />
      </div>
    );
  }

  const themeColor = project.themeColor || 'var(--accent)';
  const isProjectOwner = project.owner?._id === user?._id || project.owner === user?._id;

  return (
    <div className="page-enter">
      <div className="page-header" style={{ marginBottom: 32, paddingBottom: 24, borderBottom: `1px solid var(--glass-border)`, borderLeft: `8px solid ${themeColor}`, paddingLeft: 24 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
            {project.logoUrl ? (
              <img src={project.logoUrl} alt="Project Logo" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'contain', backgroundColor: 'var(--bg-secondary)', padding: 4 }} />
            ) : (
              <HiOutlineFolder style={{ color: themeColor, fontSize: '2.5rem' }} />
            )}
            <h1 className="page-title" style={{ marginBottom: 0 }}>{project.name}</h1>
          </div>
          <p style={{ color: 'var(--text-2)', fontSize: '1.05rem', maxWidth: 800 }}>
            {project.description || 'Submit your feedback and ideas for this project.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <button onClick={copyLink} className="btn btn-ghost">
            <HiOutlineClipboardCopy /> Share Link
          </button>
          <Link to={`/board/${projectId}/new`} className="btn btn-primary" style={{ backgroundColor: themeColor, border: 'none' }}>
            <HiOutlinePlusCircle /> Submit Feedback
          </Link>
        </div>
      </div>

      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-1)' }}>
          Feedback ({feedbacks.length})
        </h2>
      </div>

      {feedbacks.length === 0 ? (
        <EmptyState
          icon="📝"
          title="No feedback yet"
          message="Be the first to submit feedback for this project."
          action={<Link to={`/board/${projectId}/new`} className="btn btn-primary btn-sm" style={{ backgroundColor: themeColor, border: 'none' }}>Submit Feedback</Link>}
        />
      ) : (
        <div className="cards-grid">
          {feedbacks.map(fb => {
            const isAuthor = fb.author?._id === user?._id || fb.author === user?._id;
            const canDelete = isAdmin || isAuthor || isProjectOwner;
            
            return (
              <FeedbackCard 
                key={fb._id} 
                feedback={fb} 
                onUpvote={handleUpvote} 
                onDelete={canDelete ? (id) => setDeleteId(id) : null}
                currentUserId={user?._id} 
              />
            );
          })}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Feedback"
        message="Are you sure you want to delete this feedback? This action cannot be undone."
        confirmText="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
