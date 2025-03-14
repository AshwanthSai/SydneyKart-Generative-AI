import React, { useEffect } from "react";
import { toast } from 'react-toastify';
import { useProductRecommendationsMutation } from "../../store/api/productAPI";
import ProductItem from "./ProductItem";
import NotFound from "../Admin/NotFound";
import { Loader } from "../Layout/Loader";

const ProductRecommendations = ({item}) => {
  console.log(item)
  const [productRecommendations, {data, isLoading, error, isError}] = useProductRecommendationsMutation();

  useEffect(async() => {
    await productRecommendations(item)
    console.log(item)
    console.log("Call Triggered")
    console.log(data)
  },[item,productRecommendations])

  useEffect(() => {
    if(isError) {
      toast.error(error.data.message)
      console.log(error)
    }
  }, [isError,error])

  if(isLoading) {
    return <Loader/>
  }

  if (error && error?.status === 404) {
    return <NotFound />;
  }

  return (
    <>
        <div className="mt-5">
          <h1 align="center">AI Product Recommendations</h1>
            <section id="products" className="mt-5">
              <div className="row">
              {/* my is top and bottom */}
              {data && data.map(product => {
                  //4 products per row
                  return <ProductItem recommendation = {true} product = {product} columnSize ={3}/>
                })}
              </div>
            </section>
        </div>
    </>
  );
};

export default ProductRecommendations;