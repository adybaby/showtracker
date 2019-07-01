const SERVER_URL = "http://localhost:3000";

// MONGO routes
// const ADD_SHOW = SERVER_URL + "/addShow";
// const REMOVE_SHOW = SERVER_URL + "/removeshow";
const LIST_SHOWS = SERVER_URL + "/listShows";

// TVDB routes
// const FIND_SHOW = SERVER_URL + "/findshow";
// const SHOW_INFO = SERVER_URL + "/showinfo";
// const EPISODE_INFO = SERVER_URL + "/episodeInfo";
// const GET_SHOW_CALENDAR = SERVER_URL + "/getShowCalendar";

export async function addShow() {}

export async function removeShow() {}

export async function listShows() {
  return new Promise((resolve, reject) => {
    const options = {
      method: "POST",
      headers: 'Content-Type":"application/json'
    };

    fetch(LIST_SHOWS, options).then(
      function(response) {
        resolve(response);
      },
      function(error) {
        reject(error.message);
      }
    );
  });
}

export async function findShow() {}

export async function showInfo() {}

export async function episodeInfo() {}

export async function getShowCalendar() {}
