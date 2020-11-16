/* eslint-disable no-param-reassign */
import onChange from 'on-change';
import _ from 'lodash';
import i18next from 'i18next';

const input = document.querySelector('#add');
const button = document.querySelector('.btn-primary');
const form = document.querySelector('form');

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
  if (_.isEqual(error, '')) {
    removeClasses(input, invalidFeedback, 'is-invalid', 'invalid-feedback');
    return;
  }
  removeClasses(element, invalidFeedback, 'is-invalid', 'invalid-feedback');
  switch (error) {
    case 'feed':
      buildText('form.error.feed', 'invalid-feedback');
      break;
    case 'url must be a valid URL':
      buildText('form.error.url', 'invalid-feedback');
      break;
    case 'Network Error':
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

const workWithForm = (value) => {
  switch (value) {
    case 'proccessed':
      button.removeAttribute('disabled');
      buildText('form.success', 'text-success');
      break;
    case 'failed':
      button.removeAttribute('disabled');
      break;
    default:
      button.setAttribute('disabled', '');
      form.reset();
  }
};
const renderFeeds = (value, state) => {
  const lastAdded = value.flatMap(({ channelNumber, channelName }) => {
    if (channelNumber > state.feeds.NumOfLastAdded) {
      return channelName;
    }
    return [];
  });
  const li = document.createElement('li');
  li.classList.add('list-group-item');
  li.innerHTML = lastAdded.join('');
  ulFeeds.prepend(li);
  feed.append(feedHeading);
  feed.append(ulFeeds);
};

const renderPosts = (value, state) => {
  const listOfPosts = value.flat().flatMap(({ postNumber, title, link }) => {
    if (Number(postNumber) > Number(state.feeds.NumOfLastAdded)) {
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
};

const watchedState = (state) => onChange(state, (path, value) => {
  // eslint-disable-next-line default-case
  switch (path) {
    case 'form.state':
      workWithForm(value);
      break;
    case 'feeds.listOfFeeds':
      renderFeeds(value, state);
      break;
    case 'posts':
      renderPosts(value, state);
      break;
    case 'error':
      renderErrors(value, input);
      break;
  }
});
export default watchedState;
