import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import StarRating from '../components/StarRating';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { HiOutlineChevronLeft, HiOutlineCloudUpload, HiOutlineX } from 'react-icons/hi';

export default function FeedbackNew() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { isAuthenticated } = useAuth();
  const { fetchProject } = useProjects();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    rating: 0,
    guestEmail: '',
    image: null,
    imagePreview: null,
    customAnswers: {} // Keyed by field label
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadProject = async () => {
      const data = await fetchProject(projectId);
      setProject(data);
      if (data?.customFields) {
        const initialAnswers = {};
        data.customFields.forEach(f => {
          initialAnswers[f.label] = f.fieldType === 'rating' ? 0 : '';
        });
        setForm(prev => ({ ...prev, customAnswers: initialAnswers }));
      }
      setLoading(false);
    };
    loadProject();
  }, [projectId, fetchProject]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return toast.error('File size must be less than 5MB');
      }
      if (!file.type.startsWith('image/')) {
        return toast.error('Only image files are allowed');
      }
      
      setForm({
        ...form,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  const removeImage = () => {
    setForm({
      ...form,
      image: null,
      imagePreview: null
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCustomAnswerChange = (label, value) => {
    setForm({
      ...form,
      customAnswers: {
        ...form.customAnswers,
        [label]: value
      }
    });
    if (errors[label]) {
      const newErrors = { ...errors };
      delete newErrors[label];
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const errs = {};
    if (!form.title || form.title.length < 3) errs.title = 'Title must be at least 3 characters';
    if (!form.description || form.description.length < 10) errs.description = 'Feedback must be at least 10 characters';
    if (form.rating === 0) errs.rating = 'Please provide a star rating';
    if (!isAuthenticated && (!form.guestEmail || !/^\S+@\S+\.\S+$/.test(form.guestEmail))) {
      errs.guestEmail = 'A valid email is required for guest submissions';
    }

    // Validate custom fields
    project?.customFields?.forEach(field => {
      const value = form.customAnswers[field.label];
      if (field.required && (!value || value === 0)) {
        errs[field.label] = `${field.label} is required`;
      }
    });
    
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('projectId', projectId);
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('rating', form.rating);
      formData.append('category', 'General');
      formData.append('priority', 'Medium');
      formData.append('isAnonymous', 'false');
      
      if (!isAuthenticated) {
        formData.append('guestEmail', form.guestEmail);
      }
      
      if (form.image) {
        formData.append('image', form.image);
      }

      // Convert custom answers to array for backend
      const customAnswersArray = Object.keys(form.customAnswers).map(label => ({
        label,
        value: String(form.customAnswers[label])
      }));
      formData.append('customAnswers', JSON.stringify(customAnswersArray));
      
      await api.post('/feedback', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Thank you for your feedback!');
      navigate(`/board/${projectId}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader text="Loading form..." />;
  if (!project) return <div className="page-enter">Project not found</div>;

  return (
    <div className="page-enter">
      <div className="flex items-center gap-4 mb-6">
        <Link to={`/board/${projectId}`} className="btn btn-ghost" style={{ padding: 8 }}>
          <HiOutlineChevronLeft style={{ fontSize: '1.2rem' }} /> Back
        </Link>
        <h1 className="page-title mb-0">Give Feedback</h1>
      </div>

      <div className="glass-card" style={{ maxWidth: 600, margin: '0 auto', padding: 32 }}>
        <form onSubmit={handleSubmit}>
          
          <div className="form-group" style={{ textAlign: 'center', marginBottom: 32 }}>
            <label className="form-label" style={{ fontSize: '1.2rem', marginBottom: 12 }}>How would you rate your overall experience?</label>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <StarRating 
                value={form.rating} 
                onChange={(v) => {
                  setForm({ ...form, rating: v });
                  if (errors.rating) setErrors({ ...errors, rating: null });
                }} 
                size="2.5rem"
              />
            </div>
            {errors.rating && <div className="form-error" style={{ marginTop: 8 }}>{errors.rating}</div>}
          </div>

          {!isAuthenticated && (
            <div className="form-group">
              <label className="form-label">Your Email *</label>
              <input
                type="email"
                className="form-input"
                placeholder="email@example.com"
                value={form.guestEmail}
                onChange={(e) => {
                  setForm({ ...form, guestEmail: e.target.value });
                  if (errors.guestEmail) setErrors({ ...errors, guestEmail: null });
                }}
              />
              {errors.guestEmail && <span className="form-error">{errors.guestEmail}</span>}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Feedback Summary</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Great experience but found a bug"
              value={form.title}
              onChange={(e) => {
                setForm({ ...form, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: null });
              }}
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Feedback</label>
            <textarea
              className="form-textarea"
              placeholder="Tell us what you liked, what you didn't, or what we can improve..."
              rows={4}
              value={form.description}
              onChange={(e) => {
                setForm({ ...form, description: e.target.value });
                if (errors.description) setErrors({ ...errors, description: null });
              }}
            />
            {errors.description && <span className="form-error">{errors.description}</span>}
          </div>

          {/* Custom Questions Section */}
          {project.customFields?.length > 0 && (
            <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--glass-border)' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: 20, color: 'var(--text-1)' }}>Additional Questions</h3>
              {project.customFields.map((field, i) => (
                <div key={i} className="form-group">
                  <label className="form-label">
                    {field.label} {field.required && '*'}
                  </label>
                  
                  {field.fieldType === 'rating' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <StarRating 
                        value={Number(form.customAnswers[field.label]) || 0} 
                        onChange={(v) => handleCustomAnswerChange(field.label, v)}
                        size="1.5rem"
                      />
                    </div>
                  ) : field.fieldType === 'textarea' ? (
                    <textarea 
                      className="form-textarea"
                      rows={3}
                      value={form.customAnswers[field.label] || ''}
                      onChange={(e) => handleCustomAnswerChange(field.label, e.target.value)}
                    />
                  ) : (
                    <input 
                      type="text"
                      className="form-input"
                      value={form.customAnswers[field.label] || ''}
                      onChange={(e) => handleCustomAnswerChange(field.label, e.target.value)}
                    />
                  )}
                  {errors[field.label] && <span className="form-error">{errors[field.label]}</span>}
                </div>
              ))}
            </div>
          )}

          <div className="form-group" style={{ marginTop: 32 }}>
            <label className="form-label">Attach Image (Optional)</label>
            {!form.imagePreview ? (
              <div 
                className="file-upload-zone"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed var(--glass-border)', borderRadius: '8px',
                  padding: '32px', textAlign: 'center', cursor: 'pointer',
                  backgroundColor: 'var(--bg-secondary)', transition: 'all 0.2s'
                }}
              >
                <HiOutlineCloudUpload style={{ fontSize: '2rem', color: 'var(--text-3)', marginBottom: 12 }} />
                <p style={{ fontSize: '0.85rem', color: 'var(--text-2)' }}>Click to upload screenshot</p>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" hidden />
              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                <img src={form.imagePreview} alt="Preview" style={{ width: '100%', borderRadius: '8px', maxHeight: '200px', objectFit: 'contain', backgroundColor: '#000' }} />
                <button type="button" onClick={removeImage} style={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <HiOutlineX />
                </button>
              </div>
            )}
          </div>

          <div style={{ marginTop: 40 }}>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}
