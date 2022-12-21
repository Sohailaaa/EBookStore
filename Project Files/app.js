const express = require("express");
const bodyParser = require("body-parser");
const alert = require("alert");
var session = require("express-session");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const PORT = process.env.PORT || 3030;

// your code

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});

const NAME_TO_ROUTE = {
  "leaves of grass": "leaves",
  "the grapes of wrath": "grapes",
  dune: "dune",
  "lord of the flies": "flies",
  "to kill a mockingbird": "mockingbird",
  "the sun and her flowers": "sun",
};

var { MongoClient } = require("mongodb");

var uri =
  "mongodb+srv://sohailaso:conanco@cluster0.k5asmg8.mongodb.net/?retryWrites=true&w=majority";

var client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function main() {
  await client.connect();
}
const VIEWS_PATH = "./views/books";

main();

///
app.use(
  session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false,
  })
);
//setting view engine to ejs
app.set("view engine", "ejs");

var session;
app.get("/", function (req, res) {
  //  req.session.destroy(); session = req.session; res.redirect('login', { errormsg: "" })
  res.redirect("/login");
});
app.get("/login", async function (req, res) {
  res.render("login", { errormsg: "" });
});

app.post("/login", async function (req, res) {
  var x = req.body.username;
  var y = req.body.password;
  if (x === "admin" && y === "admin") {
    session = req.session;
    session.userid = req.body.username;
    res.redirect("/home");
  }

  if (x && y) {
    let sth = await client
      .db("firstdb")
      .collection("firstcollection")
      .findOne({ username: x, password: y });

    if (!sth) {
      res.render("login", { errormsg: "Wrong username or password" });
    } else {
      session = req.session;
      session.userid = req.body.username;
      res.redirect("/home");
    }
  } else {
    res.render("login", { errormsg: "Must enter username and password" });
  }
});

//route for search page
app.post("/search", function (req, res) {
  const { Search } = req.body;
  const SearchArr = Search.split(" ");
  console.log(req.body);
  const books = [
    { name: "dune", path: "dune" },
    { name: "lord of the flies", path: "flies" },
    { name: "the grapes of wrath", path: "grapes" },
    { name: "leaves of grass", path: "leaves" },
    { name: "to kill a mockingbird", path: "mockingbird" },
    { name: "the sun and her flowers", path: "sun" },
  ];

  const booksList = books.filter((book) =>
    SearchArr.some((word) =>
      book.name.toLowerCase().includes(word.toLowerCase())
    )
  );
  console.log(booksList);
  res.render("searchresults", {
    booksList,
  });
});

//rou
app.get("/registration", function (req, res) {
  if (req.session.user == null) res.render("registration", { errormsg: "" });
  else app.redirect("/home");
});

app.post("/register", async function (req, res) {
  var x = req.body.username;
  var y = req.body.password;
  if (y === null || x === null) {
    alert("please enter your full data");
  }
  var user = await client
    .db("firstdb")
    .collection("firstcollection")
    .findOne({ username: x, password: y });
  var insertUser = { username: x, password: y, books: [""] };

  if (user === null) {
    client.db("firstdb").collection("firstcollection").insertOne(insertUser);
    res.redirect("/login");
  } else {
    res.render("registration", { errormsg: "Username is taken" });
  }
});

//route for poetry page
app.get("/poetry", function (req, res) {
  res.render("poetry", { errormsg: "" });
});

//route for sun page
app.get("/sun", function (req, res) {
  res.render("sun", { errormsg: "" });
});

//route for leaves page
app.get("/leaves", function (req, res) {
  res.render("leaves", { errormsg: "" });
});

//route for novel page
app.get("/novel", function (req, res) {
  res.render("novel", { errormsg: "" });
});

//route for grapes page
app.get("/grapes", function (req, res) {
  res.render("grapes", { errormsg: "" });
});

//route for flies page
app.get("/flies", function (req, res) {
  res.render("flies", { errormsg: "" });
});

//route for fiction page
app.get("/fiction", function (req, res) {
  res.render("fiction", { errormsg: "" });
});

//route for mockingbird page
app.get("/mockingbird", function (req, res) {
  res.render("mockingbird", { errormsg: "" });
});

//route for dune page
app.get("/dune", function (req, res) {
  res.render("dune", { errormsg: "" });
});

app.get("/home", function (req, res) {
  res.render("home", { username: req.session.userid });
});

app.get("/readlist", async function (req, res, next) {
  const userInfo = await client
    .db("firstdb")
    .collection("firstcollection")
    .findOne({ username: req.session.userid });
  const { books } = userInfo;
  const booksWithRoutes = books.map((element) => {
    return { name: element, route: NAME_TO_ROUTE[element] };
  });
  res.render("readlist", { books: booksWithRoutes });
});

app.post("/dune", async function (req, res) {
  var userwant = await client
    .db("firstdb")
    .collection("firstcollection")
    .findOne({ username: req.session.userid, books: "dune" });
  if (userwant) {
    res.render("dune", { errormsg: "Already in readlist" });
  } else {
    client
      .db("firstdb")
      .collection("firstcollection")
      .updateOne(
        { username: req.session.userid },
        { $push: { books: "dune" } }
      );
    res.render("dune", { errormsg: "Added successfully" });
  }
});

app.post("/flies", async function (req, res) {
  var userwant = await client
    .db("firstdb")
    .collection("firstcollection")
    .findOne({ username: req.session.userid, books: "lord of the flies" });
  if (userwant) {
    res.render("flies", { errormsg: "Already in readlist" });
  } else {
    client
      .db("firstdb")
      .collection("firstcollection")
      .updateOne(
        { username: req.session.userid },
        { $push: { books: "lord of the flies" } }
      );
    res.render("flies", { errormsg: "Added successfully" });
  }
});

app.post("/sun", async function (req, res) {
  var userwant = await client
    .db("firstdb")
    .collection("firstcollection")
    .findOne({
      username: req.session.userid,
      books: "the sun and her flowers",
    });
  if (userwant) {
    res.render("sun", { errormsg: "Already in readlist" });
  } else {
    client
      .db("firstdb")
      .collection("firstcollection")
      .updateOne(
        { username: req.session.userid },
        { $push: { books: "the sun and her flowers" } }
      );
    res.render("sun", { errormsg: "Added successfully" });
  }
});

app.post("/mockingbird", async function (req, res) {
  var userwant = await client
    .db("firstdb")
    .collection("firstcollection")
    .findOne({ username: req.session.userid, books: "to kill a mockingbird" });
  if (userwant) {
    res.render("mockingbird", { errormsg: "Already in readlist" });
  } else {
    client
      .db("firstdb")
      .collection("firstcollection")
      .updateOne(
        { username: req.session.userid },
        { $push: { books: "to kill a mockingbird" } }
      );
    res.render("mockingbird", { errormsg: "Added successfully" });
  }
});

app.post("/grapes", async function (req, res) {
  var userwant = await client
    .db("firstdb")
    .collection("firstcollection")
    .findOne({ username: req.session.userid, books: "the grapes of wrath" });
  if (userwant) {
    res.render("grapes", { errormsg: "Already in readlist" });
  } else {
    client
      .db("firstdb")
      .collection("firstcollection")
      .updateOne(
        { username: req.session.userid },
        { $push: { books: "the grapes of wrath" } }
      );
    res.render("grapes", { errormsg: "Added successfully" });
  }
});

app.post("/leaves", async function (req, res) {
  let userwant = await client
    .db("firstdb")
    .collection("firstcollection")
    .findOne({ username: req.session.userid, books: "leaves of grass" });
  console.log(userwant);
  if (userwant) {
    res.render("leaves", { errormsg: "Already in readlist" });
  } else {
    client
      .db("firstdb")
      .collection("firstcollection")
      .updateOne(
        { username: req.session.userid },
        { $push: { books: "leaves of grass" } }
      );
    res.render("leaves", { errormsg: "Added successfully" });
  }
});
