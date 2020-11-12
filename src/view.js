/* eslint-disable no-param-reassign */
import onChange from 'on-change';
import _ from 'lodash';
import i18next from 'i18next';

const input = document.querySelector('#add');
const button = document.querySelector('.btn-primary');

const removeClasses = (element, feedback, value, feedbackValue) => {
  element.classList.remove(value);
  if (feedback !== null) {
    feedback.classList.remove(feedbackValue);
    feedback.innerHTML = '';
  }
};

const buildText = (key, attribute) => {
  const text = i18next.t(`${key}`);
  const div = document.querySelector('.feedback');
  div.innerHTML = '';
  div.classList.remove('text-success');
  div.classList.add(attribute);
  div.innerHTML = text;
};

const renderErrors = (error, element) => {
  const invalidFeedback = document.querySelector('.invalid-feedback');
  if (_.isEqual(error, [])) {
    removeClasses(input, invalidFeedback, 'is-invalid', 'invalid-feedback');
    return;
  }
  removeClasses(element, invalidFeedback, 'is-invalid', 'invalid-feedback');
  switch (error) {
    case 'feed':
      buildText('form.error.feed', 'invalid-feedback');
      break;
    case 'url':
      buildText('form.error.url', 'invalid-feedback');
      break;
    case 'network':
      buildText('form.error.network', 'invalid-feedback');
      break;
    default:
      buildText('form.error.unknown', 'invalid-feedback');
  }
  element.classList.add('is-invalid');
};

const feed = document.querySelector('.feeds');
const feedHeading = document.createElement('h2');
const postsHeading = document.createElement('h2');
feedHeading.innerHTML = 'FEEDS';
postsHeading.innerHTML = 'POSTS';
const posts = document.querySelector('.posts');
const ulFeeds = document.querySelector('.feed-list');
const ulPosts = document.querySelector('.post-list');

export const formWatcher = (state) => onChange(state, (path, value) => {
  if (path === 'form.state') {
    if (value === 'proccesing') {
      button.setAttribute('disabled', '');
    }
    if (value === 'proccessed') {
      button.removeAttribute('disabled');
      buildText('form.success', 'text-success');
    }
    if (value === 'failed') {
      button.removeAttribute('disabled');
    }
  }
  if (path === 'error') {
    renderErrors(value, input);
  }
});

const watchedState = (state) => onChange(state, (path, value) => {
  if (path === 'feeds.listOfFeeds') {
    const lastAdded = state.feeds.listOfFeeds.flatMap(({ channelId, channelName }) => {
      if (channelId > state.feeds.activeId) {
        return channelName.split('<!');
      }
      return [];
    });
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.innerHTML = lastAdded.join('');
    ulFeeds.prepend(li);
    feed.append(feedHeading);
    feed.append(ulFeeds);
  }
  if (path === 'posts') {
    const listOfPosts = value.flat().flatMap(({ postId, title, link }) => {
      if (Number(postId) > Number(state.feeds.activeId)) {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.innerHTML = `<a href="${link}">${title}</a></li>`;
        return li;
      }
      return [];
    });
    ulPosts.prepend(...listOfPosts);
    posts.append(postsHeading);
    posts.append(ulPosts);
  }
});
export default watchedState;
