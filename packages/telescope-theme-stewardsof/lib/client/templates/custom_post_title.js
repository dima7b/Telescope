// important: the helper must be defined on the *old* "post_title" template

Template.post_title.helpers({
  randomEmoji: function () {
    return _.sample(["😀", "😰", "👮", " 🌸", "🐮", "⛅️", "🍟", "🍌", "🎃", "⚽️", "🎵"]);
  }
});

Template.user_menu.helpers({
  avatarUrl: function() {
    var currentUser = Meteor.user(); return getAvatarUrl(currentUser);
  }
});

Template.post_vote.rendered = function(){
  $( ".post-vote" ).addClass( "s2 m1" );
};

Template.post_content.rendered = function(){
  $( ".post-content" ).addClass( "s7 m8 l9" );
};

Template.post_discuss.rendered = function(){
  $( ".post-discuss" ).addClass( "s3 m2 l1" );
};

Template.post_avatars.rendered = function(){
  $( ".post-avatars" ).addClass( "m1 hide-on-small-only" );
};

Template.posts_daily.onRendered(function(){
  $('.load-more-days-button').addClass('waves-effect waves-light btn');
});

Template.user_info.onRendered(function(){
  this.$('ul.tabs').tabs();
});

Template.post_submit.onRendered(function(){
  if ($('button[type=submit]').hasClass('loading')) {
    e.preventDefault();
    $('#post-thanks').addClass('shown');
  }
});

Template.layout.events({
  'click .modal-close': function (e) {
    $('#post-thanks, #invite-thanks').removeClass('shown');
  }
});

Template.comment_submit.rendered = function(){
  $('.comment-form, .comments').wrapAll('<div class="comment-wrapper">');
  $('#submitCommentForm textarea').attr('placeholder', 'Add Comment');
  $('#submitCommentForm button').attr('id', 'submitCommentFormButton');
  $('#submitCommentForm .af-defaultFieldGroup textarea').on('keyup change', function() {
    if (this.value.length > 0) {
      $('#submitCommentForm #submitCommentFormButton').show();
    } else {
      $('#submitCommentForm #submitCommentFormButton').hide();
    }
  });
  $('textarea').addClass('materialize-textarea');
  $('#submitCommentFormButton').unwrap();
};


Template.layout.onRendered(function(){
  $('.modal-trigger').leanModal({
    opacity: 0,
    dismissible: true
  });
  $('.at-btn, .at-btn.submit').addClass('waves-effect waves-light btn');
  $('.form-group').wrap('<div class="row">');
  $('.form-group').addClass('input-field col s12');
  $('.form-group').removeClass('form-group');
  // $('textarea').addClass('materialize-textarea');
});

Template.user_account.onRendered(function(){
  $('.form-group').wrap('<div class="row">');
  $('.form-group').addClass('input-field col s12');
  $('.form-group').removeClass('form-group');
  $('textarea').addClass('materialize-textarea');
  // var $toolbar = $('label > input');
  // $toolbar.parent().before($toolbar);
});

Template.comment_item.rendered = function(){
  $('textarea').on('keyup change', function() {
    if (this.value.length > 0) {
      $('button').show();
    } else {
      $('button').hide();
    }
  });
};
