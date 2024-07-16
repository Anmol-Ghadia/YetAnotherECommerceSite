import { ReviewStars } from "./ReviewStars"

export function ReviewItem({review}) {
    return (
        <>
        <h2>{review.title}</h2>
        {/* <h3>Stars: {review.rating}</h3> */}
        <ReviewStars stars={review.rating} />
        <p>{review.description}</p>
        </>
    )
}
