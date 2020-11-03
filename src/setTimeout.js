import axios from 'axios';
import parsing from './parsing.js';

const timer = window.setTimeout((url) => {
  axios.get(url)
 .then((response) => parsing(response))
 
}, 5000);

export default timer;


// если длина фидов не равна длине фидов предыдущих, то добавить последние добавленные 