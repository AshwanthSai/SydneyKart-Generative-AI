import React, { useEffect } from "react";
import { useMyOrdersQuery } from "../../store/api/orderAPI";
import { toast } from "react-toastify";
import { MDBDataTable } from "mdbreact";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader } from "../Layout/Loader";
import { useDispatch } from "react-redux";
import { clearCart } from "../../store/features/cartSlice";
import MetaData from "../Layout/MetaData";

const MyOrders = () => {
    const [searchParams] = useSearchParams();
    const orderSuccess   = searchParams.get('order_success') || "false";
    const dispatch =  useDispatch();
    const navigate = useNavigate();
    const {data,error,isLoading,isError} = useMyOrdersQuery();

    useEffect(() => {
        if(isError) {
            toast.error(error.data.message)
        }
        if(orderSuccess ) {
            dispatch(clearCart());
            // Refresh the page to reload the nav bar.
            // You want to navigate back and clear the searchParams
            //  else the page will keep refreshing.
            navigate("/me/orders");
        }

    }, [error, clearCart])


    if (isLoading) return <Loader />;

    const setData = () => {
    /* 
        Create a M1 X M2 Matrix, where M1 = Number of Columns and M2 = Number of Orders  
        Notice each item in M1 and M2 are objects
    */
        const orders = {
            columns: [
            {
                label: "ID",
                field: "id",
                sort: "asc",
            },
            {
                label: "Amount",
                field: "amount",
                sort: "asc",
            },
            {
                label: "Payment Status",
                field: "status",
                sort: "asc",
            },
            {
                label: "Order Status",
                field: "orderStatus",
                sort: "asc",
            },
            {
                label: "Actions",
                field: "actions",
                sort: "asc",
            },
            ],
            rows: [],
        };

        data?.orders?.forEach((order) => {
            orders.rows.push({
            /* Match with field name */
            id: order?._id,
            amount: `$${order?.totalAmount}`,
            status: order?.paymentInfo?.status?.toUpperCase(),
            orderStatus: order?.orderStatus,
            actions: (
                <>
                {/* Class Blue Outline for Button */}
                <Link to={`/me/orders/${order?._id}`} className="btn btn-primary">
                    <i className="fa fa-eye"></i>
                </Link>
                <Link
                    to={`/invoice/order/${order?._id}`}
                    className="btn btn-success ms-2"
                >
                    <i className="fa fa-print"></i>
                </Link>
                </>
            ),
            });
        });
    
        return orders;
    }

  return (
    <>
    <MetaData title={"My Orders"} />
    <div>
        <h1 className= "my-5">{data && data.orders.length} Orders</h1>
        <MDBDataTable
        data = {setData()}
        className="px-3"
        bordered
        striped
        hover
      />
    </div>
    </>
  )
};

export default MyOrders;
