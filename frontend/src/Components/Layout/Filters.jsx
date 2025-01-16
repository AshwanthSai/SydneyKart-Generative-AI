import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getPriceQuery } from "../../utils/filterHelper";
import {PRODUCT_CATEGORIES} from "../../utils/constants";
import ReactStars from "react-stars";

const Filters = () => {
  const [min, setMin] = useState()
  const [max, setMax] = useState()
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();


  const submitClickHandler = (e) => {
        /* 
            Only allow one checkbox to be selected. You do not want to filter multiple categories.
            Since, our category list is mutually exclusive
        */
        const presentCheckbox = e.target;
        const presentCheckboxName = e.target.name
        const checkbox = document.getElementsByName(presentCheckboxName);
        checkbox.forEach((checkbox) => {
            if(checkbox !== presentCheckbox) {
                checkbox.checked = false;
            }
        })
        /* 
           Is checkbox checked ? 
           if not, remove from searchparams
           If checked, 
              and if category key is present in search params, update the value
              else add the key value pair to search params            
        */
        if(presentCheckbox.checked == false) {
            console.log(presentCheckboxName)
            if(searchParams.has(presentCheckboxName)) {
                searchParams.delete(presentCheckboxName);
                const path = window.location.pathname + "?" + searchParams.toString();
                navigate(path);
            }
        } else {
            if(searchParams.has(presentCheckboxName)) {
                searchParams.set(presentCheckboxName, presentCheckbox.value);
            } else {
                searchParams.append(presentCheckboxName, presentCheckbox.value);
            }
            const path = window.location.pathname + "?" + searchParams.toString();
            navigate(path);
        }
  }

  const submitHandler = (e) => {
    e.preventDefault();
    searchParams = getPriceQuery(searchParams, "min", min);
    searchParams = getPriceQuery(searchParams, "max", max);
    /* 
        URL: http://localhost:3000/products?keyword=phone
        pathname returns: /products
        searchParams.toString()
        keyword=Apple&min=10&max=150
    */
    
    const path = window.location.pathname + "?" + searchParams.toString();
    navigate(path);
  }

  /* 
    This function will check each checkbox value with searchParam value, if true.
    it will enable the defaultCheck attribute of that particular checkbox.
  */
  const defaultCheckHandler = (checkBoxType, checkBoxValue) => {
    const searchParamValue = searchParams.get(checkBoxType);
    if(searchParamValue == checkBoxValue) {
        return true;
    }
    return false;
  }
 
  useEffect(() => {
    searchParams.get("min") && setMin(searchParams.get("min"))
    searchParams.get("max") && setMax(searchParams.get("max"))
  },[])
 
  return (
        <div className="border p-3 filter">
        <h3>Filters</h3>
        <hr />
        <h5 className="filter-heading mb-3">Price</h5>
        <form
            id="filter_form"
            className="px-2"
            onSubmit={submitHandler}
        >
        <div classNameName="row">
            <div className="col">
            <input
                type="text"
                className="form-control"
                placeholder="Min ($)"
                name="min"
                value={min}
                onChange={(e) => setMin(e.target.value)}
            />
            </div>
            <div className="col">
            <input
                type="text"
                className="form-control"
                placeholder="Max ($)"
                name="max"
                value={max}
                onChange= {(e) => setMax(e.target.value)}
            />
            </div>
            <div className="col">
            <button type="submit" className="btn btn-primary">GO</button>
            </div>
        </div>
        </form>
        <hr />
        <h5 className="mb-3">Category</h5>
         {PRODUCT_CATEGORIES.map((category) => {
              return (
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        name="category"
                        id="check4"
                        value={category}
                        onClick={submitClickHandler}
                        defaultChecked = {defaultCheckHandler("category",category)}
                    />
                    <label className="form-check-label" for="check4"> {category} </label>
                </div>)
         })}
        <hr />
        <h5 className="mb-3">Ratings</h5>
        <div className="form-check">
        {[5,4,3,2,1].map((rating) => {
            return (<>
                <input
                    className="form-check-input"
                    type="checkbox"
                    name="ratings"
                    id={`check${rating}`}
                    value={rating}
                    onClick={submitClickHandler}
                    defaultChecked = {defaultCheckHandler("ratings",rating)}
                />
                <label className="form-check-label" for={`check${rating}`}>
                <ReactStars
                    count={5}
                    value={rating}
                    size={24}
                    color2={'#ffd700'}
                    edit={false}
                    />
                </label>
                <br/>
            </>)
         })}
        </div>
  </div>
  )
};

export default Filters;
