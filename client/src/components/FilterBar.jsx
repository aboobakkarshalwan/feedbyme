import { HiOutlineSearch } from 'react-icons/hi';
import { CATEGORIES, STATUSES, PRIORITIES } from '../utils/helpers';

export default function FilterBar({ filters, onFilterChange }) {
  return (
    <div className="filter-bar" id="filter-bar">
      <div className="filter-search">
        <HiOutlineSearch className="filter-search-icon" />
        <input
          type="text"
          placeholder="Search feedback..."
          value={filters.search || ''}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          id="search-input"
        />
      </div>

      <select
        className="filter-select"
        value={filters.status || ''}
        onChange={(e) => onFilterChange({ status: e.target.value })}
        id="filter-status"
      >
        <option value="">All Status</option>
        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      <select
        className="filter-select"
        value={filters.category || ''}
        onChange={(e) => onFilterChange({ category: e.target.value })}
        id="filter-category"
      >
        <option value="">All Categories</option>
        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <select
        className="filter-select"
        value={filters.priority || ''}
        onChange={(e) => onFilterChange({ priority: e.target.value })}
        id="filter-priority"
      >
        <option value="">All Priorities</option>
        {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
      </select>

      <select
        className="filter-select"
        value={filters.sort || '-createdAt'}
        onChange={(e) => onFilterChange({ sort: e.target.value })}
        id="filter-sort"
      >
        <option value="-createdAt">Newest First</option>
        <option value="createdAt">Oldest First</option>
        <option value="upvotes">Most Upvoted</option>
        <option value="-priority">Highest Priority</option>
      </select>
    </div>
  );
}
