const DEBUG = true;

/* eslint-disable no-console */
const log = (msg, debugMsg = true) => {
  if (!DEBUG && debugMsg) return;
  console.log(`LOGGED: ${msg}`);
};

export default log;
