const BASE_URL = "http://localhost:3000/";
const LIST_SHOWS = BASE_URL + "listShows";
const GET_EPISODES = BASE_URL + "getEpisodes?shows=";
const ADD_SHOW = BASE_URL + "addShow?id=";
const REMOVE_SHOW = BASE_URL + "removeShow?id=";
const FIND_SHOWS = BASE_URL + "findShow?name=";

export const loadShows = (completedCallBack, errorCallBack) => {
  send(LIST_SHOWS, completedCallBack, errorCallBack);
};

export const addShow = (show, completedCallBack, errorCallBack) => {
  send(ADD_SHOW + show.id + "&name=" + show.name, completedCallBack, errorCallBack);
};

export const removeShow = (id, completedCallBack, errorCallBack) => {
  send(REMOVE_SHOW + id, completedCallBack, errorCallBack);
};

export const loadEpisodes = (shows, completedCallBack, errorCallBack) => {
  send(GET_EPISODES + JSON.stringify(shows), completedCallBack, errorCallBack);
};

export const findShows = (searchTerm, completedCallBack, errorCallBack) => {
  send(FIND_SHOWS + searchTerm, completedCallBack, errorCallBack);
};

const send = (url, completedCallBack, errorCallBack) => {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (typeof data == "undefined") data = [];
      completedCallBack(data);
    })
    .catch(e => {
      console.log("Error response from server: " + e);
      errorCallBack(e);
    });
};
