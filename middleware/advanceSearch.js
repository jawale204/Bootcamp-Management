
const advanceSearch = (model,populate) => async (req,res,next) =>{
    let query;

    let reqQuery = {...req.query}

    //field to remove
    const removeFields= ['select','sort','page','limit']

    //remove the fields
    removeFields.forEach(value => delete reqQuery[value])

    //convert to string
    queryStr = JSON.stringify(reqQuery)

    //add $ at the start of gte,gt,lt,lte (replace) 
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g,match => `$${match}`)

    //create a query about the same
    query = model.find(JSON.parse(queryStr));

    //selected fields are added to query
    if(req.query.select){
        // splits and converts it into list and they join them with a space (String)
        const selectedFields = req.query.select.split(",").join(" ")
        query.select(selectedFields)
    }

    if(req.query.sort){
         // splits and converts it into list and they join them with a space (String)
         const sortFields = req.query.sort.split(",").join(" ")
         query.sort(sortFields)
         console.log(sortFields)
    }

    let page = req.query.page || 1
    let limit = req.query.limit || 25
    let skip = (page -1)*limit
    let endIndex = page*limit
    const totalDoc= await model.countDocuments()

    query.skip(skip).limit(limit)

    const pagination={};
    if(endIndex<totalDoc){
        pagination.next={
            page : parseInt(page)+1,
            limit
        }
    }
    if(skip>0){
        pagination.prev={
            page : parseInt(page) -1,
            limit
        }
    }
    

    //await for response i.e execute it 
    
    const results = await query.populate(populate);

    res.advanceSearch={success: true,count: results.length, pagination, data: results}

    next()
}
 module.exports = advanceSearch