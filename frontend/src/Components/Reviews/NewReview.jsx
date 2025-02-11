import React, { useEffect, useState } from "react";
import ReactStars from "react-stars";
import { useSubmitReviewMutation } from "../../store/api/orderAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const NewReview = ({productId}) => {
    const[rating, setRating] = useState(0);
    const[comment, setComment] = useState("");
    const navigate = useNavigate();
    const [submitReview, {data, error, isError, isSuccess}] = useSubmitReviewMutation();

    useEffect(() => {
        if(isError) {
            toast.error(error?.data?.message)
        }
        if(isSuccess) {
            toast.success("Review submitted successfully")
            navigate(0)
        }
    }, [isError,error,isSuccess])

  const submitReviewHandler = async(e) => {
    e.preventDefault();
    const reviewData = { rating, comment, productId };
    await submitReview(reviewData)
  }

  return (
    <>
    <div>
      <button
        id="review_btn"
        type="button"
        className="btn btn-primary mt-4"
        data-bs-toggle="modal"
        data-bs-target="#ratingModal"
      >
        Submit Your Review
      </button>

      <div className="row mt-2 mb-5">
        <div className="rating w-50">
          <div
            className="modal fade"
            id="ratingModal"
            tabindex="-1"
            role="dialog"
            aria-labelledby="ratingModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="ratingModalLabel">
                    Submit Review
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="star-ratings">
                    <ReactStars
                        count={5}
                        size={48}
                        color2={'#ffd700'}
                        value={rating}
                        edit
                        onChange={(new_rating) => setRating(new_rating)}
                    />
                  </div>

                  <textarea
                    name="review"
                    id="review"
                    className="form-control mt-4"
                    placeholder="Enter your comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>

                  <button
                    id="new_review_btn"
                    className="btn w-100 my-4 px-4"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={submitReviewHandler}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
};

export default NewReview;
