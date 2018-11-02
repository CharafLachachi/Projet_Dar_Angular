//Install express server
const express = require('express');
const path = require('path');

const app = express();

const path = require('path');


// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/<name-of-app>'));
app.get('*', (req, res) => {
    res.sendFile(`./front-end/dist/index.html`); // load the single view file (angular will handle the page changes on the front-end)
});
// app.get('/*', function(req,res) {
    
// res.sendFile(path.join(__dirname+'/dist/<name-of-app>/index.html'));
// });

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);