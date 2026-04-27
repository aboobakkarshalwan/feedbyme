export const getStatusBadgeClass = (status) => {
  const map = {
    'Open': 'badge-open',
    'In Progress': 'badge-in-progress',
    'Under Review': 'badge-under-review',
    'Resolved': 'badge-resolved',
    'Closed': 'badge-closed'
  };
  return map[status] || 'badge-open';
};

export const getPriorityBadgeClass = (priority) => {
  const map = {
    'Low': 'badge-low',
    'Medium': 'badge-medium',
    'High': 'badge-high',
    'Critical': 'badge-critical'
  };
  return map[priority] || 'badge-medium';
};

export const getCategoryBadgeClass = (category) => {
  const map = {
    'Bug': 'badge-bug',
    'Feature Request': 'badge-feature',
    'Improvement': 'badge-improvement',
    'General': 'badge-general',
    'Other': 'badge-other'
  };
  return map[category] || 'badge-other';
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
};

export const formatFullDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const CATEGORIES = ['Bug', 'Feature Request', 'Improvement', 'General', 'Other'];
export const STATUSES = ['Open', 'In Progress', 'Under Review', 'Resolved', 'Closed'];
export const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

export const CHART_COLORS = {
  primary: '#005ea2',
  secondary: '#00bde3',
  success: '#008817',
  warning: '#e5a000',
  danger: '#e31c3d',
  muted: '#565c65'
};

export const STATUS_COLORS = {
  'Open': '#005ea2',
  'In Progress': '#e5a000',
  'Under Review': '#00687d',
  'Resolved': '#008817',
  'Closed': '#565c65'
};

export const CATEGORY_COLORS = {
  'Bug': '#e31c3d',
  'Feature Request': '#005ea2',
  'Improvement': '#00687d',
  'General': '#008817',
  'Other': '#565c65'
};
