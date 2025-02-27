import React, { useEffect, useState } from "react";
import MetaData from "../Components/Layout/MetaData";
import { useGetProductsQuery } from "../store/api/productAPI";
import ProductItem from "./Product/ProductItem";
import { Loader } from "./Layout/Loader";
import { toast } from 'react-toastify';
import CustomPagination from "./Layout/CustomPagination";
import { useSearchParams } from "react-router-dom";
import Filters from "./Layout/Filters";
import NotFound from "./Admin/NotFound";

const Home = () => {
  /* 
  Fetch params from URL and send request
  Aux Pagination
  */
  const [isMobile, setIsMobile] = useState(false);
  let [searchParams] = useSearchParams();
  let page = Number(searchParams.get("page")) || 1;
  let keyword = searchParams.get("keyword") || "";
  let min = Number(searchParams.get("min")) || "";
  let max = Number(searchParams.get("max")) || "";
  let category = searchParams.get("category") || "";
  let ratings = searchParams.get("ratings") || "";


  let params = {page, keyword}
  /* 
    - If min or max is empty, do no append as search query 
  */
  if(min) params.min = min;
  if(max) params.max = max;
  if(category) params.category = category;
  if(ratings) params.ratings = ratings;
  const {data, isLoading, error, isError} = useGetProductsQuery(params);
  console.log(data)
  const columnSize = keyword ? 3 : 3

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    // Initial check
    checkMobile();
    // Add event listener
    window.addEventListener('resize', checkMobile);
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  useEffect(() => {
    if(isError) {
      toast.error(error.data.message)
    }
  }, [isError,error])

  if(isLoading) {
    return <Loader/>
  }

  if (error && error?.status == 404) {
    return <NotFound />;
  }

  return (
    <>
      <MetaData title="Buy Best Products Online" />
      <div className={isMobile ? 'container-fluid px-0' : 'row'}>
        {keyword && !isMobile && (
          <div className="col-6 col-md-3 mt-5">
            <Filters />
          </div>
        )}
        <div className={`col-6 ${keyword ? "col-md-9" : "col-md-12"}`}>
          <h1 
            id="products_heading" 
            className={`text-secondary ${isMobile ? 'products-heading' : ''}`}
          >
            {keyword
              ? `${data?.products?.length} Products found with keyword: ${keyword}`
              : "Latest Products"}
          </h1>
          <section id="products" className="products-section mt-2 ms-2">
            <div className="product-grid">
              {data && data.products.map(product => (
                <ProductItem 
                  key={product._id}
                  product={product} 
                  columnSize={isMobile ? 12 : columnSize}
                />
              ))}
            </div>
          </section>
        </div>
        <CustomPagination 
          filteredProductsCount={data?.filteredProductsCount} 
          resPerPage={isMobile ? 4 : data?.resPerPage} 
        />
      </div>
    </>
  );
};

export default Home;