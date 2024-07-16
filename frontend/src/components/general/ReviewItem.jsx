import { ReviewStars } from "./ReviewStars"
import '../../scss/components/general/ReviewItem.scss';

// An individual review, loads the first,last name if possible
export function ReviewItem({review}) {
    return (
        <div id="reveiw-container">
            <div class="review-user-bar">
                <p class="review-user">{review.username}</p>
                <div class="star-container">
                    <ReviewStars stars={review.rating} />
                </div>
            </div>
            <p id="review-title">{review.title}</p>
            <p>{review.description}</p>
        </div>
    )
}
