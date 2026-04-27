import { useEffect, useState } from 'react';
import api from '../utils/api';
import Loader from '../components/Loader';
import {
  HiOutlineCollection, HiOutlineUsers, HiOutlineCheckCircle,
  HiOutlineClock, HiOutlineStar, HiOutlineDownload
} from 'react-icons/hi';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { STATUS_COLORS, CATEGORY_COLORS } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setData(res.data);
    } catch {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const res = await api.get('/admin/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'feedback-export.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('CSV downloaded');
    } catch {
      toast.error('Export failed');
    }
  };

  if (loading) return <Loader text="Loading analytics…" />;
  if (!data) return null;

  const { stats, charts } = data;

  const statusData = charts.byStatus.map(s => ({
    name: s._id, value: s.count, fill: STATUS_COLORS[s._id] || '#565c65'
  }));
  const categoryData = charts.byCategory.map(c => ({
    name: c._id, value: c.count, fill: CATEGORY_COLORS[c._id] || '#565c65'
  }));
  const trendData = charts.feedbackOverTime.map(d => ({
    date: d._id.slice(5), count: d.count
  }));

  const tip = {
    contentStyle: {
      background: '#ffffff', border: '1px solid #8d8d8d',
      borderRadius: '4px', color: '#1b1b1b', fontSize: '0.85rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)', padding: '10px 14px'
    },
    cursor: { fill: 'rgba(0,0,0,0.04)' }
  };

  const axisProps = { stroke: '#8d8d8d', fontSize: 11, tickLine: false, axisLine: { stroke: '#8d8d8d' } };
  const gridProps = { strokeDasharray: '3 3', stroke: '#e0e0e0' };

  return (
    <div className="page-enter">
      <div className="page-header">
        <h1 className="page-title">Analytics</h1>
        <button className="btn btn-secondary btn-sm" onClick={handleExport} id="export-btn">
          <HiOutlineDownload /> Export CSV
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon purple"><HiOutlineCollection /></div>
          <div>
            <div className="stat-card-value">{stats.totalFeedback}</div>
            <div className="stat-card-label">Total feedback</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon cyan"><HiOutlineUsers /></div>
          <div>
            <div className="stat-card-value">{stats.totalUsers}</div>
            <div className="stat-card-label">Users</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon amber"><HiOutlineClock /></div>
          <div>
            <div className="stat-card-value">{stats.openFeedback}</div>
            <div className="stat-card-label">Open</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon green"><HiOutlineCheckCircle /></div>
          <div>
            <div className="stat-card-value">{stats.resolvedFeedback}</div>
            <div className="stat-card-label">Resolved</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon red"><HiOutlineStar /></div>
          <div>
            <div className="stat-card-value">{stats.avgRating}</div>
            <div className="stat-card-label">Avg rating</div>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        {/* Trend line */}
        <div className="chart-card" style={{ gridColumn: trendData.length > 0 ? 'span 2' : undefined }}>
          <h3 className="chart-card-title">Submissions · last 30 days</h3>
          {trendData.length === 0 ? (
            <p style={{ color: 'var(--text-3)', textAlign: 'center', padding: 36, fontSize: '0.82rem' }}>No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={trendData}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="date" {...axisProps} />
                <YAxis {...axisProps} allowDecimals={false} />
                <Tooltip {...tip} />
                <Line
                  type="monotone" dataKey="count" stroke="#005ea2" strokeWidth={2}
                  dot={{ fill: '#005ea2', r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, stroke: '#005ea2', strokeWidth: 2, fill: '#ffffff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Category pie */}
        <div className="chart-card">
          <h3 className="chart-card-title">By category</h3>
          {categoryData.length === 0 ? (
            <p style={{ color: 'var(--text-3)', textAlign: 'center', padding: 36, fontSize: '0.82rem' }}>No data</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={categoryData} cx="50%" cy="50%"
                  innerRadius={55} outerRadius={90} dataKey="value"
                  paddingAngle={2} stroke="none"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  fontSize={10}
                >
                  {categoryData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip {...tip} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Status bar */}
        <div className="chart-card">
          <h3 className="chart-card-title">By status</h3>
          {statusData.length === 0 ? (
            <p style={{ color: 'var(--text-3)', textAlign: 'center', padding: 36, fontSize: '0.82rem' }}>No data</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={statusData}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="name" {...axisProps} />
                <YAxis {...axisProps} allowDecimals={false} />
                <Tooltip {...tip} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {statusData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
