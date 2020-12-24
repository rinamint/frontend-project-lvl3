/* eslint-disable no-param-reassign */
import onChange from 'on-change';
import i18next from 'i18next';

const renderFeedback = (key, className, elements) => {
  const { feedback } = elements;
  const text = i18next.t(key);
  feedback.innerText = text;
  feedback.classList.remove('text-success');
  feedback.classList.add(className);
};

const renderForm = (value, error = '', elements) => {
  switch (value) {
    case 'proccessed':
      elements.button.removeAttribute('disabled');
      elements.input.removeAttribute('disabled');
      renderFeedback('form.success', 'text-success', elements);
      elements.form.reset();
      break;
    case 'failed':
      renderFeedback(`form.error.${error}`, 'invalid-feedback', elements);
      elements.input.classList.add('is-invalid');
      elements.button.removeAttribute('disabled');
      elements.input.removeAttribute('disabled');
      break;
    case 'processing':
      elements.input.classList.remove('is-invalid');
      elements.feedback.classList.remove('invalid-feedback');
      elements.feedback.innerHTML = '';
      elements.button.setAttribute('disabled', '');
      elements.input.setAttribute('disabled', '');
      break;
    default:
      elements.button.removeAttribute('disabled');
      elements.input.removeAttribute('disabled');
  }
};

const renderViewedPosts = (id) => {
  const postBody = document.querySelector(`a[data-id="${id}"]`);
  postBody.classList.remove('font-weight-bold');
  postBody.classList.add('font-weight-normal');
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

const renderModal = (id, state, elements) => {
  const full = elements.modal.querySelector('.full-article');
  const title = elements.modal.querySelector('.modal-title');
  const body = elements.modal.querySelector('.modal-body');
  const { posts } = state.data;
  const currentPost = posts.find((post) => post.postId === id);
  full.setAttribute('href', currentPost.link);
  title.innerText = currentPost.title;
  body.innerText = currentPost.description;
};

const renderPosts = (posts, state, elements) => {
  postsHeading.innerText = i18next.t('postHeading');
  const list = posts.map(({
    title, link, postId,
  }) => {
    const className = state.ui.viewed.viewedPosts.has(postId) ? 'font-weight-normal' : 'font-weight-bold';
    const btn = `<button type='button' data-id='${postId}' data-toggle='modal' data-target='#modal' class='btn btn-primary btn-sm'>
     Preview 
     </button>`;
    const li = `<li class="list-group-item d-flex justify-content-between align-items-start">
    <a href='${link}' rel="noopener noreferrer" data-id='${postId}' target="_blank" class='${className}'> 
    ${title}
    </a>
    ${btn}
    </li>`;
    return li;
  });
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
  if (path === 'modal.currentModal') {
    renderModal(value, state, elements);
  }
  if (path === 'ui.currentPost') {
    renderViewedPosts(value);
  }
});

export default render;
