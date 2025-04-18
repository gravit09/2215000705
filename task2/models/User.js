// In-memory storage for users
let users = new Map();

export const User = {
  findOneAndUpdate: async (query, update, options) => {
    const userId = query.userId;
    const existingUser = users.get(userId);

    if (existingUser) {
      const updatedUser = {
        ...existingUser,
        ...update,
        totalComments:
          (existingUser.totalComments || 0) + (update.$inc?.totalComments || 0),
      };
      users.set(userId, updatedUser);
      return updatedUser;
    } else {
      const newUser = {
        userId,
        name: update.name,
        totalComments: update.$inc?.totalComments || 0,
      };
      users.set(userId, newUser);
      return newUser;
    }
  },

  find: async (query = {}) => {
    let result = Array.from(users.values());

    // Handle sorting
    if (query.sort) {
      const [field, order] = Object.entries(query.sort)[0];
      result.sort((a, b) => {
        if (order === 1) return a[field] - b[field];
        return b[field] - a[field];
      });
    }

    // Handle limit
    if (query.limit) {
      result = result.slice(0, query.limit);
    }

    // Handle select
    if (query.select) {
      const fields = query.select.split(" ");
      result = result.map((user) => {
        const selected = {};
        fields.forEach((field) => {
          if (user[field] !== undefined) {
            selected[field] = user[field];
          }
        });
        return selected;
      });
    }

    return result;
  },
};
