const express = require('express');
const product = require('../models/products');
const router = new express.Router;
const app = express();
const multer = require('multer');
const path = require("path");
var fs = require("fs");
const auth = require('../authfile/auth');

//image upload process
const storage = multer.diskStorage({
    destination: "./public/productuploads",
    filename: (req, file, callback) => {
        let ext = path.extname(file.originalname);
        callback(null,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      `${file.fieldname}-${Date.now()}${ext}`);
    }
});



const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error("Please Choose an Image to Upload not files."), false);
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: imageFileFilter
})


//Product addition
router.post("/products/",auth.verifyUser, auth.verifyAdmin, upload.single('image'),(req, res) => {
    req.body.image = req.file.filename;
    console.log(req.body);
        product.create(req.body).then(function(){
            return res.json({successmsg :"Product added successfully"});
        }).catch(function(e){
            if(e.name === "ValidationError"){
                return res.status(403).json({errmsg: "Validation Error Occured."});
            }else{
                return res.status(402).json({errmsg:"Something Went Wrong. Try again!"});
            }
        });
    
});

// getting product list
router.get("/products/", (req, res) => {
    product.find({}).then(function(products){
        return res.json(products);
    }
    ).catch(function(e){
        return res.status(402).json({errmsg:"Something Went Wrong. Try again!"});
    }
    );
}

    );

//update for product
router.put('/products/:id',auth.verifyUser,auth.verifyAdmin,(req,res)=>{
    product.findByIdAndUpdate({_id:req.params.id},req.body).then(function(){
         console.log(res.body);
         res.status(200).json({successmsg:"Product Updated Successfully"});
    }).catch(function(e){
         res.send(e)
    });
});

//product delete
router.delete('/products/:id',auth.verifyUser, auth.verifyAdmin,(req,res)=>{
    product.findOne({_id:req.params.id}).then(function(found){
        const filedes= "./public/productuploads/"+found.image;
        fs.unlink(filedes, function (err) {
            if (err) {
                console.log(err);
            }else{
                product.findByIdAndDelete(found.id).then(function(){
                    res.status(200).json({successmsg:"Product Deleted Successfully"});
                 }).catch(function(e){
                     res.status(402).json({errmsg:"Product Could not be deleted."});
                 });
            }
        });
    }).catch(function(e){
        res.send(e)
});

});




module.exports = router;