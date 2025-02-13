import React, { useEffect, useState } from "react";
import AdminLayout from "../Layout/AdminLayout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {SalesChart} from "../Charts/SalesChart";
import { useLazyGetSalesQuery } from "../../store/api/orderAPI";
import { toast } from "react-toastify";
import MetaData from "../Layout/MetaData";


const Dashboard = () => {
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(1)));
    const [endDate, setEndDate] = useState(new Date());
    const [getSalesData, {data, isError, error}] = useLazyGetSalesQuery()

    const submitHandler = (e) => {
        e.preventDefault();
        /*  
            Always encode dates as ISO Strings, 
                ISO 8601 is recommended for URLs because:
                Unambiguous format
                URL-safe characters
                Timezone handling
                Universal standard
        */
        getSalesData({
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
        })
        console.log(data)
    }

    useEffect(() => {
        if(isError) {
          toast.error(error?.data?.message)
        }
       
        /* 
            Prefill Data on Component Mount
        */
        if(startDate && endDate && !data) {
            getSalesData({
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
            })
        }
      }, [isError,error])

  return (
    <>
        <AdminLayout> 
        <MetaData title={"Dashboard"} />
            <div className="d-flex justify-content-start align-items-center">
            <div className="mb-3 me-4">
                <label className="form-label d-block">Start Date</label>
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    className="form-control"
                />
          </div>
          <div className="mb-3">
            <label className="form-label d-block">End Date</label>
            <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                className="form-control"
            />
        </div>
        <button className="btn fetch-btn ms-4 mt-3 px-5" onClick={submitHandler}>Fetch</button>
        </div>

        <div className="row pr-4 my-5">
        <div className="col-xl-6 col-sm-12 mb-3">
            <div className="card text-white bg-success o-hidden h-100">
            <div className="card-body">
                <div className="text-center card-font-size">
                Sales
                <br />
                <b>&#8377;{data?.totalSales.toFixed(2)}</b>
                </div>
            </div>
            </div>
        </div>

        <div className="col-xl-6 col-sm-12 mb-3">
            <div className="card text-white bg-danger o-hidden h-100">
            <div className="card-body">
                <div className="text-center card-font-size">
                Orders
                <br />
                {/* Stripe does not allow, */}
                <b>{data?.totalOrders}</b>
                </div>
            </div>
            </div>
        </div>
        </div>
        <div className="mb-5">
            <SalesChart salesData = {data?.salesData} />
        </div>
        </AdminLayout>
    </>
  )
}

export default Dashboard;
