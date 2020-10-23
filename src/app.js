/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import axios from 'axios';
import _ from 'lodash';
import parsing from './parsing.js';
import watchedState from './view.js';
import parseFeed from './formatter.js';

const schema = yup.object().shape({
  url: yup.string().url(),
});

const isDuplicate = (watchedState, url) => _.includes(watchedState.feeds.urls, url);

const updateValidationState = (watchedState) => {
  try {
    schema.validateSync(watchedState.form.inputValue, { abortEarly: false });
    if (isDuplicate(watchedState, watchedState.form.inputValue.url)) {
      watchedState.form.isValid = false;
      watchedState.error = 'was before';
    }
    watchedState.form.isValid = true;
    watchedState.error = [];
  } catch (e) {
    watchedState.error = e.errors;
    watchedState.form.isValid = false;
  }
};

export default () => {
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
      // const corsApiHost = 'https://cors-anywhere.herokuapp.com/';
      axios.get(url)
        .then((response) => parsing(response.data))
        .then((data) => parseFeed(data, watchedState))
        .catch((err) => console.log(err));
    }
  });
};
