import Show from './Show';
import BannerUrl from './BannerUrl';

// SHOWS

const dbId = (userId, showId) => `${userId}_${showId}`;

export const addShow = (showId, showName, userId) => new Promise((resolve, reject) => {
  new Show({
    dbId: dbId(userId, showId),
    userId,
    id: showId,
    name: showName,
  }).save((err, show) => {
    if (err) {
      reject(err);
    } else {
      resolve(show);
    }
  });
});

export const removeShow = (showId, userId) => new Promise((resolve, reject) => {
  Show.deleteOne(
    {
      dbId: dbId(userId, showId),
    },
    (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(showId);
      }
    },
  );
});

export const getShows = userId => new Promise((resolve, reject) => {
  Show.find({ userId }, (err, showList) => {
    if (err) {
      reject(err);
    } else {
      resolve(showList);
    }
  });
});

// BANNER CACHE

export const getBannerUrl = showId => new Promise((resolve, reject) => {
  BannerUrl.findOne({ id: showId }, (err, bannerUrl) => {
    if (err) {
      reject(err);
    } else {
      resolve(bannerUrl);
    }
  });
});

export const addBannerUrl = (bannerUrl, showId) => new Promise((resolve, reject) => {
  new BannerUrl({
    id: showId,
    bannerUrl,
  }).save((err) => {
    if (err) {
      reject(err);
    } else {
      resolve(bannerUrl);
    }
  });
});
