const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMAte = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

main().then(console.log("connected to DB"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMAte);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/" , (req ,res) =>{
    console.log("Hi I am root")
});

// app.get("/testListing" , async (req , res) =>{
//     let sampleListing = new Listing ({
//         title : "my New villa" , 
//         description : "BY the beach",
//         price : 12000,
//         location : "Mumbai , Maharastra",
//         country : "India",
//     });

//     await sampleListing.save();
//     console.log("sample was save");
//     res.send("saved");
// });

//Index Route
app.get("/listings" ,  wrapAsync(async (req , res) =>{
   const allListing =  await Listing.find({});
    res.render("listings/index.ejs" , {allListing});
}));

//New Route
app.get("/listings/new" , (req ,res)=>{
    res.render("listings/new.ejs");
});


//Show route
app.get("/listings/:id" ,  wrapAsync(async(req ,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs" , {listing});
}));

//Create Route
app.post("/listings" ,
     wrapAsync(async(req,res)=>{
        if(!req.body.listing){
            throw new ExpressError(400 , "Send valid Data for listing");
        }
    // let {title,description , price , counry , location} = req.body;
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//Edit Route
app.get("/listings/:id/edit" ,  wrapAsync(async(req , res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs" , {listing});

}));

//Update Route
app.put("/listings/:id" ,  wrapAsync(async (req,res)=>{
    if(!req.body.listing){
            throw new ExpressError(400 , "Send valid Data for listing");
        }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id , {...req.body.listing});
    res.redirect("/listings");

}));

//Delete Rouote
app.delete("/listings/:id" ,  wrapAsync(async(req , res)=>{
    let{id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

app.all(/.*/ , (req , res , next)=>{
    next(new ExpressError(404 , "Page not found!"));
});

app.use((err, req ,res , next)=>{
    let{statusCode , message} = err;
    res.status(statusCode).send(message);
});

app.listen(8080 , ()=>{
    console.log("server is listening ");
});

