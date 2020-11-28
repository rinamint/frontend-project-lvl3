/* eslint-disable no-param-reassign */
import onChange from 'on-change';
import _ from 'lodash';
import i18next from 'i18next';

const elements = {
  input: document.querySelector('#add'),
  button: document.querySelector('.btn-primary'),
  form: document.querySelector('form'),
  feed: document.querySelector('.feeds'),
  posts: document.querySelector('.posts'),
  ulFeeds: document.querySelector('.feed-list'),
  ulPosts: document.querySelector('.post-list'),
};

const removeClasses = (element, feedback, value, feedbackValue) => {
  element.classList.remove(value);
  if (feedback !== null) {
    feedback.classList.remove(feedbackValue);
    feedback.innerHTML = '';
  }
};

const buildText = (key, attribute) => {
  const text = i18next.t(key);
  const div = document.querySelector('.feedback');
  div.innerHTML = '';
  div.classList.remove('text-success');
  div.classList.add(attribute);
  div.innerHTML = text;
};

const renderErrors = (error, element) => {
  const invalidFeedback = document.querySelector('.invalid-feedback');
  if (_.isEqual(error, '')) {
    removeClasses(element, invalidFeedback, 'is-invalid', 'invalid-feedback');
    return;
  }
  removeClasses(element, invalidFeedback, 'is-invalid', 'invalid-feedback');
  buildText(error, 'invalid-feedback');
  element.classList.add('is-invalid');
};

const renderForm = (value, error = '') => {
  switch (value) {
    case 'proccessed':
      elements.button.removeAttribute('disabled');
      buildText('form.success', 'text-success');
      elements.form.reset();
      break;
    case 'failed':
      renderErrors(error, elements.input);
      elements.button.removeAttribute('disabled');
      break;
    default:
      elements.button.setAttribute('disabled', '');
  }
};

const feedHeading = document.createElement('h2');
const postsHeading = document.createElement('h2');

const renderFeeds = (value, state) => {
  feedHeading.innerText = i18next.t('feedHeading');
  const li = document.createElement('li');
  const lastAdded = value.filter((channel) => channel.channelNumber > state.feeds.numOfLastAdded);
  lastAdded.forEach((channel) => {
    li.classList.add('list-group-item');
    li.innerHTML = `<h3>${channel.channelName}</h3><p>${channel.description}</p>`;
  });
  elements.ulFeeds.prepend(li);
  elements.feed.append(feedHeading);
  elements.feed.append(elements.ulFeeds);
};
const renderPosts = (value, state) => {
  postsHeading.innerText = i18next.t('postHeading');
  const list = value.flatMap(({ postNumber, title, link }) => {
    if (Number(postNumber) > Number(state.feeds.numOfLastAdded)) {
      const li = document.createElement('li');
      li.classList.add('list-group-item');
      li.innerHTML = `<a href="${link}">${title}</a></li>`;
      return li;
    }
    return [];
  });
  elements.ulPosts.prepend(...list);
  elements.posts.append(postsHeading);
  elements.posts.append(elements.ulPosts);
};

const render = (state) => onChange(state, (path, value) => {
  if (path === 'form.state') {
    renderForm(value, state.form.error);
  }
  if (path === 'data.feeds') {
    renderFeeds(value, state);
  }
  if (path === 'data.posts') {
    renderPosts(value, state);
  }
  if (path === 'form.error') {
    renderErrors(value, elements.input);
  }
});

export default render;
