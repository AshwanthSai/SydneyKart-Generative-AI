import React, { useEffect } from "react";
import "./Invoice.css"
import { useParams } from "react-router-dom";
import { useOrderDetailsQuery } from "../../store/api/orderAPI";
import { toast } from "react-toastify";
import { Loader } from "../Layout/Loader";
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";
import MetaData from "../Layout/MetaData";

const Invoice = () => {
    const {id} = useParams();
    const {data,error,isLoading,isError} = useOrderDetailsQuery(id);
    // If large payload, destructuring the first time will lead to errors, because the data has not arrived
    // The below helps, prevent it.
    const order = data?.order || {};
    const {totalAmount,taxAmount, shippingAmount,_id, createdAt, user, shippingInfo,paymentInfo, itemsPrice, orderItems } = order

    useEffect(() => {
        if(isError) {
            toast.error(error.data.message)
        } 
    }, [isError, error])


    if (isLoading) return <Loader />;

  const handleDownloadInvoice = (e) => {
    const invoice = document.getElementById("order_invoice");
    /* 
      Boiler plate from html2Canvas 
        -> Pass in DOM Element (invoice)
        -> Retrieve image as canvas object
    */
    html2canvas(invoice).then((canvas) => {
      /* 
        Convert to DataURL
      */
      const image = canvas.toDataURL("image/png");
      const invoicePdf = new jsPDF();
      // Helps center text horizontally
      const pdfWidth = invoicePdf.internal.pageSize.getWidth();
      /* Attach canvas object as image to pdf */
      invoicePdf.addImage(image, "PNG",
            0, 0, pdfWidth, 0);
      invoicePdf.save(`${_id}.pdf`);
    })}

  return (
    <>
    <MetaData title={"Order Invoice"} />
    <div className="order-invoice my-5">
      <div className="row d-flex justify-content-center mb-5">
        <button className="btn btn-success col-md-5" onClick={handleDownloadInvoice}>
          <i className="fa fa-print"></i> Download Invoice
        </button>
      </div>
      <div id="order_invoice" className="p-3 border border-secondary">
        <header className="clearfix">
          <div id="logo">
            <img src="/images/logo.png" alt="Company Logo" style={{borderRadius:"10px"}} />
          </div>
          <h1>INVOICE # ${_id}</h1>
          <div id="company" className="clearfix">
            <div>ShopIT</div>
            <div>
              55-61 Albion Street,
              <br />
              682507, AU
            </div>
            <div>(+61) 0450-269-735</div>
            <div>
              <a href="mailto:info@shopit.com">info@sydneykart.com</a>
            </div>
          </div>
          <div id="project">
            <div><span>Name</span> {user?.name}</div>
            <div><span>EMAIL</span> {user?.email}</div>
            <div><span>PHONE</span> {shippingInfo?.phoneNo}</div>
            <div>
              <span>ADDRESS</span> 
              {shippingInfo?.address}, {shippingInfo?.city},{" "}
              {shippingInfo?.zipCode}, {shippingInfo?.country}
            </div>
            <div><span>DATE</span> {new Date(createdAt).toLocaleString("en-US")}</div>
            <div><span>Status</span>{paymentInfo?.status}</div>
          </div>
        </header>
        <main>
          <table className="mt-5">
            <thead>
              <tr>
                <th className="service">ID</th>
                <th className="desc">NAME</th>
                <th>PRICE</th>
                <th>QTY</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
            {orderItems?.map((item, index) => (  
              <tr>
                <td className="service">{index+1}</td>
                <td className="desc">{item.name}</td>
                <td className="unit">${item.price}</td>
                <td className="qty">{item.quantity}</td>
                <td className="total">${item?.price * item?.quantity}</td>
              </tr>
            ))}

              <tr>
                <td colspan="4">
                  <b>SUBTOTAL</b>
                </td>
                <td className="total">${itemsPrice}</td>
              </tr>

              <tr>
                <td colspan="4">
                  <b>TAX 15%</b>
                </td>
                <td className="total">${taxAmount}</td>
              </tr>

              <tr>
                <td colspan="4">
                  <b>SHIPPING</b>
                </td>
                <td className="total">${shippingAmount}</td>
              </tr>

              <tr>
                <td colspan="4" className="grand total">
                  <b>GRAND TOTAL</b>
                </td>
                <td className="grand total">${totalAmount?.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          <div id="notices">
            <div>NOTICE:</div>
            <div className="notice">
              A finance charge of 1.5% will be made on unpaid balances after 30
              days.
            </div>
          </div>
        </main>
        <footer>
          Invoice was created on a computer and is valid without the signature.
        </footer>
      </div>
    </div>
    </>
  )
};

export default Invoice;
