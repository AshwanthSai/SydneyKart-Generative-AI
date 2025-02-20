import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "react-js-pagination";

/* 
    - filteredProductsCount - Because at times, we search for particular products
    - resPerPage - Effects the number of displayed products
*/
const CustomPagination = ({filteredProductsCount, resPerPage}) => {
  const [currentPage, setCurrentPage] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentPage(1)
  }, [])

  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  
  /* 
    - We are not passing the PageNumber upwards. We simply modify the URL
    - Re-read the URL in Home Page and fetch new data.
  */
  const setCurrentPageNo = (pageNumber) => {
    // /products?page, page query parameter exists
    if(searchParams.has("page")) {
        searchParams.set("page", pageNumber)
    } else {
    // /products, page does not exits
        searchParams.append("page", pageNumber)
    }
    const path = "?" + searchParams.toString();
    console.log(path)
    navigate(path);
  }
    
  return (
    <div className = "d-flex justify-content-center my-5">
        {filteredProductsCount > resPerPage && <Pagination
            activePage={page}
            itemsCountPerPage={resPerPage}
            totalItemsCount={filteredProductsCount}
            pageRangeDisplayed={5}
            nextPageText={"Next"}
            prevPageText={"Prev"}
            firstPageText={"First"}
            lastPageText={"Last"}
            //Default class of the <li> tag
            itemClass="page-item"
            //Default class of the <a> tag
            linkClass="page-link"
            // pageNumber provided by component
            onChange={setCurrentPageNo}
        />}
    </div>
  );
};

export default CustomPagination;
