const mongoose = require("mongoose");
const Schema = mongoose.Schema; // so we write Schema in the place of mongoose.Schema

const listingSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    description : String,
    image : {
        filename : {
            type:String
        },
        url : {
        type : String,
        default : "https://unsplash.com/photos/mountain-peak-reflecting-in-calm-lake-at-sunrise-FLfNL6XuOEM",
        set : (v) =>
            v ==="" 
            ? "https://unsplash.com/photos/mountain-peak-reflecting-in-calm-lake-at-sunrise-FLfNL6XuOEM"
            :v,
        }       
       
    },
    price : Number,
    location : String,
    country : String,

});

const Listing = mongoose.model("Listing" , listingSchema);
module.exports = Listing;