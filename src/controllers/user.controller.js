const User = require("../schema/user.schema");
const Post = require('../schema/post.schema');
module.exports.getUsersWithPostCount = async (req, res) => {
  try {
    //TODO: Implement this API
    if(req.query.page==undefined){
      req.query.page=1
    }
    if(req.query.limit==undefined){
      req.query.limit=10
    }
    let limit=parseInt(req.query.limit)
    let totalUser=await Post.countDocuments()
    
    let list=await Post.find().populate({path:'userId',select:['_id','name']}).select('posts').skip((parseInt(req.query.page)-1)*limit).limit(limit)

    let page=parseInt(req.query.page)
    currentPage=req.query.page
    hasNextPage=limit*page<totalUser
    hasPreviousPage=page>1
    nextPage=page+1
    previousPage=function(){
        if((page-1)>0)return page-1
        else return null
    }
    lastPage=Math.ceil(totalUser/limit)
    limit=10
    let pagination={
        totalDocs: totalUser,
        limit: limit,
        page: req.query.page,
        totalPages: Math.ceil(totalUser/limit),
        pagingCounter: 1,
        hasPrevPage: page>1,
        hasNextPage: limit*page<totalUser,
        prevPage: previousPage,
        nextPage: page+1

    }
        res.status(200).json({data:{users:list,pagination:pagination}})
  } catch (error) {
    res.send({ error: error.message });
  }
};
