class APIFilters {
  constructor(query, queryStr) {
    // Query is resource name, product, user etc
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filters() {
    /* 
     { price: { lte: '100' }, ratings: '3'}
    */
    const queryCopy = { ...this.queryStr };
    // Fields to remove
    const fieldsToRemove = ["keyword", "page"];
    fieldsToRemove.forEach((el) => delete queryCopy[el]);
    /* 
     { price: { lte: '100' }}
    */

    // Advance filter for price, ratings etc
    let queryStr = JSON.stringify(queryCopy);
    /* 
     {"price":{"lte":"100"},"ratings":"3"}}
    */
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    // Parse JSON first
    let parsedQuery = JSON.parse(queryStr);

    // Handle ratings filter
    if (parsedQuery.ratings) {
        parsedQuery.ratings = {
            $gte: Number(parsedQuery.ratings)
        };
    }

    this.query = this.query.find(parsedQuery);
    return this;
  }

  pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

export default APIFilters;