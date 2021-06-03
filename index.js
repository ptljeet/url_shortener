const express = require('express');
const bodyParser = require('body-parser');
const app = express()
const port = 3000


var admin = require("firebase-admin");
var serviceAccount = require("./shorten-1b9ae-firebase-adminsdk-8vgmf-8bed348ce8.json");
const { response } = require('express');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const static = express.static("public");

const urlsdb = admin.firestore().collection("urlsdb")

app.use(static);
app.use(bodyParser.json());

// app.use(( req, res, next ) => {
//   console.log("we intercepted the req")
//   next();
// })

app.get('/:short', (req, res) => {
  console.log(req.params);
  const short = req.params.short;

  const doc = urlsdb.doc(short);

  doc.get().then(response => {
    const data = response.data();
    // console.log(data);
    if (data && data.url) {
      res.redirect(301, data.url);
    }
    else{
      res.redirect(301, "https://github.com/rebeljeet")
    }
  })

  // res.send("we will redirect you to " + short);

})


app.post('/admin/urls/', (req, res) => {
  console.log(req.body);

  res.send('Hello from another!')
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})