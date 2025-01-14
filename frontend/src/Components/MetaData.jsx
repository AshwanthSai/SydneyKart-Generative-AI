import React from "react";
import {Helmet} from "react-helmet";

/* 
  - Means to Add SEO information to Pages Dynamically.
*/

const MetaData = ({title}) => {
  return (
    <>
    <Helmet>
        <meta charSet="utf-8" />
        <title>{title} - Shop IT</title>
    </Helmet>
    </>
  )
};

export default MetaData;
