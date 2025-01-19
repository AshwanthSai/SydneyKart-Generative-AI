import React, { useEffect, useState } from "react";
import MetaData from "../Layout/MetaData";
import CheckoutSteps from "./CheckoutSteps";
import {useSelector} from "react-redux";
import { useCreateNewOrderMutation } from "../../store/api/orderAPI";
import { toast } from "react-toastify";
import { calculateOrderCost } from "../../utils/helper";

const PaymentMethod = () => {
  const [method, setMethod] = useState("");
  const {user} = useSelector((state) => state.auth);
  const {shippingData} = useSelector((state) => state.cart);
  const {cartItems} = useSelector((state) => state.cart);

  const [createNewOrder, {error, isError, isSuccess}] = useCreateNewOrderMutation()

  const submitHandler = (e) => {
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



        /* 
          Quanity and Country not found, tried to fix that. 
          But got stuck in Shipping Information Form
        */

        createNewOrder(orderData)
      } else {
        
        
      }
    }

  useEffect(() => {
    if(isError) {
      toast.error(error.data.message)
    }
    if(isSuccess) {
      toast.success("Order Processed")
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
            <button id="shipping_btn" type="submit" className="btn py-2 w-100">
              CONTINUE
            </button>
          </form>
        </div>
      </div>
    </>
  )
};

export default PaymentMethod;
