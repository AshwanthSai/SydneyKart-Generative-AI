import React, { useEffect, useState } from "react";
import AdminLayout from "../Layout/AdminLayout";
import { MDBDataTable } from "mdbreact";
import { useDeleteReviewMutation, useLazyGetReviewsQuery } from "../../store/api/productAPI";
import { toast } from "react-toastify";
import MetaData from "../Layout/MetaData";

const ProductReviews = () => {
    const [productId, setProductId] = useState("")
    const [getProductReviews, {data, isSuccess, error, isError}] = useLazyGetReviewsQuery()
    const [deleteReview, {isLoading : deleteReviewIsLoading, isSuccess : deleteReviewIsSuccess, error : deleteReviewError,
       isError : deleteReviewIsError}] = useDeleteReviewMutation()

    const submitHandler = async(e) => {
       e.preventDefault();
       if(productId.length < 5){
        toast.error("Enter a valid product ID")
        return 
       }
       await getProductReviews(productId)
    }

    const deleteReviewHandler = (id) => async(e) => {
      e.preventDefault();
      console.log()
      deleteReview({productId, id})
    }

    useEffect(() => {
      if(deleteReviewIsSuccess){
        toast.success("Review deleted successfully")
      }
      if(deleteReviewIsError){
        toast.error(deleteReviewError?.data?.message)
      }
    },[deleteReviewIsSuccess,deleteReviewIsError,deleteReviewError])

    useEffect(() => {
        if(isError){
            toast.error(error?.data?.message)
        }
        if(isSuccess){
            toast.success("Reviews fetched successfully")
        }
    },[isError, error, isSuccess])
    
    const setReviews = () => {
        const reviews = {
          columns: [
            {
              label: "Review ID",
              field: "id",
              sort: "asc",
            },
            {
              label: "Rating",
              field: "rating",
              sort: "asc",
            },
            {
              label: "Comment",
              field: "comment",
              sort: "asc",
            },
            {
              label: "User",
              field: "user",
              sort: "asc",
            },
            {
              label: "Actions",
              field: "actions",
              sort: "asc",
            },
          ],
          rows: [],
        };

        data?.reviews?.forEach((review) => {
          reviews.rows.push({
            id: review?._id,
            rating: review?.rating,
            comment: `${review?.comment}`,
            user: review?.user,
            actions: (
            <>
                <button
                    className="btn btn-outline-danger ms-2"
                    onClick={deleteReviewHandler(review?._id)}
                    disabled={deleteReviewIsLoading}
                >
                <i className="fa fa-trash danger"></i>
                </button>
            </>
            ),
        });
      });
      return reviews;
    };
  
  return (
    <>
    <AdminLayout>
    <div class="row justify-content-center mt-5 mt-lg-2 my-5">
    <MetaData title={"Reviews"} />
    <div class="col-6">
      <form onSubmit={submitHandler}>
        <div class="mb-3">
          <label for="productId_field" class="form-label">
            Enter Product ID
          </label>
          <input
            type="text"
            id="productId_field"
            class="form-control"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            minLength ={5}
          />
        </div>
        <button
          id="search_button"
          type="submit"
          class="btn btn-primary w-100 py-2"
        >
          SEARCH
        </button>
      </form>
    </div>
  </div>
    {data?.reviews?.length > 0 ? (
        <MDBDataTable
          data={setReviews()}
          className="px-3"
          bordered
          striped
          hover
        />
      ) : (
        <p className="mt-5 text-center">No Reviews</p>
      )}
    </AdminLayout>
    </>
)};

export default ProductReviews;
