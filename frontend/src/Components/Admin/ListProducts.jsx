import React, { useEffect } from "react";
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";
import {
  useDeleteProductMutation,
  useGetAdminProductsQuery,
} from "../../store/api/productAPI";
import AdminLayout from "../Layout/AdminLayout"
import { toast } from "react-toastify";
import { Loader } from "../Layout/Loader";
import MetaData from "../Layout/MetaData";

const ListProducts = () => {
  const { data, isLoading, error } = useGetAdminProductsQuery();
  const [deleteProduct, {isError: deleteProductIsError, isLoading : deleteProductIsLoading, error : deleteProductError, isSuccess : deleteProductSucess }]
     = useDeleteProductMutation();

  const deleteProductHandler = (product) => () => {
    deleteProduct({id : product?._id})
  }

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (deleteProductIsError) {
      toast.error(deleteProductError?.data?.message);
    }
    if(deleteProductSucess){
      toast.success("Product Deleted Successfully")
    }

  }, [error, deleteProductIsError,deleteProductSucess ]);


  const setProducts = () => {
    const products = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Name",
          field: "name",
          sort: "asc",
        },
        {
          label: "Stock",
          field: "stock",
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

    data?.products?.forEach((product) => {
      products.rows.push({
        id: product?._id,
        name: `${product?.name?.substring(0, 20)}...`,
        stock: product?.stock,
        actions: (
          <>
            <Link
              to={`/admin/products/${product?._id}`}
              className="btn btn-outline-primary"
            >
              <i className="fa fa-pencil"></i>
            </Link>
            <Link
              to={`/admin/products/${product?._id}/upload_images`}
              className="btn btn-outline-success ms-2"
            >
              <i className="fa fa-image"></i>
            </Link>
            <button
              className="btn btn-outline-danger ms-2"
              onClick={deleteProductHandler(product)}
              disabled={deleteProductIsLoading}
            >
              <i className="fa fa-trash"></i>
            </button>
          </>
        ),
      });
    });

    return products;
  };

  if (isLoading) return <Loader />;

  return (
    <AdminLayout>
      <MetaData title={"All Products"} />

      <h1 className="my-5">{data?.products?.length} Products</h1>

      <MDBDataTable
        data={setProducts()}
        className="px-3"
        bordered
        striped
        hover
      />
    </AdminLayout>
  );
};

export default ListProducts;