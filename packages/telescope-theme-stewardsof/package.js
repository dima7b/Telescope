Package.describe({
  summary: 'Stewards Of',
  version: '0.1.0',
  name: 'telescope:theme-stewardsof'
});

Package.onUse(function (api) {

  // ---------------------------------- 1. Core dependency -----------------------------------

  api.use("telescope:core");

  // ---------------------------------- 2. Files to include ----------------------------------

  // i18n config (must come first)

  api.addFiles([
    'package-tap.i18n'
  ], ['client', 'server']);

  // client & server

  api.addFiles([
    'lib/custom_users.js',
    'lib/custom_posts.js',
    'lib/custom_fields.js',
    'lib/template_modules.js',
    'lib/callbacks.js'
  ], ['client', 'server']);

  // client

  api.addFiles([
    // 'lib/client/templates/hello.html',
    // 'lib/client/templates/hello.js',

    // Nav
    'lib/client/templates/nav/posts_menu.html',
    'lib/client/templates/nav/custom_header.html',
    'lib/client/templates/nav/custom_logo.html',
    'lib/client/templates/nav/custom_search.html',
    'lib/client/templates/nav/custom_menu_component.html',
    'lib/client/templates/nav/custom_user_menu_label.html',
    'lib/client/templates/nav/custom_notifications_mark_as_read.html',
    'lib/client/templates/nav/custom_notification_item.html',
    'lib/client/templates/nav/custom_notifications_menu.js',

    'lib/client/templates/common/custom_layout.html',
    'lib/client/templates/common/custom_submit_button.html',

    'lib/client/templates/posts/custom_post_item.html',
    'lib/client/templates/posts/custom_post_content.html',
    'lib/client/templates/posts/custom_post_vote.html',
    'lib/client/templates/posts/custom_post_discuss.html',
    'lib/client/templates/posts/custom_post_avatars.html',
    'lib/client/templates/posts/custom_post_rank.html',
    'lib/client/templates/posts/custom_posts_daily.html',
    'lib/client/templates/posts/custom_post_body.html',
    'lib/client/templates/posts/post_page_meta.html',
    'lib/client/templates/posts/custom_post_share.html',
    'lib/client/templates/posts/custom_posts_list_compact.html',
    'lib/client/templates/posts/custom_comments_list_compact.html',
    'lib/client/templates/posts/custom_post_admin.html',
    'lib/client/templates/posts/custom_post_info.html',
    'lib/client/templates/posts/custom_post_submit.html',
    'lib/client/templates/posts/custom_post_submit.js',

    'lib/client/templates/comments/custom_comment_submit.html',
    'lib/client/templates/comments/custom_comment_item.html',
    'lib/client/templates/comments/custom_comment_reply.html',

    'lib/client/templates/users/custom_user_info.html',
    'lib/client/templates/users/custom_user_posts.html',
    'lib/client/templates/users/custom_user_upvoted_posts.html',
    'lib/client/templates/users/custom_user_comments.html',
    'lib/client/templates/users/custom_user_profile_twitter.html',
    'lib/client/templates/users/custom_user_invites.html',
    'lib/client/templates/users/custom_user_account.html',

    'lib/client/templates/pages/custom_pages_menu.html',
    'lib/client/templates/pages/custom_page.html',
    'lib/client/templates/pages/custom_page_item.html',
    'lib/client/templates/pages/custom_pages.html',

    'lib/client/templates/settings/custom_settings.html',
    'lib/client/templates/settings/custom_post_edit.html',

    'lib/client/templates/custom_post_title.html',
    'lib/client/templates/custom_post_title.js',
    'lib/client/stylesheets/custom.scss',
    'lib/client/stylesheets/components/_nav.scss',
    'lib/client/stylesheets/components/_posts.scss',
    'lib/client/stylesheets/components/_users.scss',
    'lib/client/stylesheets/components/_admin.scss',
    'lib/client/stylesheets/components/_pages.scss',
    'lib/client/custom_templates.js'
  ], ['client']);

  // server

  api.addFiles([
    'lib/server/templates/custom_emailPostItem.handlebars'
  ], ['server']);

  // i18n languages (must come last)

  api.addFiles([
    'i18n/en.i18n.json'
  ], ['client', 'server']);

});
