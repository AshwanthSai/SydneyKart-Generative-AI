import mongoose from "mongoose";

class APIFilters {
    /* 
        Query = Resource (Table name)
        QueryStr = App instead of Apple
    */
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    /* Search with Mongo Regex */
    search() {
        let keyword = this.queryStr.keyword 
        ? {
            name : {
                // Mongoose method for pattern Matching
                "$regex" : this.queryStr.keyword,
                // Mongoose method for ignoring Case Sensitivity
                "options": i
            }
        } : {};
        
        /* 
            Creating a new local variable for the Instance
        */
        this.query = this.query.find({...keyword})
        /* Returning the entire Object */
        return this
    }

    /* Filter with Categories, Ratings or Price */
    filter() {
        let queryCopy = {...this.queryStr}
        /* 
            Remove Keyword = Apple
            We need only the Filter Name
        */
        let fieldsToRemove = ["keyword","page"]
        /* Remove all unwanted fields from our Req.Keywords Object */
        fieldsToRemove.forEach(keyword => delete queryCopy[keyword])

        // If Price [GTE or LTE], then add $ infront of the operation.
        /*
            Of Shape
            {
                price : {
                    "gte" : 500;
                }
            }
        
        */
        let queryStr = JSON.stringify(queryCopy)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
         /*
            Of Shape
            {
                price : {
                    "$gte" : 500;
                }
            }
        
        */
        this.query = this.query.find(JSON.parse(queryStr))
        return this
    }

    pagination(resPerPage){
        let currentPage = Number(this.queryStr.page) || 1
        // Say resPerPage is 5
        // 1st Page = 5 * (1 - 1) = Skip 0
        // 2nd Page = 5 * (2 - 1) = Skip 5 
        // 3rd Page = 5 * (3 - 1) = Skip 10 
        let skip = resPerPage * (currentPage - 1)

        this.query = this.query.limit(resPerPage).skip(skip)
        return this
    }
}

export default APIFilters;