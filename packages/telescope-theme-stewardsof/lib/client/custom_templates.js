// Override "post_title" template
Template.custom_post_title.replaces("post_title");
Template.custom_header.replaces("header");
Template.custom_logo.replaces("logo");
Template.custom_search.replaces("search");
Template.custom_menuComponent.replaces("menuComponent");
Template.custom_menuItem.replaces("menuItem");
Template.custom_notifications_mark_as_read.replaces("notifications_mark_as_read");
Template.custom_notification_item.replaces("notification_item");
Template.custom_user_menu_label.replaces("user_menu_label");

Template.custom_layout.replaces("layout");
Template.custom_submit_button.replaces("submit_button");

Template.custom_post_item.replaces("post_item");
Template.custom_post_content.replaces("post_content");
Template.custom_post_vote.replaces("post_vote");
Template.custom_post_discuss.replaces("post_discuss");
Template.custom_post_avatars.replaces("post_avatars");
Template.custom_posts_daily.replaces("posts_daily");
Template.custom_post_body.replaces("post_body");
Template.custom_post_share.replaces("post_share");
Template.custom_post_submit.replaces("post_submit");
Template.custom_post_admin.replaces("post_admin");
Template.custom_post_info.replaces("post_info");

Template.custom_comment_submit.replaces("comment_submit");
Template.custom_comment_item.replaces("comment_item");
Template.custom_comment_reply.replaces("comment_reply");

Template.custom_user_info.replaces("user_info");
Template.custom_user_posts.replaces("user_posts");
Template.custom_user_upvoted_posts.replaces("user_upvoted_posts");
Template.custom_user_comments.replaces("user_comments");
Template.custom_user_profile_twitter.replaces("user_profile_twitter");
Template.custom_user_invites.replaces("user_invites");
Template.custom_user_account.replaces("user_account");


Template.custom_settings.replaces("settings");
Template.custom_post_edit.replaces("post_edit");

Template.custom_pages_menu.replaces("pages_menu");
Template.custom_page.replaces("page");
Template.custom_page_item.replaces("page_item");
Template.custom_pages.replaces("pages");

Telescope.modules.removeAll("mobileNav");
Telescope.modules.removeAll("footer");
Telescope.modules.remove("top","posts_views_nav");
Telescope.modules.remove("postComponents","post_rank");
Telescope.modules.remove("postComponents","post_actions");
Telescope.modules.remove("postComponents","post_share");
Telescope.modules.remove("postComponents","post_avatars");
Telescope.modules.remove("postHeading","post_domain");
Telescope.modules.remove("profileDisplay","user_downvoted_posts");
Telescope.modules.remove("commentThreadBottom","post_subscribe");
Telescope.modules.remove("postMeta", "post_info");
Telescope.modules.remove("postMeta", "post_comments_link");
Telescope.modules.remove("postMeta", "post_author");
Telescope.modules.remove("postMeta", "post_admin");
Telescope.modules.remove("profileEdit", "user_invites");
Telescope.modules.remove("profileEdit", "user_subscribed_posts");
Telescope.modules.remove("profileDisplay", "user_comments");

// Telescope.modules.removeAll("primaryNav");
Telescope.modules.remove("primaryNav", "search");
Telescope.modules.remove("primaryNav", "pages_menu");

Telescope.modules.remove("secondaryNav","submit_button");
Telescope.modules.remove("secondaryNav", "user_menu");

Telescope.modules.add("postComponents", {
  template: "post_avatars",
  order: 99
});

Telescope.modules.add("primaryNav", {
  template: 'posts_menu',
  order: 5
});


Telescope.modules.add("secondaryNav", {
  template: 'search',
  order: 0
});

Telescope.modules.add("secondaryNav", {
  template: "pages_menu",
  order: 0
});


Telescope.modules.add("secondaryNav", [
  {
    template: 'user_menu',
    order: 40
  }
]);

Telescope.menuItems.add("userMenu", [
  {
    route: 'posts_pending',
    label: 'pending',
    description: 'pending',
    adminOnly: true
  }
]);

