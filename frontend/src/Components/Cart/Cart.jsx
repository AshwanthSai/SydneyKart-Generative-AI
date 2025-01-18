import React from "react";
import MetaData from "../Layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import store from "../../store/store";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { removeCartItem, setCartItem } from "../../store/features/cartSlice";

const Cart = () => {
    const {cartItems} = useSelector(store => store.cart)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    if(cartItems.length === 0) {
      return <h2>Your Cart is Empty</h2>
    }

    const increaseQty = (item, itemQuantity) => () => {
      let newQuantity = itemQuantity + 1;
      if(newQuantity > item.stock) {
        toast.error("Product stock is exceeded");
        return;
      }
      setItemToCart(item, newQuantity)
    }

    const decreaseQty = (item, itemQuantity) => () => {
      console.log(item)
      let newQuantity = itemQuantity - 1;
      if(newQuantity <= 0) {
        toast.error("Product stock cannot be less than 1");
        return;
      }
      setItemToCart(item, newQuantity)
    }

    const deleteItem = (item) => () => {
      dispatch(removeCartItem(item.product));
      toast.success("Item removed from cart");
    }

    const setItemToCart = async(product, productCount) => {
      const cartItem = {
        /* 
          Small changes here, since we are not pulling the entire
          product details. Just mini products from our Cart Store. 
        */
        product: product.product,
        name: product?.name,
        price: product?.price,
        image: product?.image,
        stock: product?.stock,
        productCount,
      };

      await dispatch(setCartItem(cartItem));
    }

  return (
    <>
        <MetaData title={"Update Password"} />
        <h2  className="my-3">Your Cart: <b>{cartItems.length}</b></h2>
        <div className="row d-flex justify-content-between">
        <div className="col-12 col-lg-8">
        <hr />
        {cartItems.map((item) => {
            return (
                <>
                    <div className="cart-item" data-key="product1">
                    <div className="row">
                        <div className="col-4 col-lg-3">
                        <img
                            src={item.image}
                            alt={item.name}
                            height="90"
                            width="115"
                        />
                        </div>
                        <div className="col-5 col-lg-3">
                        <Link to="/products/product1"> {item.name} </Link>
                        </div>
                        <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                        <p id="card_item_price">${item.price}</p>
                        </div>
                        <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                        <div className="stockCounter d-inline">
                            <span className="btn btn-danger minus" onClick={decreaseQty(item, item.productCount)}> - </span>
                            <input
                            type="number"
                            className="form-control count d-inline"
                            value={item.productCount}
                            readonly
                            />
                            <span className="btn btn-primary plus" onClick={increaseQty(item, item.productCount)}> + </span>
                        </div>
                        </div>
                        <div className="col-4 col-lg-1 mt-4 mt-lg-0" onClick={deleteItem(item)}>
                        <i id="delete_cart_item" className="fa fa-trash btn btn-danger"></i>
                        </div>
                    </div>
                    </div>
                    <hr />
                </>
            )
        })}
          </div>
          <div className="col-12 col-lg-3 my-4">
              <div id="order_summary">
              <h4>Order Summary</h4>
              <hr />
              <p>Units: <span className="order-summary-values">{cartItems.reduce((acc, item) => (item.productCount + acc), 0)} (Units)</span></p>
              <p>Est. total: <span className="order-summary-values">${cartItems.reduce((acc, item) => (item.price * item.productCount + acc), 0).toFixed(2)}</span></p>
              <hr />
              <button id="checkout_btn" className="btn btn-primary w-100" onClick={() => navigate("/shipping")}>
                  Check out
              </button>
              </div>
          </div>
        </div>
    </>
  )
};

export default Cart;
