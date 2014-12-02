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
      createdBy: currentUserId
    });
  },
  'removePostData' : function(selectedPost){
    var currentUserId = Meteor.userId();
    var selectedPostCreator = PostsList.findOne(selectedPost).createdBy;
    if ( (selectedPostCreator === currentUserId) && (author_can_delete) ) {
      PostsList.remove(selectedPost);
    }
  },
  'modifyPostScore' : function(selectedPost, scoreValue){
    PostsList.update(selectedPost, {$inc: {score: scoreValue} });
  }
});
