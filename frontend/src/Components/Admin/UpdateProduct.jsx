import React, { useEffect, useState } from "react";
import {PRODUCT_CATEGORIES} from "../../utils/constants.js"
import{useGetProductDetailsQuery, useNewProductMutation, useUpdateProductMutation} from "../../store/api/productAPI"
import { toast } from "react-toastify";
import AdminLayout from "../Layout/AdminLayout";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { use } from "react";

const UpdateProduct = () => {
    const navigate = useNavigate();
    const{id} = useParams();
    const[updateProduct, {isLoading, isSuccess, isError, error}] = useUpdateProductMutation();
    const {data: productData} = useGetProductDetailsQuery(id)

    useEffect(() => {

        if (isError) {
            toast.error(error?.data?.message);
        }
        if(isSuccess){
            toast.success("Product Updated Successfully");
        }
        if(productData){
            setProduct ({
                name: productData?.product?.name,
                description: productData?.product?.description,
                price: productData?.product?.price,
                stock: productData?.product?.stock,
                category: productData?.product?.category,
                seller: productData?.product?.seller,
            })
        }
    }, [error, isSuccess, productData, isError]);

    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "Electronics",
        seller: "",
    })
    
    const{name, description, price, stock, seller} = product;
    
    const onChange = (e) => {
        //Instead of Multiple Functions, we simply use one function. 
        setProduct({...product, [e.target.name]: e.target.value})
    }

    const submitHandler = async(e) => {
        e.preventDefault();
        await updateProduct({id, product});
        navigate("/admin/products")
    }
    
  return(
    <>
    <AdminLayout>
    <div className="row wrapper">
      <div className="col-10 col-lg-10 mt-5 mt-lg-0">
        <form className="shadow rounded bg-body" onSubmit={submitHandler}>
          <h2 className="mb-4">Update Product</h2>
          <div className="mb-3">
            <label htmlFor="name_field" className="form-label"> Name </label>
            <input
              type="text"
              id="name_field"
              className="form-control"
              name="name"
              value={name}
              onChange={onChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description_field" className="form-label">
              Description
            </label>
            <textarea
              className="form-control"
              id="description_field"
              rows="8"
              name="description"
              value={description}
              onChange={onChange}
            ></textarea>
          </div>

          <div className="row">
            <div className="mb-3 col">
              <label htmlFor="price_field" className="form-label"> Price </label>
              <input
                type="text"
                id="price_field"
                className="form-control"
                name="price"
                value={price}
                onChange={onChange}
              />
            </div>

            <div className="mb-3 col">
              <label htmlFor="stock_field" className="form-label"> Stock </label>
              <input
                type="number"
                id="stock_field"
                className="form-control"
                name="stock"
                value={stock}
                onChange={onChange}
              />
            </div>
          </div>
          <div className="row">
            <div className="mb-3 col">
              <label htmlFor="category_field" className="form-label"> Category </label>
              <select className="form-select" id="category_field" name="category"
                onChange={onChange}
              >
                {PRODUCT_CATEGORIES.map((category, index) => {
                    return (<option value={category} key={index} >{category}</option>)
                })}
              </select>
            </div>
            <div className="mb-3 col">
              <label htmlFor="seller_field" className="form-label"> Seller Name </label>
              <input
                type="text"
                id="seller_field"
                className="form-control"
                name="seller"
                value={seller}
                onChange={onChange}
              />
            </div>
          </div>
          <button type="submit" className="btn w-100 py-2" disabled = {isLoading}>
          {isLoading ? "Updating..." : "UPDATE"}</button>
        </form>
      </div> 
    </div>
    </AdminLayout>
    </>
  )
};

export default UpdateProduct;
