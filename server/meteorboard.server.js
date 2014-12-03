Meteor.publish('thePosts', function(){
  var currentUserId = this.userId;
  return PostsList.find()
});
Meteor.methods({
  'insertPostData' : function(postNameVar, postContentVar) {
    var currentUserId = Meteor.userId();
    PostsList.insert({
      name: postNameVar,
      content: postContentVar,
      score: 0,
      createdBy: currentUserId,
      votes: []
    });
  },
  'removePostData' : function(selectedPost){
    var currentUserId = Meteor.userId();
    var selectedPostCreator = PostsList.findOne(selectedPost).createdBy;
    if ( (selectedPostCreator === currentUserId) && (author_can_delete) ) {
      PostsList.remove(selectedPost);
    }
  },
  'modifyPostScore' : function(selectedPost, scoreValue) {
    var currentUserId = Meteor.userId();
    var postToModify = PostsList.findOne(selectedPost);
    if ( (postToModify.votes.indexOf(currentUserId) === -1) && (postToModify.createdBy !== currentUserId) ) {
      PostsList.update(selectedPost, {$inc: {score: scoreValue} });
      PostsList.update(selectedPost, {$set: {votes: [currentUserId]} });
    }
  }
});
