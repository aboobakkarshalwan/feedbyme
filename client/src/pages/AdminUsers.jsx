import { useEffect, useState } from 'react';
import api from '../utils/api';
import Loader, { SkeletonTable } from '../components/Loader';
import ConfirmModal from '../components/ConfirmModal';
import Pagination from '../components/Pagination';
import { getInitials, formatDate } from '../utils/helpers';
import { HiOutlineSearch, HiOutlineShieldCheck, HiOutlineUser } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [roleChange, setRoleChange] = useState(null); // { userId, newRole, userName }

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (search) params.search = search;
      const res = await api.get('/admin/users', { params });
      setUsers(res.data.users);
      setPagination(res.data.pagination);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => fetchUsers(1), 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const handleRoleChange = async () => {
    if (!roleChange) return;
    try {
      await api.put(`/admin/users/${roleChange.userId}`, { role: roleChange.newRole });
      toast.success(`User role updated to ${roleChange.newRole}`);
      fetchUsers(pagination.page);
    } catch {
      toast.error('Failed to update role');
    }
    setRoleChange(null);
  };

  return (
    <div className="page-enter">
      <div className="page-header">
        <h1 className="page-title">User Management</h1>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {pagination.total} total users
        </span>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <div className="filter-search" style={{ maxWidth: 400 }}>
          <HiOutlineSearch className="filter-search-icon" />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: 40 }}
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="user-search"
          />
        </div>
      </div>

      {loading ? (
        <SkeletonTable rows={8} />
      ) : (
        <div className="data-table-wrapper">
          <table className="data-table" id="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Feedback</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="feedback-card-author-avatar">
                        {getInitials(u.name)}
                      </div>
                      <span style={{ fontWeight: 500 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'admin' ? 'badge-feature' : 'badge-general'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>{u.feedbackCount || 0}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{formatDate(u.createdAt)}</td>
                  <td>
                    {u.role === 'user' ? (
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => setRoleChange({ userId: u._id, newRole: 'admin', userName: u.name })}
                      >
                        <HiOutlineShieldCheck /> Make Admin
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => setRoleChange({ userId: u._id, newRole: 'user', userName: u.name })}
                      >
                        <HiOutlineUser /> Make User
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={fetchUsers} />

      <ConfirmModal
        isOpen={!!roleChange}
        title="Change User Role"
        message={roleChange ? `Change ${roleChange.userName}'s role to "${roleChange.newRole}"?` : ''}
        confirmText="Change Role"
        onConfirm={handleRoleChange}
        onCancel={() => setRoleChange(null)}
      />
    </div>
  );
}
