import { log } from "./Logger";

const BASE_URL = "http://localhost:3000/"
const SHOWS_URL = BASE_URL + "shows?";
const EPISODES_URL = BASE_URL + "episodes?";
const ADD_SHOW_URL = BASE_URL + "addShow?";
const REMOVE_SHOW_URL = BASE_URL + "removeShow?";
const FIND_SHOWS_URL = BASE_URL + "findShow?";
const BANNER_URL = BASE_URL + "banner?";
const SHOW_ID = "showId";
const SHOW_NAME = "showName";
const SHOWS = "shows";
const USER_ID = "userId";

const SHOW_ID_QRY = showId => SHOW_ID + "=" + showId;
const SHOW_NAME_QRY = showName => SHOW_NAME + "=" + showName;
const SHOWS_QRY = shows => SHOWS + "=" + JSON.stringify(shows);
const USER_QRY = user => USER_ID + "=" + user.sub.split("|")[1];

export const shows = (user, completedCallBack, errorCallBack) => {
  send(SHOWS_URL + USER_QRY(user), completedCallBack, errorCallBack);
};

export const addShow = (user, show, completedCallBack, errorCallBack) => {
  send(
    ADD_SHOW_URL +
      USER_QRY(user) +
      "&" +
      SHOW_ID_QRY(show.id) +
      "&" +
      SHOW_NAME_QRY(show.name),
    completedCallBack,
    errorCallBack
  );
};

export const removeShow = (user, showId, completedCallBack, errorCallBack) => {
  send(
    REMOVE_SHOW_URL + USER_QRY(user) + "&" + SHOW_ID_QRY(showId),
    completedCallBack,
    errorCallBack
  );
};

export const episodes = (shows, completedCallBack, errorCallBack) => {
  send(EPISODES_URL + SHOWS_QRY(shows), completedCallBack, errorCallBack);
};

export const findShows = (searchTerm, completedCallBack, errorCallBack) => {
  send(
    FIND_SHOWS_URL + SHOW_NAME_QRY(searchTerm),
    completedCallBack,
    errorCallBack
  );
};

export const banner = showId => {
  return new Promise((resolve, reject) => {
    fetch(BANNER_URL + SHOW_ID_QRY(showId))
      .then(res => {
        if (res.status !== 200) {
          reject(new Error("No banner found"));
        }
        return res.blob();
      })
      .then(data => {
        resolve(URL.createObjectURL(data));
      })
      .catch(e => {
        log(
          "Error response from server when fetching banner (" +
            BANNER_URL +
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
