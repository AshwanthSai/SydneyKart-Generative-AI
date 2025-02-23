import React, { memo } from "react";
import { Link } from 'react-router-dom'
import ReactStars from 'react-stars'

const ProductItem = ({recommendation, product, columnSize}) => {
  return (
    <>
        <div className={`col-sm-12 col-md-6 col-lg-${columnSize} my-3`}>
            <div className="card p-3 rounded"> {/* Card Photo */}
            <img
                className="card-img-top mx-auto"
                src={product?.images?.[0]?.url || "/images/default_product.png"}
                alt={product?.name}
                onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = "/images/default_product.png";
                }}
                loading="lazy"
                referrerPolicy="no-referrer"
            />
            <div className="card-body ps-3 d-flex justify-content-center flex-column">
            <h5 className="card-title">
            <Link to = {recommendation ? `/products/${product?._id}` : `products/${product?._id}`}>{product?.name}</Link>
            </h5>
            <div className="ratings mt-auto d-flex"> {/* Adds Five Stars to the Product Card */}
                <ReactStars
                    count={5}
                    size={24}
                    
                    color2={'#ffd700'}
                    value={product?.ratings}
                    edit={false}
                 />
                <span id="no_of_reviews" className="pt-2 ps-2"> {/* {""} Used to add a Space */}
                {" "}
                ({product?.numOfReviews})
                {" "}
                </span>
            </div>
            <p className="card-text mt-2">{product?.price}</p> {/* Price */}
                <Link to = {recommendation ? `${product?._id}` : `products/${product?._id}`} id="view_btn" className="btn btn-block"> {/* View Details Button */}
                    View Details
                </Link>
            </div>
        </div>
    </div>
    </>
  )
};

/* 
    Unless the prop values change for the component, do not re-render
    Use previous cached value from the virtual DOM

    Prevents re-rendering all items when one changes
    Improves scrolling performance
    
*/
const areEqual = (prevProps, nextProps) => {
    return (
      prevProps.product?._id === nextProps.product?._id &&
      prevProps.product?.price === nextProps.product?.price &&
      prevProps.product?.ratings === nextProps.product?.ratings &&
      prevProps.columnSize === nextProps.columnSize &&
      prevProps.recommendation === nextProps.recommendation &&
      prevProps.product?.images?.[0]?.url === nextProps.product?.images?.[0]?.url
    );
  };
  
// Export memoized version of the component
export default memo(ProductItem, areEqual);
