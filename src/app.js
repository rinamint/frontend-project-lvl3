/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import axios from 'axios';
import _ from 'lodash';
import i18next from 'i18next';
import parsing from './parsing';
import view, { formWatcher } from './view';
import { parseRss, parseFeed } from './formatter';
import resources from './locales';
import timer from './setTimeout';

const schema = yup.object().shape({
  url: yup.string().url(),
});

const isDuplicate = (watcher, url) => _.includes(watcher.feeds.urls, url);

const updateValidationState = (watcher) => {
  try {
    schema.validateSync(watcher.form.inputValue, { abortEarly: false });
    if (isDuplicate(watcher, watcher.form.inputValue.url)) {
      watcher.form.isValid = false;
      watcher.error = 'feed';
    } else {
      watcher.form.isValid = true;
      watcher.error = [];
    }
  } catch (e) {
    watcher.error = 'url';
    watcher.form.isValid = false;
  }
};

export default () => {
  const state = {
    form: {
      state: 'filling',
      isValid: true,
      inputValue: {
        url: '',
      },
    },
    error: [],
    feeds: {
      activeId: null,
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
  const formState = formWatcher(state);
  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('#add'),
  };
  timer(watchedState);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const link = formData.get('url');
    watchedState.form.inputValue.url = link;
    updateValidationState(formState, schema, elements);
    if (watchedState.form.isValid) {
      formState.form.state = 'proccesing';
      e.target.reset();
      const { url } = watchedState.form.inputValue;
      const corsApiHost = 'https://cors-anywhere.herokuapp.com/';
      axios.get(`${corsApiHost}${url}`)
        .then((response) => parsing(response.data))
        .then((doc) => parseRss(doc))
        .then((data) => {
          watchedState.feeds.urls.push(url);
          parseFeed(data, watchedState);
          formState.form.state = 'proccessed';
        })
        .catch(() => {
          formState.error = 'network';
          formState.form.state = 'failed';
        });
    }
  });
};
