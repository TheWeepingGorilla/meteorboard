Meteor.publish('thePosts', function(){
  var currentUserId = this.userId;
  return PostsList.find()
});
Meteor.publish("userData", function () {
  if (this.userId) {
    Meteor.users.update({_id: this.userId}, {$set: {permissions: ["test", "test2"]} });
    return Meteor.users.find({_id: this.userId},
                             {fields: {'permissions': 1} });
  } else {
    this.ready();
  }
});


Meteor.methods({
  'insertPostData' : function(postNameVar, postContentVar) {
    var currentUserId = Meteor.userId();
    PostsList.insert({
      name: postNameVar,
      content: postContentVar,
      score: 0,
      createdBy: currentUserId,
      votes: [],
    });
  },
  'removePostData' : function(selectedPost) {
    if ( permitted(Meteor.userId(),selectedPost,"author_delete_post") ) {
      PostsList.remove(selectedPost);
    }
  },
  'modifyPostScore' : function(selectedPost, scoreValue) {
    var currentUserId = Meteor.userId();
    if ( permitted(Meteor.userId(), selectedPost, "vote_on_post") ) {
      PostsList.update(selectedPost, {$inc: {score: scoreValue} });
      PostsList.update(selectedPost, {$set: {votes: [currentUserId]} });
    }
  }
});

function permitted(userId, selectedPost, action) {
  var selectedPostCreator = PostsList.findOne(selectedPost).createdBy;
  var postToModify = PostsList.findOne(selectedPost);
  switch (action) {
    case "author_delete_post" :
      return (selectedPostCreator === userId) && (author_can_delete);
    case "vote_on_post" :
      return (postToModify.votes.indexOf(userId) === -1) && (postToModify.createdBy !== userId) && (userId !== null);
    case "edit_post" :
      return (postToModify.createdBy === userId) && (author_can_edit);
    default :
      return false;
  }
};










