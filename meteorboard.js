PostsList = new Mongo.Collection('posts');

function permitted(userId, selectedPost, action) {
  var selectedPostCreator = PostsList.findOne(selectedPost).createdBy;
  var postToModify = PostsList.findOne(selectedPost);
  switch (action) {
    case "author_delete_post" :
      return (selectedPostCreator === userId) && (author_can_delete);
    case "vote_on_post" :
      return (postToModify.votes.indexOf(userId) === -1) && (postToModify.createdBy !== userId) && (userId !== null);
    case "edit post" :
      return (postToModify.createdBy === userId);
    default :
      return false;
  }
};