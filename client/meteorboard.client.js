Meteor.subscribe('thePosts');
Meteor.subscribe("userData");

Template.meteorboard.events({
  'click .post': function() {
    var postId = this._id;
    Session.set('selectedPost', postId);
  },
  'click .increment': function() {
    var selectedPost = Session.get('selectedPost');
    Meteor.call('modifyPostScore', selectedPost, 1);
  },
  'click .decrement': function() {
    var selectedPost = Session.get('selectedPost');
    Meteor.call('modifyPostScore', selectedPost, -1);
  },
  'click .remove' : function() {
    var selectedPost = Session.get('selectedPost');
    Meteor.call('removePostData', selectedPost);
  }
});

Template.meteorboard.helpers({
  'post' : function(){
    var currentUserId = Meteor.userId();
    return PostsList.find({},{sort: {score: -1, name: 1} })
  },
  'selectedClass' : function() {
    var postId = this._id;
    var selectedPost = Session.get('selectedPost');
    if (postId === selectedPost) {
      return "selected"
    }
  },
  'showSelectedPost' : function() {
    var selectedPost = Session.get('selectedPost');
    return PostsList.findOne(selectedPost);
  },
  'canVote' : function() {
    var currentUserId = Meteor.userId();
    var selectedPost = Session.get('selectedPost');
    var postToModify = PostsList.findOne(selectedPost);
    var selectedPostCreator = PostsList.findOne(selectedPost).createdBy;
    return ( (postToModify.votes.indexOf(currentUserId) === -1) && (postToModify.createdBy !== currentUserId) && (currentUserId !== null) );
  },
  'canDelete' : function() {
    var currentUserId = Meteor.userId();
    var selectedPost = Session.get('selectedPost');
    var selectedPostCreator = PostsList.findOne(selectedPost).createdBy;
    return (selectedPostCreator === currentUserId) && (author_can_delete);
  }
});

Template.addPostForm.events({
  'submit form' : function(event) {
    event.preventDefault();
    var postNameVar = event.target.postName.value;
    var postContentVar = event.target.postContent.value;
    Meteor.call('insertPostData', postNameVar, postContentVar);
  }
});
