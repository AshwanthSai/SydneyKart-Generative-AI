import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useOrderDetailsQuery } from "../../store/api/orderAPI";
import { toast } from "react-toastify";
import { Loader } from "../Layout/Loader";
import MetaData from "../Layout/MetaData";
import { useSelector } from "react-redux";

const OrderDetails = () => {
    const {productId} = useParams();
    const {data,error,isLoading,isError} = useOrderDetailsQuery(productId);
    // If large payload, destructuring the first time will lead to errors, because the data has not arrived
    // The below helps, prevent it.
    const order = data?.order || {};
    const {totalAmount, orderStatus,_id, createdAt, user, shippingInfo,paymentInfo, paymentMethod, orderItems } = order
    const isPaid = paymentInfo?.status === "paid" ? true : false;

    useEffect(() => {
        if(isError) {
            toast.error(error.data.message)
        } 
    }, [isError, error])


  
    if (isLoading) return <Loader />;

  return (
    <>
    <MetaData title={"Order Details"} />
    <div className="row d-flex justify-content-center">
    <div className="col-12 col-lg-9 mt-5 order-details">
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="mt-5 mb-4">Your Order Details</h3>
        <Link className="btn btn-success" to={`/invoice/order/${_id}`}>
          <i className="fa fa-print"></i> Invoice
        </Link>
      </div>
      <table className="table table-striped table-bordered">
        <tbody>
          <tr>
            <th scope="row">ID</th>
            {/* Extracted from data */}
            <td>{_id}</td>
          </tr>
          <tr>
                <th scope="row">Status</th>
                <td
                  className={
                    String(orderStatus).includes("Delivered")
                      ? "greenColor"
                      : "redColor"
                  }
                >
                  <b>{orderStatus}</b>
                </td>
              </tr>
          <tr>
            <th scope="row">Date</th>
            <td>{new Date(createdAt).toLocaleString("en-US")}</td>
          </tr>
        </tbody>
      </table>

      <h3 className="mt-5 mb-4">Shipping Info</h3>
      <table className="table table-striped table-bordered">
        <tbody>
          <tr>
            <th scope="row">Name</th>
            <td>{user?.name}</td>
          </tr>
          <tr>
            <th scope="row">Phone No</th>
            <td>{shippingInfo?.phoneNo}</td>
          </tr>
          <tr>
            <th scope="row">Address</th>
            <td>
                {shippingInfo?.address}, {shippingInfo?.city},{" "}
                {shippingInfo?.zipCode}, {shippingInfo?.country}
            </td>
          </tr>
        </tbody>
      </table>

      <h3 className="mt-5 mb-4">Payment Info</h3>
      <table className="table table-striped table-bordered">
        <tbody>
        <tr>
            <th scope="row">Status</th>
            <td className={isPaid ? "greenColor" : "redColor"}>
                <b>{paymentInfo?.status}</b>
                </td>
            </tr>
          <tr>
            <th scope="row">Method</th>
            <td>{paymentMethod}</td>
          </tr>
          <tr>
            <th scope="row">Stripe ID</th>
            {/* If no stripe ID, then cash on delivery */}
            <td>{paymentInfo?.id || "Nill"}</td>
          </tr>
          <tr>
            <th scope="row">Amount Paid</th>
            <td>&#8377; - {totalAmount.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <h3 className="mt-5 my-4">Order Items:</h3>         
      <hr />
      {orderItems?.map((item) => (
            <div className="cart-item my-1">
            <div className="row my-5">
            <div className="col-4 col-lg-2">
                <img
                src={item.image}
                alt={item.name}
                height="45"
                width="65"
                />
            </div>

            <div className="col-5 col-lg-5">
                <Link to={`/products/${item._id}`}>{item.name}</Link>
            </div>

            <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                <p>&#8377; - {item.price}</p>
            </div>

            <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                <p>{item.quantity} Piece(s)</p>
            </div>
            </div>
        </div>)
     )}
      <hr />
    </div>
  </div>
  </>
)
};

export default OrderDetails;
