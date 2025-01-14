import React from "react";
import MetaData from "./MetaData";
import { useGetProductsQuery } from "../services/productAPI";
import ProductItem from "./Product/ProductItem";
import { Loader } from "./Layout/Loader";

const Home = () => {
  const {data, isLoading, error} = useGetProductsQuery();
  
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
      </div>
    </>
  );
};

export default Home;