import { useState } from 'react';
import { HiOutlineX } from 'react-icons/hi';

export default function TagInput({ tags = [], onChange, placeholder = 'Add tag and press Enter' }) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const tag = input.trim().toLowerCase();
    if (tag && !tags.includes(tag) && tags.length < 10) {
      onChange([...tags, tag]);
      setInput('');
    }
  };

  const removeTag = (idx) => {
    onChange(tags.filter((_, i) => i !== idx));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
    if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className="tag-input-wrapper">
      {tags.map((tag, i) => (
        <span key={i} className="tag">
          {tag}
          <button type="button" className="tag-remove" onClick={() => removeTag(i)} aria-label={`Remove ${tag}`}>
            <HiOutlineX />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ''}
        id="tag-input"
      />
    </div>
  );
}
