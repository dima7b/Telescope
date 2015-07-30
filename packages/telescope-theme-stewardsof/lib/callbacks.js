function alertThanks (post) {
  $('#post-thanks').addClass('shown');
  return post;
}
Telescope.callbacks.add("postSubmitClient", alertThanks);

function inviteThanks (invited) {
  $('#invite-thanks').addClass('shown');
  return invited;
}

Telescope.callbacks.add("inviteSubmitClient", inviteThanks);