Meteor.subscribe('thePosts');

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
  },
  'click .comment' : function() {
    var newCommentFormShowState = Session.get('showNewCommentForm');
    newCommentFormShowState = !newCommentFormShowState;
    Session.set('showNewCommentForm', newCommentFormShowState);
    var selectedPost = Session.get('selectedPost');
    Session.set('parentPostId', selectedPost);
  },
  'click .newPost' : function() {
    var newPostFormShowState = Session.get('showNewPostForm');
    newPostFormShowState = !newPostFormShowState;
    Session.set('showNewPostForm', newPostFormShowState);
    Session.set('parentPostId', 'root');
  },
  'submit form' : function(event) {  // change to Post form
    event.preventDefault();
    var postNameVar = event.target.postName.value;
    var postContentVar = event.target.postContent.value;
    var parentPostId = Session.get('parentPostId');
    Meteor.call('insertPostData', postNameVar, postContentVar, parentPostId);
  },
  'submit commentForm' : function(event) {
    event.preventDefault();
    var selectedPost = Session.get('selectedPost');
    var commentContentVar = event.target.commentContent.value;
    var parentPostId = Session.get('parentPostId');
    Meteor.call('addComment', selectedPost, commentContentVar, parentPostId);
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
  },
  'showNewPostForm' : function() {
    return Session.get('showNewPostForm');
  },
  'showNewCommentForm' : function() {
    return Session.get('showNewCommentForm');
  }
});
