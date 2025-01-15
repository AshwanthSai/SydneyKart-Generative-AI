import React from "react";
import { Link } from 'react-router-dom'
import ReactStars from 'react-stars'

const ProductItem = ({product}) => {
  console.log(product);
  return (
    <>
        <div className="col-sm-12 col-md-6 col-lg-3 my-3">
            <div className="card p-3 rounded"> {/* Card Photo */}
                <img
                className="card-img-top mx-auto"
                src={product?.images ? `${product.images[0].url}` : "/images/default_product.png"}
                alt={product?.name}
                />
            <div className="card-body ps-3 d-flex justify-content-center flex-column">
            <h5 className="card-title">
                <Link to = {`products/${product._id}`}>{product?.name}</Link>
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
                <Link to = {`products/${product._id}`} id="view_btn" className="btn btn-block"> {/* View Details Button */}
                    View Details
                </Link>
            </div>
        </div>
    </div>
    </>
  )
};

export default ProductItem;
