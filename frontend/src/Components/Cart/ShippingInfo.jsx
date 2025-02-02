import React, { useEffect, useState } from "react";
import {countries} from 'countries-list'
import { useDispatch, useSelector } from "react-redux";
import {saveShippingData} from "../../store/features/cartSlice"
import MetaData from "../Layout/MetaData";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "./CheckoutSteps";

const countryList = Object.values(countries).map(country => country.name);

const ShippingInfo = () => {
  const dispatch = useDispatch();
  const { shippingData : preExistingShippingdata } = useSelector(store => store.cart)
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    address : "",
    city : "",
    phoneNo: "",
    zipCode : "",
    country : "",
  })

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(saveShippingData(shippingInfo))
    navigate("/confirm_order")
  }

  useEffect(() => {
    setShippingInfo(preExistingShippingdata)
  }, [preExistingShippingdata])

  const handleCountryChange = (e) => {
    const newValue = e.target.value;
    setShippingInfo(prevState => ({
      ...prevState,
      country: newValue
    }));
  };

  return (
    <>
    <CheckoutSteps shipping/>
    <MetaData title="Shipping Info" />
     <div className="row wrapper mb-5">
      <div className="col-10 col-lg-5">
        <form
          className="shadow rounded bg-body"
          onSubmit={submitHandler}
        >
          <h2 className="mb-4">Shipping Info</h2>
          <div className="mb-3">
            <label htmlFor="address_field" className="form-label">Address</label>
            <input
              type="text"
              id="address_field"
              className="form-control"
              name="address"
              required
              value={shippingInfo.address}
              onChange={e => setShippingInfo({...shippingInfo, address : e.target.value})}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="city_field" className="form-label">City</label>
            <input
              type="text"
              id="city_field"
              className="form-control"
              name="city"
              value={shippingInfo.city}
              onChange={e => setShippingInfo({...shippingInfo, city : e.target.value})}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phone_field" className="form-label">Phone No</label>
            <input
              type="tel"
              id="phone_field"
              className="form-control"
              name="phoneNo"
              value={shippingInfo.phoneNo}
              onChange={e => setShippingInfo({...shippingInfo, phoneNo : e.target.value})}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="postal_code_field" className="form-label">
            Postal Code</label>
            <input
              type="number"
              id="postal_code_field"
              className="form-control"
              name="postalCode"
              value={shippingInfo.zipCode}
              onChange={e => setShippingInfo({...shippingInfo, zipCode : e.target.value})}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="country_field" className="form-label">Country</label>
            <select
              id="country_field"
              className="form-select"
              name="country"
              required
              value={shippingInfo.country}
              onChange = {handleCountryChange}
            >
             {countryList.map((country, index) => (
                <option key={index} value={country}>{country}</option>
              ))}
            </select>
          </div>
          <button id="shipping_btn" type="submit" className="btn w-100 py-2">
            CONTINUE
          </button>
        </form>
      </div>
    </div>
    </>
  )
};

export default ShippingInfo;
