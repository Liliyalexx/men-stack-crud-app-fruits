// Here is where we import modules
// We begin by loading Express
const express = require('express');
const dotenv = require("dotenv"); // require package
const mongoose = require("mongoose"); // require package
const methodOverride = require("method-override"); 
const morgan = require("morgan"); 
 // Import the Fruit model
 const Fruit = require("./models/fruit.js");

//initialize the express application
const app = express();

//config code
dotenv.config(); // Loads the environment variables from .env file


//body parser middleware:this function reads the requiest body and decodes it into req.body so we can access from data!

app.use(express.urlencoded({ extended: false }));
// Mount it along with our other middleware, ABOVE the routes
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method")); // new
app.use(morgan("dev")); //new

//home page
app.get('/', async(req, res) => {
    res.render('index.ejs')
})

// GET /fruits/new
app.get("/fruits/new", (req, res) => {
    //never add a trailing slash with render!
    res.render("fruits/new.ejs");// relative path
  });
  
  // POST /fruits
app.post("/fruits", async (req, res) => {
    // if(req.body.isReadyToEat == "on"){
    //     req.body.isReadyToEat = true;
    // } else {
    //     req.body.isReadyToEat = false;
    // }
    req.body.isReadyToEat = !!req.body.isReadyToEat;

    await Fruit.create(req.body);
   res.redirect("/fruits"); // URL path 
  });

  //index route for fruits - sends a page that lists add fruits from the database

  app.get('/fruits', async (req, res) => {
    const allFruits = await Fruit.find({});
    console.log(allFruits);
    res.render('fruits/index.ejs', {fruits: allFruits});
  })


//show route - for sending a page with the details for one particular fruit
app.get("/fruits/:fruitId", async (req, res) => {
    const foundFruit = await Fruit.findById(req.params.fruitId);
    res.render("fruits/show.ejs", { fruit: foundFruit });
  });
  

// Connect to MongoDB using the connection string in the .env file
mongoose.connect(process.env.MONGODB_URI);

// log connection status to terminal on start
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
  });
mongoose.connection.on('error', (error) => {
    console.log(`An errorconnectiong to MongoDB has occured: ${error}`)
})


app.listen(3001, () => {
  console.log('Listening on port 3001');
});
