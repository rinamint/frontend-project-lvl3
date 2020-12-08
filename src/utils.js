/* eslint-disable no-param-reassign */

export const addProxy = (link) => {
  const corsApiHost = 'https://cors-anywhere.herokuapp.com/';
  return `${corsApiHost}${link}`;
};

export const addNumbers = (state, channel) => {
  const numberLine = state.feeds.numOfLastAdded + 1;
  const newChannel = { ...channel, channelNumber: numberLine };
  return newChannel;
};

export const updateDataState = (data, state, link) => {
  const [channel, posts] = data;
  const newChannel = addNumbers(state, channel);
  state.data.posts.unshift(...posts);
  state.data.feeds.push({ ...newChannel, url: link });
  state.feeds.numOfLastAdded = newChannel.channelNumber;
};

export const renderBtns = (id, postTitle, description, link, postBody, state) => {
  const modal = document.querySelector('#modal');
  const closeBtns = modal.querySelectorAll('[data-dismiss=modal]');
  const full = modal.querySelector('.full-article');
  const btn = document.createElement('button');
  const title = modal.querySelector('.modal-title');
  const body = modal.querySelector('.modal-body');
  btn.setAttribute('type', 'button');
  btn.setAttribute('data-id', `${id}`);
  btn.setAttribute('data-toggle', 'modal');
  btn.setAttribute('data-target', '#modal');
  btn.classList.add('btn');
  btn.classList.add('btn-primary');
  btn.classList.add('btn-sm');
  btn.innerText = 'Preview';
  btn.addEventListener('click', () => {
    postBody.classList.remove('font-weight-bold');
    postBody.classList.add('font-weight-normal');
    state.data.viewedPosts.push(id);
    modal.classList.add('show');
    modal.setAttribute('style', 'display: block');
    modal.setAttribute('aria-modal', 'true');
    full.setAttribute('href', `${link}`);
    title.innerHTML = postTitle;
    body.innerHTML = description;
  });
  closeBtns.forEach((closeBtn) => closeBtn.addEventListener('click', () => {
    modal.classList.remove('show');
    modal.setAttribute('style', 'display: none');
    modal.removeAttribute('aria-modal');
  }));
  return btn;
};
