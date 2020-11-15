/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import axios from 'axios';
import _ from 'lodash';
import i18next from 'i18next';
import { addProxy } from './utils';
import parse, { updateState } from './parsing';
import view from './view';
import resources from './locales';
import update from './setTimeout';

const schema = yup.object().shape({
  url: yup.string().required().url(),
});

const isDuplicate = (watcher, url) => _.includes(watcher.feeds.urls, url);
let isValid;
const updateValidationState = (watcher, link) => {
  try {
    schema.validateSync({ url: link }, { abortEarly: false });
    if (isDuplicate(watcher, link)) {
      isValid = false;
      watcher.error = 'feed';
    } else {
      isValid = true;
      watcher.error = [];
    }
  } catch (e) {
    watcher.error = 'url';
    isValid = false;
  }
};

export default () => {
  const state = {
    form: {
      state: 'filling',
    },
    error: [],
    feeds: {
      lastAdded: 0,
      listOfFeeds: [],
      urls: [],
    },
    posts: [],
  };

  i18next.init({
    lng: 'en',
    debug: true,
    resources,
  });
  const watchedState = view(state);
  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('#add'),
  };
  update(watchedState);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const link = formData.get('url');
    updateValidationState(watchedState, link);
    if (isValid) {
      watchedState.form.state = 'proccesing';
      axios.get(addProxy(link))
        .then((response) => {
          const data = parse(response.data);
          watchedState.feeds.urls.push(link);
          updateState(data, watchedState);
          watchedState.form.state = 'proccessed';
        })
        .catch(() => {
          watchedState.error = 'network';
          watchedState.form.state = 'failed';
        });
    }
  });
};
