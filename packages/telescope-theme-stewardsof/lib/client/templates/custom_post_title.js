// important: the helper must be defined on the *old* "post_title" template

Template.post_title.helpers({
  randomEmoji: function () {
    return _.sample(["😀", "😰", "👮", " 🌸", "🐮", "⛅️", "🍟", "🍌", "🎃", "⚽️", "🎵"]);
  }
});

Template.user_menu.helpers({
  avatarUrl: function() {
    var currentUser = Meteor.user();
    return getAvatarUrl(currentUser);
  }
});

Template.post_vote.rendered = function(){
  $( ".vote-actions" ).addClass( "col s2 m1" );
};

Template.post_content.rendered = function(){
  $( ".post-info" ).addClass( "col s7 m8 l8" );
};

Template.post_discuss.rendered = function(){
  $( ".discuss-link" ).addClass( "col s3 m2 l2" );
};

Template.post_avatars.rendered = function(){
  $( ".avatar-link" ).addClass( "col m1 hide-on-small-only right" );
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
    // $('#post-thanks').addClass('shown');
  }
});

Template.layout.events({
  'click .modal-close': function (e) {
    $('#post-thanks, #invite-thanks').removeClass('shown');
  },

  'click .fixed-action-btn.hide-on-large-only .dummy-btn': function (e) {
    $('.fixed-action-btn.hide-on-large-only .action-btn').removeClass('hidden');
    $('.fixed-action-btn.hide-on-large-only .dummy-btn').addClass('hidden');
  }

});

Template.post_page_meta.onRendered(function(){
  $('.share-options').removeClass('hidden');
});

Template.post_page_meta.events({
  'click .share-link': function (e) {
    $('.share-options').toggleClass('visible');
  }
});

Template.search.events({
  'click .search .zmdi-search': function (e) {
    $('li.search').addClass('active');
    $('li.search .zmdi-search').addClass('search-has-it');
    $('li.search').addClass('has-it');
    $('li.search #search, li.search .zmdi-close').css('display', 'inline-block');
  },

  'click .search .zmdi-close': function (e) {
    $('li.search.has-it').removeClass('has-it');
    $('li.search').removeClass('active');
    $('li.search .zmdi-search').removeClass('search-has-it');
    $('li.search #search, li.search .zmdi-close').css('display', 'none');
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
  $('.tooltipped').tooltip({delay: 50});
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

Template.admin_wrapper.onRendered(function(){
  $('.form-group').wrap('<div class="row">');
  $('.form-group').addClass('input-field col s12');
  $('.form-group').removeClass('form-group');
  $('textarea').addClass('materialize-textarea');
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

Meteor.startup(function () {
});
