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

const renderForm = (value, elements, error = '') => {
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

const renderViewedPosts = (set, elements) => {
  set.forEach((id) => {
    const post = elements.postBody(id);
    post.classList.remove('font-weight-bold');
    post.classList.add('font-weight-normal');
  });
};

const renderFeeds = (value, elements) => {
  elements.feedHeading.textContent = i18next.t('feedHeading');
  const feeds = value.map((channel) => {
    const li = document.createElement('li');
    const heading = document.createElement('h3');
    heading.innerText = channel.channelName;
    const description = document.createElement('p');
    description.innerText = channel.description;
    li.classList.add('list-group-item');
    li.prepend(heading, description);
    return li;
  });
  elements.ulFeeds.innerHTML = '';
  elements.ulFeeds.prepend(...feeds);
  elements.feed.append(elements.feedHeading, elements.ulFeeds);
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
  elements.postsHeading.textContent = i18next.t('postHeading');
  const list = posts.map(({
    title, link, postId,
  }) => {
    const className = state.ui.viewedPosts.has(postId) ? 'font-weight-normal' : 'font-weight-bold';
    const btn = `<button type='button' data-id='${postId}' data-toggle='modal' data-target='#modal' class='btn btn-primary btn-sm'>
     Preview 
     </button>`;
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
    postBody.classList.add(className);
    postBody.innerText = `${title}`;
    li.innerHTML = btn;
    li.prepend(postBody);

    return li;
  });
  elements.ulPosts.innerHTML = '';
  elements.ulPosts.prepend(...list);
  elements.posts.append(elements.postsHeading, elements.ulPosts);
};

const render = (state, elements) => onChange(state, (path, value) => {
  switch (path) {
    case 'form.state':
      renderForm(value, elements, state.form.error);
      break;
    case 'data.feeds':
      renderFeeds(value, elements);
      break;
    case 'data.posts':
      renderPosts(value, state, elements);
      break;
    case 'modal.currentModal':
      renderModal(value, state, elements);
      break;
    case 'ui.viewedPosts':
      renderViewedPosts(value, elements);
      break;
    default:
      break;
  }
});

export default render;
