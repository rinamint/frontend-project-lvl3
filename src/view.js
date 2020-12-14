/* eslint-disable no-param-reassign */
import onChange from 'on-change';
import _ from 'lodash';
import i18next from 'i18next';

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

const renderForm = (value, error = '', elements) => {
  switch (value) {
    case 'proccessed':
      elements.button.removeAttribute('disabled');
      elements.input.removeAttribute('disabled');
      buildText('form.success', 'text-success');
      elements.form.reset();
      break;
    case 'failed':
      renderErrors(error, elements.input);
      elements.button.removeAttribute('disabled');
      elements.input.removeAttribute('disabled');
      break;
    default:
      elements.button.setAttribute('disabled', '');
      elements.input.setAttribute('disabled', '');
  }
};

const feedHeading = document.createElement('h2');
const postsHeading = document.createElement('h2');

const renderFeeds = (value, elements) => {
  feedHeading.innerText = i18next.t('feedHeading');
  const feeds = value.map((channel) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.innerHTML = `<h3>${channel.channelName}</h3><p>${channel.description}</p>`;
    return li;
  });
  elements.ulFeeds.innerHTML = '';
  elements.ulFeeds.prepend(...feeds);
  elements.feed.append(feedHeading);
  elements.feed.append(elements.ulFeeds);
};

const createBtn = (id) => {
  const btn = `<button type='button' data-id=${id} data-toggle='modal' data-target='#modal' class='btn btn-primary btn-sm'> Preview </button>`;
  return btn;
};

const renderBtn = (li, state) => {
  const modal = document.querySelector('#modal');
  const full = modal.querySelector('.full-article');
  const title = modal.querySelector('.modal-title');
  const body = modal.querySelector('.modal-body');
  const postBody = li.querySelector('a');
  const link = postBody.getAttribute('href');
  const elementId = postBody.getAttribute('data-id');
  const postTitle = postBody.textContent;
  const description = state.ui.modal.descriptions[elementId];
  postBody.classList.remove('font-weight-bold');
  postBody.classList.add('font-weight-normal');
  state.ui.modal.viewedPosts.add(elementId);
  full.setAttribute('href', `${link}`);
  title.innerHTML = postTitle;
  body.innerHTML = description;
};
const renderPressedLink = (link, state) => {
  link.classList.remove('font-weight-bold');
  link.classList.add('font-weight-normal');
  const url = link.getAttribute('href');
  state.ui.links.pressedLinks.add(url);
};

const renderPosts = (value, state, elements) => {
  postsHeading.innerText = i18next.t('postHeading');
  const list = value.map(({
    title, link, description, postId,
  }) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.classList.add('d-flex');
    li.classList.add('justify-content-between');
    li.classList.add('align-items-start');
    const postBody = document.createElement('a');
    postBody.setAttribute('href', `${link}`);
    postBody.setAttribute('rel', 'noopener noreferrer');
    postBody.setAttribute('data-id', `${postId}`);
    postBody.setAttribute('target', '_blank');
    postBody.innerText = `${title}`;
    const modalStyle = state.ui.modal.viewedPosts.has(postId) ? 'font-weight-normal' : 'font-weight-bold';
    const linkStyle = state.ui.links.pressedLinks.has(link) ? 'font-weight-normal' : 'font-weight-bold';
    const commonStyle = modalStyle === linkStyle ? 'font-weight-bold' : 'font-weight-normal';

    postBody.classList.add(commonStyle);
    state.ui.modal.descriptions[`${postId}`] = description;
    const btn = createBtn(postId);
    li.innerHTML = btn;
    li.prepend(postBody);
    return li;
  });
  elements.ulPosts.innerHTML = '';
  elements.ulPosts.prepend(...list);
  elements.posts.append(postsHeading);
  elements.posts.append(elements.ulPosts);
};

const render = (state, elements) => onChange(state, (path, value) => {
  if (path === 'form.state') {
    renderForm(value, state.form.error, elements);
  }
  if (path === 'data.feeds') {
    renderFeeds(value, elements);
  }
  if (path === 'data.posts') {
    renderPosts(value, state, elements);
  }
  if (path === 'form.error') {
    renderErrors(value, elements.input);
  }
  if (path === 'ui.modal.current') {
    renderBtn(value, state);
  }
  if (path === 'ui.links.current') {
    renderPressedLink(value, state);
  }
});

export default render;
