import React, { act, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader } from "../Layout/Loader";
import { toast } from "react-toastify";
import { useGetProductDetailsQuery } from "../../store/api/productAPI";
import ReactStars from 'react-stars'

const ProductDetails = () => {
      const {id} = useParams();
      const {data, isLoading, error, isError} = useGetProductDetailsQuery(id);
      const product = data?.product;

      useEffect(() => {
        if(isError) {
          toast.error(error?.data?.message)
        }
      }, [isError,error])

      const [activeImage, setActiveImage] = useState("")
      
      useEffect(() => {
        /* On component mount, set 1st imag as default image */
        setActiveImage(product?.images ? `${product.images[0].url}` : "/images/default_product.png")
        /* Product because data is not received instantaneously */
      },[product])

      if(isLoading) {
          return <Loader/>
      }
        

      return (
        <div className="row d-flex justify-content-around">
        <div className="col-12 col-lg-5 img-fluid" id="product_image">
          <div className="p-3">
            {/* Carousel Primary Image */}
            <img
              className="d-block w-100"
              src={activeImage}
              alt={product?.name}
              width="340"
              height="390"
            />
          </div>
          <div className="row justify-content-start mt-5">
          {/* Sub image within Carousel */}
          {product.images.map((img) => {
            return (<>
                <div className="col-2 ms-4 mt-2 ">
                <Link role="button">
                    <img
                        className={`d-block border rounded p-3 cursor-pointer ${img.url == activeImage ? "border-warning" : ""}`}
                        height="100"
                        width="100"
                        src={img.url}
                        alt={product?.name}
                        onClick = {() => setActiveImage(img.url)}
                    />
                </Link>
                </div>
            </>)
          })}
          </div>
        </div>
  
        <div className="col-12 col-lg-5 mt-5">
          <h3>{product?.name}</h3>
          <p id="product_id">Product # {product?._id}</p>
  
          <hr />
  
          <div className="d-flex">
            <div className="star-ratings">
                 <ReactStars
                    count={5}
                    size={24}
                    color2={'#ffd700'}
                    value={product?.ratings}
                    edit={false}
                 />
            </div>
            <span id="no-of-reviews" className="pt-1 ps-2"> ({product?.numOfReviews}) </span>
          </div>
          <hr />
  
          <p id="product_price">#{product?.price}</p>
          <div className="stockCounter d-inline">
            <span className="btn btn-danger minus">-</span>
            <input
              type="number"
              className="form-control count d-inline"
              value="1"
              readonly
            />
            <span className="btn btn-primary plus">+</span>
          </div>
          <button
            type="button"
            id="cart_btn"
            className="btn btn-primary d-inline ms-4"
            disabled=""
          >
            Add to Cart
          </button>
  
          <hr />
  
          <p>
            Status: <span id="stock_status" className={product?.stock  > 0 ? "greenColor" : "redColor"}>{product?.stock  > 0  ? "In Stock" : "Out of Stock"}</span>
          </p>
  
          <hr />
  
          <h4 className="mt-2">Description:</h4>
          <p>
            {product?.description}
          </p>
          <hr />
          <p id="product_seller mb-3">Sold by: <strong>{product?.seller}</strong></p>
  
          <div className="alert alert-danger my-5" type="alert">
            Login to post your review.
          </div>
        </div>
      </div>
      );
    };
    
export default ProductDetails;