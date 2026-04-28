import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import EmptyState from '../components/EmptyState';
import { 
  HiOutlineFolder, HiOutlinePlusCircle, HiOutlineClipboardCopy, 
  HiOutlineColorSwatch, HiOutlinePlus, HiOutlineTrash, HiOutlineQuestionMarkCircle,
  HiOutlineChartBar
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const PRESET_COLORS = [
  '#005ea2', // Original Blue
  '#2e7d32', // Green
  '#d32f2f', // Red
  '#ed6c02', // Orange
  '#7b1fa2', // Purple
  '#0097a7', // Cyan
  '#1b1b1b', // Black
];

export default function Dashboard() {
  const { user } = useAuth();
  const { projects, loading, fetchProjects, createProject, updateProject } = useProjects();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '',
    themeColor: '#005ea2',
    logoUrl: '',
    customFields: []
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({ 
      name: '', 
      description: '', 
      themeColor: '#005ea2', 
      logoUrl: '', 
      customFields: [] 
    });
    setShowModal(true);
  };

  const openEditModal = (project) => {
    setEditingId(project._id);
    setFormData({
      name: project.name,
      description: project.description || '',
      themeColor: project.themeColor || '#005ea2',
      logoUrl: project.logoUrl || '',
      customFields: project.customFields || []
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name) return toast.error('Project name is required');
    
    // Validate custom fields
    const invalidField = formData.customFields.find(f => !f.label.trim());
    if (invalidField) return toast.error('All custom questions must have text');

    try {
      if (editingId) {
        await updateProject(editingId, formData);
      } else {
        await createProject(formData);
      }
      setShowModal(false);
    } catch (err) {
      // Error handled by context
    }
  };

  const addCustomField = () => {
    setFormData({
      ...formData,
      customFields: [
        ...formData.customFields,
        { label: '', fieldType: 'text', required: false, options: [] }
      ]
    });
  };

  const addOption = (fieldIndex) => {
    const newFields = [...formData.customFields];
    newFields[fieldIndex].options = [...(newFields[fieldIndex].options || []), ''];
    setFormData({ ...formData, customFields: newFields });
  };

  const updateOption = (fieldIndex, optIndex, value) => {
    const newFields = [...formData.customFields];
    newFields[fieldIndex].options[optIndex] = value;
    setFormData({ ...formData, customFields: newFields });
  };

  const removeOption = (fieldIndex, optIndex) => {
    const newFields = [...formData.customFields];
    newFields[fieldIndex].options = newFields[fieldIndex].options.filter((_, i) => i !== optIndex);
    setFormData({ ...formData, customFields: newFields });
  };

  const updateCustomField = (index, updates) => {
    const newFields = [...formData.customFields];
    newFields[index] = { ...newFields[index], ...updates };
    setFormData({ ...formData, customFields: newFields });
  };

  const removeCustomField = (index) => {
    setFormData({
      ...formData,
      customFields: formData.customFields.filter((_, i) => i !== index)
    });
  };

  const copyLink = (projectId) => {
    const url = `${window.location.origin}/board/${projectId}`;
    navigator.clipboard.writeText(url);
    toast.success('Share link copied to clipboard!');
  };

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="page-enter">
      <div className="page-header">
        <div>
          <h1 className="page-title">Hey, {firstName}</h1>
          <p style={{ color: 'var(--text-3)', fontSize: '0.82rem', marginTop: 3 }}>
            Manage your feedback forms
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <HiOutlinePlusCircle /> New Form
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        {loading ? (
          <div className="cards-grid">
            {[1, 2, 3].map(i => <div key={i} className="skeleton-card"></div>)}
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No forms yet"
            message="Create your first feedback form to share with your users."
            action={<button onClick={openCreateModal} className="btn btn-primary btn-sm">Create Form</button>}
          />
        ) : (
          <div className="cards-grid">
            {projects.map(project => (
              <div key={project._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', borderTop: `4px solid ${project.themeColor || 'var(--accent)'}` }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    {project.logoUrl ? (
                      <img src={project.logoUrl} alt="Logo" style={{ width: 24, height: 24, borderRadius: 4, objectFit: 'contain' }} />
                    ) : (
                      <HiOutlineFolder style={{ color: project.themeColor || 'var(--accent)', fontSize: '1.2rem' }} />
                    )}
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-1)' }}>{project.name}</h3>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-2)', marginBottom: 8 }}>
                    {project.description || 'No description provided.'}
                  </p>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', fontWeight: 500, marginBottom: 16 }}>
                    {project.feedbackCount || 0} {project.feedbackCount === 1 ? 'feedback' : 'feedbacks'} received
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: 8, marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: 16 }}>
                  <button 
                    onClick={() => navigate(`/board/${project._id}`)} 
                    className="btn btn-sm" 
                    style={{ flex: 1, justifyContent: 'center', backgroundColor: project.themeColor, color: '#fff', border: 'none' }}
                  >
                    View Board
                  </button>
                  <button 
                    onClick={() => openEditModal(project)} 
                    className="btn btn-sm btn-ghost"
                    title="Edit Board"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => copyLink(project._id)} 
                    className="btn btn-sm btn-ghost"
                    title="Copy Share Link"
                  >
                    <HiOutlineClipboardCopy />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal page-enter" style={{ maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h2 className="modal-title">{editingId ? 'Edit Feedback Form' : 'Create New Feedback Form'}</h2>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Form Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Mobile App Beta"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description (Optional)</label>
                  <textarea
                    className="form-textarea"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="What is this feedback for?"
                    rows="2"
                  />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Logo URL</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.logoUrl}
                      onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Theme Color</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {PRESET_COLORS.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setFormData({ ...formData, themeColor: color })}
                          style={{
                            width: 24, height: 24, borderRadius: '50%', backgroundColor: color,
                            border: formData.themeColor === color ? '2px solid #fff' : 'none',
                            cursor: 'pointer'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '24px 0' }} />

                <div className="flex items-center justify-between mb-4">
                  <label className="form-label mb-0 flex items-center gap-2">
                    <HiOutlineQuestionMarkCircle /> Custom Questions
                  </label>
                  <button type="button" onClick={addCustomField} className="btn btn-sm btn-secondary">
                    <HiOutlinePlus /> Add Question
                  </button>
                </div>

                {formData.customFields.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'var(--text-3)', fontSize: '0.85rem', padding: '20px', backgroundColor: 'var(--bg-secondary)', borderRadius: 8 }}>
                    No custom questions added yet.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {formData.customFields.map((field, index) => (
                      <div key={index} className="glass-card" style={{ padding: 12, backgroundColor: 'rgba(255,255,255,0.03)' }}>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                          <input 
                            type="text" 
                            className="form-input" 
                            style={{ flex: 1 }}
                            placeholder="e.g. What is your role?" 
                            value={field.label}
                            onChange={(e) => updateCustomField(index, { label: e.target.value })}
                          />
                          <button type="button" onClick={() => removeCustomField(index)} className="btn btn-sm btn-ghost" style={{ color: 'var(--red)' }}>
                            <HiOutlineTrash />
                          </button>
                        </div>
                        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                          <select 
                            className="form-input" 
                            style={{ flex: 1, padding: '4px 8px' }}
                            value={field.fieldType}
                            onChange={(e) => updateCustomField(index, { fieldType: e.target.value })}
                          >
                            <option value="text">Short Text</option>
                            <option value="textarea">Long Text</option>
                            <option value="rating">Rating (1-5)</option>
                            <option value="multiple_choice">Multiple Choice</option>
                          </select>
                          <label className="flex items-center gap-2" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
                            <input 
                              type="checkbox" 
                              checked={field.required} 
                              onChange={(e) => updateCustomField(index, { required: e.target.checked })} 
                            />
                            Required
                          </label>
                        </div>
                        {field.fieldType === 'multiple_choice' && (
                          <div style={{ marginTop: 10, paddingLeft: 8 }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-2)', marginBottom: 6 }}>Answer Choices:</div>
                            {(field.options || []).map((opt, oi) => (
                              <div key={oi} style={{ display: 'flex', gap: 6, marginBottom: 4, alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-3)', fontSize: '0.8rem', width: 20 }}>{oi + 1}.</span>
                                <input
                                  type="text"
                                  className="form-input"
                                  style={{ flex: 1, padding: '4px 8px', fontSize: '0.85rem' }}
                                  placeholder={`Option ${oi + 1}`}
                                  value={opt}
                                  onChange={(e) => updateOption(index, oi, e.target.value)}
                                />
                                <button type="button" onClick={() => removeOption(index, oi)} className="btn btn-sm btn-ghost" style={{ color: 'var(--red)', padding: 2, minWidth: 'auto' }}>
                                  <HiOutlineTrash style={{ fontSize: '0.8rem' }} />
                                </button>
                              </div>
                            ))}
                            <button type="button" onClick={() => addOption(index)} className="btn btn-sm btn-ghost" style={{ fontSize: '0.75rem', marginTop: 4, padding: '2px 8px' }}>
                              <HiOutlinePlus style={{ fontSize: '0.7rem' }} /> Add Option
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="modal-footer" style={{ position: 'sticky', bottom: 0, backgroundColor: 'var(--bg-secondary)', padding: '16px 24px', margin: '0 -24px -24px' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: formData.themeColor }}>
                  {editingId ? 'Update Board' : 'Create Board'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
