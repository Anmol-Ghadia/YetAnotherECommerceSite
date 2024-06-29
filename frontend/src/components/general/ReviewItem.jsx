

export function ReviewItem({review}) {
    return (
        <>
        <h2>{review.title}</h2>
        <h3>Stars: {review.rating}</h3>
        <p>{review.description}</p>
        </>
    )
}
