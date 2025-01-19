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
 const taxAmount = Number((subtotalAmount * 0.15).toFixed(2));
 const totalAmount = subtotalAmount + shippingAmount + taxAmount;
 return {
   subtotalAmount,
   shippingAmount,
   taxAmount,
   totalAmount
 }
}