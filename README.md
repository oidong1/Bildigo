# Bildigo
## Javascript Visualization Tool for Education.

Implementation using Node & V8debugger.
It forked from jstutor (https://github.com/manhhung741/jstutor).

== Installation

You will need to open TCP port 5858 to allow the server connect to the JS debugger.

1. Install Node

        https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager

2. Install dependency packages

        $ npm install

3. Run the server. The default port (of the server) is 8082.

        $ node server.js

3.1 You can also use the pm2 package to keep the server running

        https://github.com/Unitech/pm2

        $ npm install pm2@latest -g
