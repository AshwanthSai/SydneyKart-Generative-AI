import React, { useEffect, useState } from "react";
import AdminLayout from "../Layout/AdminLayout";
import { Link, useParams } from "react-router-dom";
import { useOrderDetailsQuery, useUpdateOrderStatusMutation } from "../../store/api/orderAPI";
import { toast } from "react-toastify";

const ProcessingOrder = () => {
    const {id} = useParams();
    const {data} = useOrderDetailsQuery(id);
    const [updateOrderStatus, {data : statusData, isSuccess, isError, error, isLoading}] = useUpdateOrderStatusMutation()
    const [status, setStatus] = useState("");
    const order = data?.order || ""
    console.log(order)
    
    useEffect(() => {
        if(data && !isLoading) {
            setStatus(order?.orderStatus)
        }
    }, [])

    useEffect(() => {
        if (isError) {
            toast.error(error?.data?.message);
        } 
        if(isSuccess){
            toast.success("Order Status Changed Successfully")
        }
    }, [error, isError,isSuccess]);

    const updateOrderStatusHandler = (id) => (e) => {
        e.preventDefault();
        const body = {id, status}
        console.log(body)
        updateOrderStatus({id, body})
    }

  return (
    <AdminLayout>
    <div className="row d-flex justify-content-around">
    <div className="col-12 col-lg-8 order-details">
      <h3 className="mt-5 mb-4">Order Details</h3>

      <table className="table table-striped table-bordered">
        <tbody>
          <tr>
            <th scope="row">ID</th>
            <td>{order?._id}</td>
          </tr>
          <tr>
            <th scope="row">Status</th>
            <td className="greenColor">
              <b>{order?.orderStatus}</b>
            </td>
          </tr>
        </tbody>
      </table>

      <h3 className="mt-5 mb-4">Shipping Info</h3>
      <table className="table table-striped table-bordered">
        <tbody>
          <tr>
            <th scope="row">Name</th>
            <td>{order?.user?.name}</td>
          </tr>
          <tr>
            <th scope="row">Phone No</th>
            <td>{order?.shippingInfo?.phoneNo}</td>
          </tr>
          <tr>
            <th scope="row">Address</th>
            <td>{order?.shippingInfo?.address}</td>
          </tr>
        </tbody>
      </table>

      <h3 className="mt-5 mb-4">Payment Info</h3>
      <table className="table table-striped table-bordered">
        <tbody>
          <tr>
            <th scope="row">Status</th>
            <td className="greenColor">
              <b>{order?.paymentInfo?.status}</b>
            </td>
          </tr>
          <tr>
            <th scope="row">Method</th>
            <td>{order?.paymentMethod}</td>
          </tr>
          <tr>
            <th scope="row">Stripe ID</th>
            <td>{order?._id}</td>
          </tr>
          <tr>
            <th scope="row">Amount</th>
            <td>${order?.totalAmount}</td>
          </tr>
        </tbody>
      </table>

      <h3 className="mt-5 my-4">Order Items:</h3>

      <hr />
      {order?.orderItems?.map((item) => (
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
            </div>
            ))}
      <hr />
    </div>

    <div className="col-12 col-lg-3 mt-5">
      <h4 className="my-4">Status</h4>

      <div className="mb-3">
        <select className="form-select" name="status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      <button className="btn btn-primary w-100" onClick={updateOrderStatusHandler(order?._id)}>Update Status</button>
      <h4 className="mt-5 mb-3">Order Invoice</h4>
      <Link to={`/invoice/order/${order?._id}`} className="btn btn-success w-100">
        <i className="fa fa-print"></i> Generate Invoice
      </Link>
    </div>
  </div>
    </AdminLayout>
  )
};

export default ProcessingOrder;
