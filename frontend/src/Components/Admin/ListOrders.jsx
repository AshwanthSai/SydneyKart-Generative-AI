import React, { useEffect } from "react";
import { MDBDataTable } from "mdbreact";
import { Link  } from "react-router-dom";
import AdminLayout from "../Layout/AdminLayout"
import { toast } from "react-toastify";
import { Loader } from "../Layout/Loader";
import MetaData from "../Layout/MetaData";
import { useDeleteOrderMutation, useGetOrdersQuery } from "../../store/api/orderAPI";

const ListProducts = () => {
  const { data, isLoading, error } = useGetOrdersQuery();
  const [deleteOrder, {isError: deleteOrderIsError, isLoading : deleteOrderIsLoading, error : deleteOrderError, isSuccess : deleteOrderSuccess }]
     = useDeleteOrderMutation();
  
  const deleteOrderHandler = (id) => () => {
    deleteOrder({id })
  } 

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (deleteOrderIsError) {
      toast.error(deleteOrderError?.data?.message);
    } 
   if(deleteOrderSuccess){
      toast.success("Order Deleted Successfully")
    }
  }, [error, deleteOrderIsError,deleteOrderSuccess, deleteOrderError]);


  const setOrders = () => {
    const orders = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Payment Status", 
          field: "paymentStatus",
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
        id: order?._id,
        paymentStatus: `${order?.paymentInfo?.status}`,
        orderStatus: order?.orderStatus,
        actions: (
          <>
            <Link
              to={`/admin/orders/${order?._id}`}
              className="btn btn-outline-primary"
            >
              <i className="fa fa-pencil"></i>
            </Link>
            <button
              className= "btn btn-outline-danger ms-2"
              onClick  = {deleteOrderHandler(order?._id)}
              disabled = {deleteOrderIsLoading}
            >
              <i className="fa fa-trash"></i>
            </button>
          </>
        ),
      });
    });

    return orders;
  };

  if (isLoading) return <Loader />;

  return (
    <AdminLayout>
      <MetaData title={"All Orders"} />

      <h1 className="my-5">{data?.orders?.length} Orders</h1>

      <MDBDataTable
        data={setOrders()}
        className="px-3"
        bordered
        striped
        hover
      />
    </AdminLayout>
  );
};

export default ListProducts;