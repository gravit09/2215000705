// In-memory storage for posts
let posts = new Map();

export const Post = {
  findOneAndUpdate: async (query, update, options) => {
    const postId = query.postId;
    const existingPost = posts.get(postId);

    if (existingPost) {
      const updatedPost = {
        ...existingPost,
        ...update,
        commentCount:
          (existingPost.commentCount || 0) + (update.$inc?.commentCount || 0),
      };
      posts.set(postId, updatedPost);
      return updatedPost;
    } else {
      const newPost = {
        postId,
        userId: update.userId,
        content: update.content,
        commentCount: update.$inc?.commentCount || 0,
        createdAt: new Date(),
      };
      posts.set(postId, newPost);
      return newPost;
    }
  },

  find: async (query = {}) => {
    let result = Array.from(posts.values());

    if (query.commentCount) {
      result = result.filter(
        (post) => post.commentCount === query.commentCount
      );
    }

    return result;
  },

  findOne: async (query = {}) => {
    if (query.commentCount) {
      return Array.from(posts.values()).sort(
        (a, b) => b.commentCount - a.commentCount
      )[0];
    }
    return null;
  },
};
