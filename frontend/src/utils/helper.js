// Aux for setting Search Params in Product Filer Page 
export const getPriceQuery = (searchParams, key, value) => {
    const hasQueryValue = searchParams.has(key)
    /* 
    - If no value in searchparams then append
    = If value in searchparams and passed to function, then modify
    - if no value passed to function, then delete.
    */    
   
    if(!hasQueryValue && value){
            searchParams.append(key, value);
    } else if (hasQueryValue && value) {
            searchParams.set(key, value);
    } else {
            searchParams.delete(key);
    }

    return searchParams;
}

/* 
- Fetch the Cart Total Bill for Confirm Order Page 
*/
export const calculateOrderCost  = (cartItems) => {
 const subtotalAmount = Number(cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2));
 const shippingAmount = Number(subtotalAmount > 100 ? 0 : 25);
 const taxAmount = Number((subtotalAmount * 0.18).toFixed(2));
 const totalAmount = subtotalAmount + shippingAmount + taxAmount;
 return {
   subtotalAmount,
   shippingAmount,
   taxAmount,
   totalAmount
 }
}

/* 
   Fetch Base URLs for Sockets
*/
export const getBaseUrl = () => {
  const url = process.env.NODE_ENV === 'production' 
    ? process.env.REACT_APP_PROD_BACKEND_URL
    : process.env.REACT_APP_DEV_BACKEND_URL;

  // Split URL by '/' and reconstruct up to port
  const urlParts = url.split('/');
  const protocol = urlParts[0];
  const domain = urlParts[2];
  
  return `${protocol}//${domain}/`;
};
