import './components.css';

const StarRating = ({ rating = 0, reviewCount, size = 'md' }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  const sizeClass = `star-rating--${size}`;

  return (
    <div className={`star-rating ${sizeClass}`}>
      <div className="star-rating__stars">
        {Array.from({ length: fullStars }).map((_, i) => (
          <span key={`full-${i}`} className="star star--full">★</span>
        ))}
        {hasHalf && <span className="star star--half">★</span>}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <span key={`empty-${i}`} className="star star--empty">★</span>
        ))}
      </div>
      <span className="star-rating__value">{rating.toFixed(1)}</span>
      {reviewCount !== undefined && (
        <span className="star-rating__count">({reviewCount.toLocaleString()})</span>
      )}
    </div>
  );
};

export default StarRating;
