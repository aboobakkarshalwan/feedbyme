import { HiStar, HiOutlineStar } from 'react-icons/hi';

export default function StarRating({ value = 0, onChange, readonly = false, size = '1.5rem' }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="star-rating">
      {stars.map(star => (
        <button
          key={star}
          type="button"
          className={`star-rating-btn ${star <= value ? 'filled' : ''}`}
          onClick={() => !readonly && onChange?.(star)}
          disabled={readonly}
          style={{ fontSize: size }}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
        >
          {star <= value ? <HiStar /> : <HiOutlineStar />}
        </button>
      ))}
    </div>
  );
}
