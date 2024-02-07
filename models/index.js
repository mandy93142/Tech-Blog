const Sequelize = require('sequelize');
const config = require('../config/config.js')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const User = require('./User')(sequelize);
const Post = require('./Post')(sequelize);
const Comment = require('./Comment')(sequelize);

// Associations
User.hasMany(Post, {
  foreignKey: 'userId',
  as: 'posts'
});

Post.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

Post.hasMany(Comment, {
  foreignKey: 'postId',
  as: 'comments'
});

Comment.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

Comment.belongsTo(Post, {
  foreignKey: 'postId',
  as: 'post'
});

// Export models and sequelize connection
module.exports = {
  sequelize,
  Sequelize,
  User,
  Post,
  Comment
};
