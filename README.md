This project is split into two seperate components - a Node Server, and a React client.  The server wraps TVDB calls for show information, and so requires an API key specified in your environment variables.

### server

Run in a seperate environment to the client.

use: 'npm run start'

**You need an environment variable on your OS called TVDB_API_KEY** to connect to TVDB for show information.  You can get a new API key by setting up an account at www.tvdb.com.

### client

Run in a seperate environment to the server.

use: 'npm start'

### reviewing

The majority of the code is currently in server/src/controller.js


