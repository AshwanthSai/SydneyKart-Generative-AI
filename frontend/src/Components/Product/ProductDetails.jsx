import React, {useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader } from "../Layout/Loader";
import { toast } from "react-toastify";
import { useCanUserReviewOrderQuery, useGetProductDetailsQuery } from "../../store/api/productAPI";
import ReactStars from 'react-stars'
import { useDispatch, useSelector } from "react-redux";
import { setCartItem } from "../../store/features/cartSlice";
import MetaData from "../Layout/MetaData";
import NewReview from "../Reviews/NewReview";
import ListReview from "../Reviews/ListReview";
import NotFound from "../Admin/NotFound";
import ProductRecommendations from "./ProductRecommendations";

const ProductDetails = () => {
      const {id} = useParams();
      const {data, isLoading, error, isError} = useGetProductDetailsQuery(id);
      console.log(data)
      const {data: userPurchased } = useCanUserReviewOrderQuery(id)
      const canReview = userPurchased?.canReview || false;

      const product = data?.product;
      const dispatch = useDispatch();
      const [productCount, setProductCount] = useState(1);
      const isAuthenticated = useSelector(store => store.auth.isAuthenticated);
    
      useEffect(() => {
        if(isError) {
          toast.error(error?.data?.message)
        }
       
      }, [isError,error])

      const [activeImage, setActiveImage] = useState("")
      
      useEffect(() => {
        /* On component mount, set 1st imag as default image */
        setActiveImage(product?.images ? `${product?.images[0]?.url}` : "/images/default_product.png")
        /* Product because data is not received instantaneously */
      },[product])

      if(isLoading) {
          return <Loader/>
      }

      if (error && error?.status == 404) {
        return <NotFound />;
      }
    
      const increaseQty = () => {
        let quantity = document.getElementById("product_quantity").value;
        if(quantity >= product?.stock) {
          return;
        } else {
          setProductCount((productCount) => productCount + 1)
        }
      }

      const decreaseQty = () => {
        let quantity = document.getElementById("product_quantity").value;
        if(quantity <= 1) {
          return;
        } else {
          setProductCount((productCount) => productCount - 1)
        }
      }

    const setItemToCart = async() => {
        const cartItem = {
          product: product?._id,
          name: product?.name,
          price: product?.price,
          image: product?.images[0]?.url,
          stock: product?.stock,
          quantity : productCount,
        };

      await dispatch(setCartItem(cartItem));
      toast.success("Item added to Cart");
    }

      return (
        <>
        <MetaData title={"Product Details"} />
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
          {product?.images?.map((img) => {
            return (<>
                <div className="col-2 ms-4 mt-2 ">
                <Link role="button">
                    <img
                        className={`d-block border rounded p-3 cursor-pointer ${img.url == activeImage ? "border-warning" : ""}`}
                        height="100"
                        width="100"
                        src={img?.url}
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
          <p id="product_id">Product #{product?._id}</p>
  
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
  
          <p id="product_price">${product?.price}</p>
          <div className="stockCounter d-inline">
            <span className="btn btn-danger minus" disabled = {productCount == 1 ? true : false} onClick={decreaseQty}>-</span>
            <input
              id= "product_quantity"
              type="number"
              className="form-control count d-inline"
              value={productCount}
              readonly
            />
            <span className="btn btn-primary plus" disabled={productCount == product?.stock ? true : false} onClick={increaseQty}>+</span>
          </div>
  
          <button
            type="button"
            id="cart_btn"
            className="btn btn-primary d-inline ms-4"
            onClick={setItemToCart}
            disabled = {product?.stock <= 0 ? true : false}
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
          {!isAuthenticated ? (
            <div className="alert alert-danger my-5" type="alert">
              Login to post your review.
            </div>
          ) : (
            (canReview &&
            <NewReview productId={id}/>)
          )}
        </div>
          {
           product?.reviews.length > 0 && (
              <ListReview reviews={product?.reviews}/>
            )
          }
          </div>
          <ProductRecommendations item={data}/>
      </>
      );
    };
    
export default ProductDetails;