import React, { useEffect } from "react";
import MetaData from "./MetaData";
import { useGetProductsQuery } from "../services/productAPI";
import ProductItem from "./Product/ProductItem";
import { Loader } from "./Layout/Loader";
import { toast } from 'react-toastify';
import CustomPagination from "./Layout/CustomPagination";
import { useSearchParams } from "react-router-dom";

const Home = () => {
  /* 
    Fetch params from URL and send request
    Aux Pagination Component
  */
  let [searchParams] = useSearchParams();
  let page = Number(searchParams.get("page")) || 1;
  let params = {page}
  const {data, isLoading, error, isError} = useGetProductsQuery(params);


  useEffect(() => {
    if(isError) {
      toast.error(error.data.message)
    }
  }, [isError,error])

  if(isLoading) {
    return <Loader/>
  }

  return (
    <>
    <MetaData title = "Buy Best Products Online "/>
      <div className="row">
        <div className="col-6 col-md-12">
          <h1 id="products_heading" className="text-secondary"> 
            Latest Products
          </h1>
          <section id="products" className="mt-5">
            <div className="row">
            {/* my is top and bottom */}
            {data && data.products.map(product => {
                return <ProductItem product = {product}/>
              })}
            </div>
          </section>
        </div>
        <CustomPagination filteredProductsCount = {data?.filteredProductsCount} resPerPage = {data?.resPerPage} />
      </div>
    </>
  );
};

export default Home;