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