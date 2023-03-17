const url = require('url')
const sqlite3 = require('sqlite3').verbose() //verbose provides more detailed stack trace

//connect to sqlite database
const db = new sqlite3.Database('data/Lib.db')

db.serialize(function() {
  db.run("DROP TABLE T1")
  db.run("DROP TABLE T2")
  let sqlString = "CREATE TABLE T1 AS Select * from (Written_By JOIN BOOKS) WHERE (bid = id)"
  db.run(sqlString);
  let sqlString2 = "CREATE TABLE T2 AS Select * from (Has JOIN BOOKS) WHERE (bid = id)"
  db.run(sqlString2);
})

function parseURL(request, response) {
    let parseQuery = true //parseQueryStringIfTrue
    let slashHost = true //slashDenoteHostIfTrue
    let urlObj = url.parse(request.url, parseQuery, slashHost)
    console.log('path:')
    console.log(urlObj.path)
    console.log('query:')
    console.log(urlObj.query)
    //for(x in urlObj.query) console.log(x + ': ' + urlObj.query[x]);
    return urlObj
  }
  
  const page_header = `<!DOCTYPE html>
  <html>
  <head>
  <title>LibSpace</title>
  <style>
  body {
    font-family: verdana;
    background-color: lightblue;
  }
  
  h1 {
      color: white;
  }
  
  p, li {
      font-size: 20px;
  }
  table {
      border-collapse: collapse;
      width: 50%;
  }
  
  th, td {
      padding: 8px;
      text-align: left;
      border-bottom: 1px solid #ddd;
  }
  tr:hover {background-color:#f5f5f5;}
  </style>
  </head>
  <body>`
  
  const page_footer = `</body><script>
  const f = document.getElementById('but1');
  const q = document.getElementById('book');
 

  function submitted(event) {
    event.preventDefault();
    console.log(q.value);
    const url = 'http://localhost:3000/books?name='+q.value;
    const win = window.open(url, '_blank');
    win.focus();
  }

  f.addEventListener('submit', submitted);
</script></html>`

  exports.books = function(request, response) {
    // /songs?title=Girl
    console.log("RUNNING GET SONGS")
  
    let urlObj = parseURL(request, response)
    let sql = "SELECT id, name FROM Books"
  
    if (urlObj.query['name']) {
      console.log("finding title: " + urlObj.query['name'])
      sql = "SELECT id, name FROM Books WHERE name LIKE '%" +
        urlObj.query['name'] + "%'"
    }
  
    db.all(sql, function(err, rows) {
      response.writeHead(200, {'Content-Type': 'text/html'})
      response.write(page_header)
      response.write(`<h1>Books</h1>`)
      response.write("<label for='book'>Search for Book:</label><br> <input type='text' id='book' name='book'><br>")
      response.write("<button id = 'but1'>Search</button>")
      
      for (let i = 0; i < rows.length; i++) {
        response.write(`<p><a href='books/${rows[i].id}'>${rows[i].name}</a></p>`)
      }
      response.write(page_footer)
    //write end send response to client
    response.end()
    })
  }


  exports.bookDetails = function(request, response) {
    // /song/235
      let urlObj = parseURL(request, response);
      let bookID = urlObj.path; //expected form: /song/235
      bookID = bookID.substring(bookID.lastIndexOf("/") + 1, bookID.length)
    
      let sql = "SELECT id, type, price, amount, name FROM Books WHERE id=" + bookID
      console.log("GET BOOK DETAILS: " + bookID)
    
      db.all(sql, function(err, rows) {
        response.writeHead(200, {'Content-Type': 'text/html'})
        response.write(page_header)
        response.write(`<h1>Book Details</h1>`)
        for (let i = 0; i < rows.length; i++) {
          response.write(`<h1>${rows[i].id}:  ${rows[i].name}</h1>`)
          response.write(`<p>price: ${rows[i].price}</p>`)
          response.write(`<p>amount: ${rows[i].amount}</p>`)
          response.write(`<p>type: ${rows[i].type}</p>`)
        }
        response.write(page_footer)
      //write end send response to client
        response.end()
      })
    }

    exports.authors = function(request, response) {
        // /songs?title=Girl
        console.log("RUNNING GET SONGS")
      
        let urlObj = parseURL(request, response)
        let sql = "SELECT id, name FROM Authors"
      
        if (urlObj.query['name']) {
          console.log("finding title: " + urlObj.query['title'])
          sql = "SELECT id, name FROM Authors WHERE name LIKE '%" +
            urlObj.query['name'] + "%'"
        }
      
        db.all(sql, function(err, rows) {
          response.writeHead(200, {'Content-Type': 'text/html'})
          response.write(page_header)
          response.write(`<h1>Authors</h1>`)
          response.write("<label for='Authors'>Search for Author:</label><br> <input type='text' id='Authors' name='Authors'><br>")
          for (let i = 0; i < rows.length; i++) {
            response.write(`<p><a href='authors/${rows[i].id}'>${rows[i].name}</a></p>`)
          }
          response.write(page_footer)
        //write end send response to client
        response.end()
        })
      }


      exports.authorDetails = function(request, response) {
        // /song/235
          let urlObj = parseURL(request, response);
          let Aid = urlObj.path; //expected form: /song/235
          Aid = Aid.substring(Aid.lastIndexOf("/") + 1, Aid.length)
        
          let sql = "SELECT  id, name FROM T1 WHERE aid=" + Aid
          console.log("GET BOOK DETAILS: " + Aid)
        
          db.all(sql, function(err, rows) {
            response.writeHead(200, {'Content-Type': 'text/html'})
            response.write(page_header)
            response.write(`<h1>Author's Books</h1>`)
            for (let i = 0; i < rows.length; i++) {
              //response.write(`<h1>${rows[i].id}:  ${rows[i].name}</h1>`)
              response.write(`<p><a href='/books/${rows[i].id}'>${rows[i].name}</a></p>`)
            }
            response.write(page_footer)
          //write end send response to client
            response.end()
          })
        }


        exports.genres = function(request, response) {
            // /songs?title=Girl
            console.log("RUNNING GET SONGS")
          
            let urlObj = parseURL(request, response)
            let sql = "SELECT name FROM Genre"
          
            if (urlObj.query['name']) {
              console.log("finding title: " + urlObj.query['title'])
              sql = "SELECT name FROM Genre WHERE name LIKE '%" +
                urlObj.query['name'] + "%'"
            }
          
            db.all(sql, function(err, rows) {
              response.writeHead(200, {'Content-Type': 'text/html'})
              response.write(page_header)
              response.write(`<h1>Genres</h1>`)
              response.write("<label for='Genres'>Search for Genre:</label><br> <input type='text' id='Genres' name='Genres'><br>")
              for (let i = 0; i < rows.length; i++) {
                response.write(`<p><a href='genres/${rows[i].name}'>${rows[i].name}</a></p>`)
              }
              response.write(page_footer)
            //write end send response to client
            response.end()
            })
          }
    
    
          exports.genreDetails = function(request, response) {
            // /song/235
              let urlObj = parseURL(request, response);
              let Aid = urlObj.path; //expected form: /song/235
              Aid = Aid.substring(Aid.lastIndexOf("/") + 1, Aid.length)

              console.log(Aid)
              
              let sql = "SELECT  id, name FROM T2 WHERE gname= '" + Aid + "'"
              console.log("GET BOOK DETAILS: " + Aid)
            
              db.all(sql, function(err, rows) {
                response.writeHead(200, {'Content-Type': 'text/html'})
                response.write(page_header)
                response.write(`<h1>Books avaliable in Genre </h1>`)
                for (let i = 0; i < rows.length; i++) {
                  //response.write(`<h1>${rows[i].id}:  ${rows[i].name}</h1>`)
                  response.write(`<p><a href='/books/${rows[i].id}'>${rows[i].name}</a></p>`)
                }
                response.write(page_footer)
              //write end send response to client
                response.end()
              })
              
            }