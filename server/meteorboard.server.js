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
    PostsList.remove(selectedPost);
  },
  'modifyPostScore' : function(selectedPost, scoreValue){
    PostsList.update(selectedPost, {$inc: {score: scoreValue} });
  }
});
