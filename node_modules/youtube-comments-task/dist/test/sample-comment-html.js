'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var COMMENT_ID = 'z12vvvxaryjywra0h234jdcg5p24zbvol04';
var COMMENT_AUTHOR = 'the_comment_username';
var COMMENT_AUTHOR_LINK = '/user/nickname';
var COMMENT_AUTHOR_THUMB = 'https://yt3.ggpht.com/-05yJ3zLwwv0/AAAAAAAAAAI/AAAAAAAAAAA/o-ubSLg7wjM/s32-c-k-no-mo-rj-c0xffffff/photo.jpg';
var COMMENT_TEXT = 'This is the actual comment text.';
var COMMENT_LIKES = 3;
var COMMENT_TIME = '1 month ago';
var COMMENT_EDITED = false;
var REPLIES_TOKEN = 'EhYSC2NCVWVpcFhGaXNRwAEAyAEA4AEBGAYyWRpXEiN6MTN3dnZtcG14MmFpeGp2cDIyNWV4aDVqbG4yem5nNGQwNCICCAAqGFVDM1hUelZ6YUhRRWQzMHJRYnV2Q3RUUTILY0JVZWlwWEZpc1E4AEABSP==';

module.exports = {
  sampleComment: sampleComment,
  sampleReplies: sampleReplies,
  COMMENT_ID: COMMENT_ID,
  COMMENT_AUTHOR: COMMENT_AUTHOR,
  COMMENT_AUTHOR_LINK: COMMENT_AUTHOR_LINK,
  COMMENT_AUTHOR_THUMB: COMMENT_AUTHOR_THUMB,
  COMMENT_TIME: COMMENT_TIME,
  COMMENT_TEXT: COMMENT_TEXT,
  COMMENT_LIKES: COMMENT_LIKES,
  COMMENT_EDITED: COMMENT_EDITED,
  REPLIES_TOKEN: REPLIES_TOKEN

  // comment = {
  //   id: '1l2k3j12lkjjlaksdjkl',
  //   author: 'Person Name',
  //   authorLink: '/user/nickname',
  //   authorThumb: 'https://yt3.ggpht.com/-05yJ3zLwwv0/AAAAAAAAAAI/AAAAAAAAAAA/o-ubSLg7wjM/s32-c-k-no-mo-rj-c0xffffff/photo.jpg',
  //   text: 'The comment text',
  //   likes: 3,
  //   time: '13 Minutes ago'
  // }

};function sampleReplies(replies) {
  return (replies || []).map(renderComment).join('\n');
}

function sampleComment(comment, replies, repliesToken) {
  comment = _extends({
    id: COMMENT_ID,
    author: COMMENT_AUTHOR,
    authorLink: COMMENT_AUTHOR_LINK,
    authorThumb: COMMENT_AUTHOR_THUMB,
    text: COMMENT_TEXT,
    likes: COMMENT_LIKES,
    time: COMMENT_TIME,
    edited: COMMENT_EDITED
  }, comment || {});

  replies = replies || [];
  repliesToken = repliesToken || REPLIES_TOKEN;

  return '\n    <section class="comment-thread-renderer" data-visibility-tracking="CKQBEMJ1IhMIivG8hf2M0AIVB3hOCh3PWgpF" data-priority="0">\n      ' + renderComment(comment) + '\n      <div class="comment-replies-renderer" data-visibility-tracking="CKUBEL51IhMIivG8hf2M0AIVB3hOCh3PWgpF">\n        ' + (replies.length < 3 ? renderReplies(replies) : renderCollapsedReplies(replies, repliesToken)) + '\n      </div>\n    </section>';
}

function renderReplies(replies) {
  return replies.map(renderComment);
}

function renderCollapsedReplies(replies, repliesToken) {
  return '\n    <div class="yt-uix-expander yt-uix-expander-collapsed comment-replies-renderer-header" tabindex="0">\n      <div class="yt-uix-expander-collapsed-body">\n      <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default load-more-button yt-uix-load-more comment-replies-renderer-paginator comment-replies-renderer-expander-down yt-uix-button-link"\n            type="button" onclick=";return false;" aria-label="View all 20 replies" data-uix-load-more-target-id="comment-replies-renderer-z12ctj4q0ky4e3ad523whbdzhzuldbbdt"\n            data-uix-load-more-href="/comment_service_ajax?action_get_comment_replies=1" data-uix-load-more-post-body="page_token=' + encodeURIComponent(repliesToken) + '" data-uix-load-more-post="true">\n        <span class="yt-uix-button-content">\n          <span class="load-more-loading hid">\n            <span class="yt-spinner">\n              <span class="yt-spinner-img  yt-sprite" title="Loading icon"></span>\n                Loading...\n              </span>\n            </span>\n          <span class="load-more-text">\n            View all ' + replies.length + ' replies\n          </span>\n        </span>\n      </button>\n\n      <div class="yt-uix-expander-head comment-replies-renderer-expander-down comment-replies-renderer-view hid" tabindex="0">\n        View all ' + replies.length + ' replies\n      </div>\n\n      ' + replies.map(renderComment) + '\n\n      <div id="comment-replies-renderer-*commentid*" class="yt-uix-expander-body comment-replies-renderer-pages">\n        <div class="yt-uix-expander-head comment-replies-renderer-expander-up comment-replies-renderer-hide" tabindex="0">\n          Hide replies\n        </div>\n      </div>\n\n      </div>\n    </div>';
}

function renderComment(c) {
  return '\n  <div class="comment-renderer" data-visibility-tracking="CIsBELZ1GAEiEwje7rLas6zRAhWTK04KHevKBco" data-cid="' + c.id + '">\n    <a href="' + c.authorLink + '" class=" yt-uix-sessionlink g-hovercard spf-link " data-ytid="UCs1hv9ycENGYB52WsbgiscQ" data-sessionlink="itct=CIsBELZ1GAEiEwje7rLas6zRAhWTK04KHevKBco">\n      <span class="video-thumb comment-author-thumbnail yt-thumb yt-thumb-32">\n        <span class="yt-thumb-square">\n          <span class="yt-thumb-clip">\n            <img role="img" data-ytimg="1" src="' + c.authorThumb + '" width="32" alt="' + c.author + '" onload=";__ytRIL(this)" height="32" tabindex="0">\n            <span class="vertical-align"></span>\n          </span>\n        </span>\n      </span>\n    </a>\n    <div id="comment-renderer-edit-z13gvfiadmaqurm5b04ccnn54za4ex3x204.1480561616711242" class="comment-simplebox-edit" data-editable-content-text="" data-image-src="" data-video-id="">\n    </div>\n    <div class="comment-renderer-content">\n      <div class="comment-renderer-header">\n        <a href="' + c.authorLink + '" class="comment-author-text yt-uix-sessionlink g-hovercard spf-link " data-ytid="UCs1hv9ycENGYB52WsbgiscQ" data-sessionlink="itct=CIsBELZ1GAEiEwje7rLas6zRAhWTK04KHevKBco">\n          ' + c.author + '\n        </a>\n        <span class="comment-renderer-time" tabindex="0">\n          <a href="/watch?v=cBUeipXFisQ&amp;lc=z13gvfiadmaqurm5b04ccnn54za4ex3x204.1480561616711242" class=" yt-uix-sessionlink  spf-link " data-sessionlink="itct=CIsBELZ1GAEiEwje7rLas6zRAhWTK04KHevKBco">\n            ' + c.time + (c.edited ? ' (edited)' : '') + '\n          </a>\n        </span>\n      </div>\n      <div class="comment-renderer-text" tabindex="0" role="article">\n        <div class="comment-renderer-text-content">\n          ' + c.text + '\n        </div>\n        <div class="comment-text-toggle hid">\n          <div class="comment-text-toggle-link read-more">\n            <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-link" type="button" onclick="return false;">\n              <span class="yt-uix-button-content">Read more</span>\n            </button>\n          </div>\n          <div class="comment-text-toggle-link show-less hid">\n            <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-link" type="button" onclick="return false;">\n              <span class="yt-uix-button-content">Show less</span>\n            </button>\n          </div>\n        </div>\n      </div>\n      <div class="comment-renderer-footer" data-vote-status="INDIFFERENT">\n        <div class="comment-action-buttons-toolbar">\n          <button class="yt-uix-button yt-uix-button-size-small yt-uix-button-link comment-renderer-reply comment-simplebox-trigger" type="button" onclick=";return false;" data-simplebox-label="Reply" data-simplebox-params="EgtjQlVlaXBYRmlzUSIjejEzZ3ZmaWFkbWFxdXJtNWIwNGNjbm41NHphNGV4M3gyMDQqAggAMAA%3D" data-placeholder="Add a public reply..." data-simplebox-id="comment-simplebox-reply-z13gvfiadmaqurm5b04ccnn54za4ex3x204.1480561616711242" data-attachment-editor-trigger="image" data-simplebox-target="/comment_service_ajax?action_create_comment_reply=1" data-simplebox-event="replycreated" data-simplebox-sessionlink="itct=CJABEPBbIhMI3u6y2rOs0QIVkytOCh3rygXK">\n            <span class="yt-uix-button-content">Reply</span>\n          </button>\n          <span class="comment-renderer-like-count off">' + c.likes + '</span>\n          <span class="comment-renderer-like-count on">' + (c.likes + 1) + '</span>\n          <span role="radiogroup">\n            <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-button-empty yt-uix-button-has-icon no-icon-markup comment-action-buttons-renderer-thumb yt-uix-sessionlink sprite-comment-actions sprite-like i-a-v-sprite-like" type="button" onclick=";return false;" role="radio" aria-label="Like" aria-checked="false" data-sessionlink-target="/comment_service_ajax?action_perform_comment_action=1" data-action="CAUQAho0ejEzZ3ZmaWFkbWFxdXJtNWIwNGNjbm41NHphNGV4M3gyMDQuMTQ4MDU2MTYxNjcxMTI0MioLY0JVZWlwWEZpc1EwATgAShUxMDA1ODIxNDQyMjQ4MzU5Nzk5MThQAA%3D%3D" data-url="/comment_service_ajax?action_perform_comment_action=1" data-action-type="like" data-sessionlink="itct=CJEBEPBbIhMI3u6y2rOs0QIVkytOCh3rygXK"></button>\n            <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-button-empty yt-uix-button-has-icon no-icon-markup comment-action-buttons-renderer-thumb yt-uix-sessionlink sprite-comment-actions sprite-dislike i-a-v-sprite-dislike" type="button" onclick=";return false;" role="radio" aria-label="Dislike" aria-checked="false" data-sessionlink-target="/comment_service_ajax?action_perform_comment_action=1" data-action="CAQQAho0ejEzZ3ZmaWFkbWFxdXJtNWIwNGNjbm41NHphNGV4M3gyMDQuMTQ4MDU2MTYxNjcxMTI0MioLY0JVZWlwWEZpc1EwATgAShUxMDA1ODIxNDQyMjQ4MzU5Nzk5MThQAA%3D%3D" data-url="/comment_service_ajax?action_perform_comment_action=1" data-action-type="dislike" data-sessionlink="itct=CI8BEPBbIhMI3u6y2rOs0QIVkytOCh3rygXK"></button>\n          </span>\n          <div class="yt-uix-menu-container comment-renderer-action-menu yt-section-hover-container">\n            <div class="yt-uix-menu yt-uix-menu-flipped hide-until-delayloaded">\n              <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-action-menu yt-uix-button-empty yt-uix-button-has-icon no-icon-markup  yt-uix-menu-trigger" type="button" onclick=";return false;" role="button" aria-label="Action menu." aria-haspopup="true" aria-pressed="false">\n                <span class="yt-uix-button-arrow yt-sprite"></span>\n              </button>\n              <div class="yt-uix-menu-content yt-ui-menu-content yt-uix-menu-content-hidden" role="menu">\n                <ul>\n                  <li role="menuitem">\n                    <div class="service-endpoint-action-container hid">\n                    </div>\n\n                    <button type="button" class="yt-ui-menu-item yt-uix-menu-close-on-select  report-form-modal-renderer" data-params="GjR6MTNndmZpYWRtYXF1cm01YjA0Y2NubjU0emE0ZXgzeDIwNC4xNDgwNTYxNjE2NzExMjQyKAEyDExpY2hlIENocmlzdDpiCAEQAho0ejEzZ3ZmaWFkbWFxdXJtNWIwNGNjbm41NHphNGV4M3gyMDQuMTQ4MDU2MTYxNjcxMTI0MioLY0JVZWlwWEZpc1EwAUoVMTAwNTgyMTQ0MjI0ODM1OTc5OTE4UAA%3D" data-innertube-clicktracking="CIsBELZ1GAEiEwje7rLas6zRAhWTK04KHevKBco" data-url="/flag_service_ajax?action_get_report_form=1">\n                      <span class="yt-ui-menu-item-label">Report spam or abuse</span>\n                    </button>\n                  </li>\n                </ul>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>';
}