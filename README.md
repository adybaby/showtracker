THE SHOWTRACKER let's you add your favourite shows and then see when they are airing, updating live from TVDB.

This project is split into two seperate components - a Node Server (/server), and a React client (/client).  The server wraps TVDB calls for show information, and so requires an API key, and also uses MONGO Atlas, so needs a mongo Atlas user and password.  Both should be specified in your environment variables.

MONGO ATLAS Setup

Create a Mongo Atlas account at www.mongodb.com/Atlas (it's free)
Create a db and a user with the username "showtracker_default"
Copy the password for that user into an environment variabled called "MONGO_ATLAS_PWD"

TVDB Setup

Create a TVDB account at https://www.thetvdb.com/register (it's free)
Generate an API key at https://www.thetvdb.com/member/api
Copy the API key into an environment variable called "TVDB_API_KEY"

SHOWTRACKER Setup

Download this github project
npm install from the root of the project folder
go to /server - run npm start (port 3000)
go to /client - run npm start (port 3001)


