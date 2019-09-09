import { log } from "./Logger";

const BASE_URL = "http://localhost:3000/";
const SHOWS = BASE_URL + "shows";
const EPISODES = BASE_URL + "episodes?shows=";
const ADD_SHOW = BASE_URL + "addShow?showId=";
const REMOVE_SHOW = BASE_URL + "removeShow?showId=";
const FIND_SHOWS = BASE_URL + "findShow?showName=";
const BANNER = BASE_URL + "banner?showId=";

export const shows = (completedCallBack, errorCallBack) => {
  send(SHOWS, completedCallBack, errorCallBack);
};

export const addShow = (show, completedCallBack, errorCallBack) => {
  send(
    ADD_SHOW + show.id + "&showName=" + show.name,
    completedCallBack,
    errorCallBack
  );
};

export const removeShow = (showId, completedCallBack, errorCallBack) => {
  send(REMOVE_SHOW + showId, completedCallBack, errorCallBack);
};

export const episodes = (shows, completedCallBack, errorCallBack) => {
  send(EPISODES + JSON.stringify(shows), completedCallBack, errorCallBack);
};

export const findShows = (searchTerm, completedCallBack, errorCallBack) => {
  send(FIND_SHOWS + searchTerm, completedCallBack, errorCallBack);
};

export const banner = showId => {
  return new Promise((resolve, reject) => {
    fetch(BANNER + showId)
    .then(res => res.blob())
    .then(data => {
        resolve(URL.createObjectURL(data));
      })
      .catch(e => {
        log(
          "Error response from server when fetching banner (" +
            BANNER +
            showId +
            "): " +
            e
        );
        console.log(e);
        reject(e);
      });
  });
};

const send = (url, completedCallBack, errorCallBack) => {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (typeof data == "undefined") data = [];
      completedCallBack(data);
    })
    .catch(e => {
      log("Error response from server (" + url + ") " + e);
      errorCallBack(e);
    });
};
