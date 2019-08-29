const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

export const formatDate = date =>
  days[date.getDay()] +
  " " +
  date.getDate() +
  " " +
  months[date.getMonth()] +
  " " +
  date.getFullYear();
