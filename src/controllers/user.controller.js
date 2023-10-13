const User = require("../schema/user.schema");
const Post = require('../schema/post.schema');
module.exports.getUsersWithPostCount = async (req, res) => {
  try {
    //TODO: Implement this API
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    console.log(limit, page);
    const skip = (page - 1) * limit;

    const count = await User.countDocuments();

    const totalPages = Math.ceil(count / limit);
    console.log(totalPages);
    const hasPrevPage = page > 1;
    const hasNextPage = page > 0 && page < totalPages;

    const result = await User.aggregate([
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "userId",
          as: "userPosts",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          posts: { $size: "$userPosts" },
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    const pagination = {
      totalDocs: count,
      limit: limit,
      page: page,
      totalPages: totalPages,
      pagingCounter: (page - 1) * limit + 1,
      hasPrevPage: hasPrevPage,
      hasNextPage: hasNextPage,
      prevPage: page === 1 ? null : page - 1,
      nextPage: page >= totalPages ? null : page + 1,
    };

    res.status(200).json({ data: { users: result, pagination } });
  } catch (error) {
    res.send({ error: error.message });
  }
};
