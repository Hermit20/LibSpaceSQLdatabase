const http = require('http') //needed for http server
const express = require('express') //routing framework
const path = require('path') //helps assemble file paths
const favicon = require('serve-favicon') //serves favicon icon for browser tabs
const logger = require('morgan') //console logger for dubugging

const  app = express() //create express middleware dispatcher

const PORT = process.env.PORT || 3000

app.locals.pretty = true //to generate pretty view-source code in browser

//read our routes modules javascript file
const routes = require('./routes/index')

//some logger middleware functions for debugging
function methodLogger(request, response, next){
		   console.log("METHOD LOGGER")
		   console.log("================================")
		   console.log("METHOD: " + request.method)
		   console.log("URL:" + request.url)
		   next(); //call next middleware registered
}
function headerLogger(request, response, next){
		   console.log("HEADER LOGGER:")
		   console.log("Headers:")
       for(let k in request.headers) console.log(k)
		   next(); //call next middleware registered
}

//register middleware with dispatcher
//ORDER MATTERS HERE
//middleware

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
//app.use(methodLogger)

//routes
app.get('/index.html', function(req, res, next){
	console.log("Inside the GET / request...");

	//TODO: If the client requested an HTML file, then respond with the index.html file
	if(req.accepts('html')) {
		res.status(200).sendFile(path.join(__dirname, '/public/index.html'));
		
    }
 });
//app.get('/users', routes.users)
app.get('/books', routes.books)
app.get('/books/*', routes.bookDetails)
app.get('/authors/books/*',routes.bookDetails)
app.get('/authors',routes.authors)
app.get('/authors/*',routes.authorDetails)
app.get('/genres',routes.genres)
app.get('/genres/*',routes.genreDetails)

//start server
app.listen(PORT, err => {
  if(err) console.log(err)
  else {
		console.log(`Server listening on port: ${PORT} CNTL:-C to stop`)
		console.log(`Testing:`)
		console.log(`hardcoded user: ldnel, password: secret`)
		console.log(`http://localhost:3000/index.html`)
		console.log(`http://localhost:3000/users`)
		console.log(`http://localhost:3000/songs?title=Girl`)
		console.log(`http://localhost:3000/song/372`)
		}
})
