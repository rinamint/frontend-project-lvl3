/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import axios from 'axios';
import _ from 'lodash';
import i18next from 'i18next';
import parsing from './parsing.js';
import watchedState from './view.js';
import parseFeed from './formatter.js';
import resources from './locales.js';
//import timer from './setTimeout.js';

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
    }
    else { watcher.form.isValid = true;
      watcher.error = [];}
  } catch (e) {
    watcher.error = 'url';
    watcher.form.isValid = false;
  }
};

export default async () => {
  await i18next.init({
    lng: 'en',
    debug: true,
    resources,
  });
  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('#add'),
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const feed = formData.get('url');
    watchedState.form.inputValue.url = feed;
    updateValidationState(watchedState, schema, elements);

    if (watchedState.form.isValid) {
      watchedState.feeds.urls.push(feed);
      const { url } = watchedState.form.inputValue;
      const corsApiHost = 'https://cors-anywhere.herokuapp.com/';
      axios.get(url)
        .then((response) => parsing(response.data))
        .then((data) => parseFeed(data, watchedState))
        .catch((err) => console.log(err));
    }
  });
};
