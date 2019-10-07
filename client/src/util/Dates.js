const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const dateNum = date.getDate();
  return (isNaN(dateNum))
    ? 'No air date listed'
    : `${days[date.getDay()]
    } ${
      dateNum
    } ${
      months[date.getMonth()]
    } ${
      date.getFullYear()}`;
};

export default formatDate;
