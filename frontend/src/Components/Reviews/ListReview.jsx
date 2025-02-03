import React from "react";
import ReactStars from "react-stars";

const ListReview = ({reviews}) => {
  const user = reviews.user;
  return (
    <div className="reviews w-75 mt-5">
    <h3>Other's Reviews:</h3>
    <hr />
    {
    reviews && reviews.map(review => (
        <div className="review-card my-3">
        <div className="row">
        <div className="col-1">
            <img
            src={review?.user?.avatar?.url || "../images/default_avatar.jpg"}
            alt="User Name"
            width="50"
            height="50"
            className="rounded-circle"
            />
        </div>
        <div className="col-11">
        <div className="star-ratings">
            <ReactStars
                count={5}
                size={35}
                color2={'#ffd700'}
                value={review?.rating}
                edit={false}
            />
            </div>
            <p className="review_user">{review?.user?.name}</p>
            <p className="review_comment">{review?.comment}</p>
        </div>
        </div>
        <hr />
        </div>))
    }
  </div>
  )
};

export default ListReview;
