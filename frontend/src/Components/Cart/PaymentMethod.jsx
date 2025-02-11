import React, { useEffect, useState } from "react";
import MetaData from "../Layout/MetaData";
import CheckoutSteps from "./CheckoutSteps";
import {useSelector} from "react-redux";
import { useCreateNewOrderMutation, useStripeCheckoutSessionMutation } from "../../store/api/orderAPI";
import { toast } from "react-toastify";
import { calculateOrderCost } from "../../utils/helper";
import { Navigate, useNavigate } from "react-router-dom";

const PaymentMethod = () => {
  const [method, setMethod] = useState("COD");
  const {shippingData} = useSelector((state) => state.cart);
  const {cartItems} = useSelector((state) => state.cart);
  const [createNewOrder, {error, isError, isSuccess}] = useCreateNewOrderMutation()
  const [stripeCheckoutSession, {data : stripeData, isError : stripeError, isLoading : stripeIsLoading}] = useStripeCheckoutSessionMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if(stripeError) {
      toast.error(stripeError.data.message)
    }
    if(stripeData){
      // If you use useNavigate, base url remains the same.
      // Redirect to stripe will not work
      window.location.href = stripeData.url
    }
  }, [stripeData])


  const submitHandler = async(e) => {
     const {subtotalAmount, shippingAmount, taxAmount, totalAmount} = calculateOrderCost(cartItems)
      e.preventDefault();
      if(method == "COD"){
        const orderData = {
          orderItems : cartItems,
          shippingInfo : shippingData,
          itemsPrice : subtotalAmount,
          taxAmount,
          shippingAmount,
          totalAmount,
          paymentMethod : "COD",
          paymentInfo: {
            status: "Not Paid",
          }
        }
        await createNewOrder(orderData)
      } else {
        const orderData = {
          orderItems : cartItems,
          shippingInfo : shippingData,
          itemsPrice : subtotalAmount,
          taxAmount,
          shippingAmount,
          totalAmount,
        }
        await stripeCheckoutSession(orderData)
    }
  }

  useEffect(() => {
    if(isError) {
      toast.error(error.data.message)
    }
    if(isSuccess) {
      toast.success("Order Processed")
      navigate("/me/orders?order_success=true")
    }
  }, [error, isSuccess])

  return (
    <>
      <MetaData title={"Payment Method"} />
      <CheckoutSteps shipping confirmOrder payment/>
        <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form
            className="shadow rounded bg-body"
            onSubmit={submitHandler}
          >
            <h2 className="mb-4">Select Payment Method</h2>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="payment_mode"
                id="codradio"
                value="COD"
                onChange={(e) => setMethod(e.target.value)}
              />
              <label className="form-check-label" htmlFor="codradio">
                Cash on Delivery
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="payment_mode"
                id="cardradio"
                value="Card"
                onChange={(e) => setMethod(e.target.value)}
              />
              <label className="form-check-label" htmlFor="cardradio">
                Card - VISA, MasterCard
              </label>
            </div>
            <button id="shipping_btn" type="submit" className="btn py-2 w-100" disabled = {stripeIsLoading} >
              CONTINUE
            </button>
          </form>
        </div>
      </div>
    </>
  )
};

export default PaymentMethod;
