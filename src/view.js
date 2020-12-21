/* eslint-disable no-param-reassign */
import onChange from 'on-change';
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

const renderForm = (value, error = '', elements) => {
  const invalidFeedback = document.querySelector('.invalid-feedback');
  switch (value) {
    case 'proccessed':
      elements.button.removeAttribute('disabled');
      elements.input.removeAttribute('disabled');
      buildText('form.success', 'text-success');
      elements.form.reset();
      break;
    case 'failed':
      buildText(error, 'invalid-feedback');
      elements.input.classList.add('is-invalid');
      elements.button.removeAttribute('disabled');
      elements.input.removeAttribute('disabled');
      break;
    default:
      removeClasses(elements.input, invalidFeedback, 'is-invalid', 'invalid-feedback');
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

const renderModal = (id, state) => {
  const modal = document.querySelector('#modal');
  const full = modal.querySelector('.full-article');
  const title = modal.querySelector('.modal-title');
  const body = modal.querySelector('.modal-body');
  const postBody = document.querySelector(`a[data-id="${id}"]`);
  const element = state.data.posts.find((post) => post.postId === id);
  postBody.classList.remove('font-weight-bold');
  postBody.classList.add('font-weight-normal');
  full.setAttribute('href', element.link);
  title.innerHTML = element.title;
  body.innerHTML = element.description;
};
const renderPressedLink = (id) => {
  const link = document.querySelector(`a[data-id="${id}"]`);
  link.classList.remove('font-weight-bold');
  link.classList.add('font-weight-normal');
};

const renderPosts = (value, state, elements) => {
  postsHeading.innerText = i18next.t('postHeading');
  const list = value.map(({
    title, link, postId,
  }) => {
    const style = state.ui.viewed.viewedPosts.has(postId) ? 'font-weight-normal' : 'font-weight-bold';
    const btn = `<button type='button' data-id='${postId}' data-toggle='modal' data-target='#modal' class='btn btn-primary btn-sm'>
     Preview 
     </button>`;
    const li = `<li class="list-group-item d-flex justify-content-between align-items-start">
    <a href='${link}' rel="noopener noreferrer" data-id='${postId}' target="_blank" class='${style}'> 
    ${title}
    </a>
    ${btn}
    </li>`;
    return li;
  });
  elements.ulPosts.innerHTML = '';
  elements.ulPosts.innerHTML = list.join('');
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
  if (path === 'ui.viewed.currentModal') {
    renderModal(value, state);
  }
  if (path === 'ui.viewed.currentLink') {
    renderPressedLink(value, state);
  }
});

export default render;
