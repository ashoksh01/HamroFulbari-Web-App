const UserCart = require('../models/usercart');
const mongoose = require('mongoose');

 

// use the new name of the database
const url = 'mongodb://localhost:27017/hamro_fulbari'; 
beforeAll(async () => {
    await mongoose.connect(url, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify:false
    });
});

afterAll(async () => {

    await mongoose.connection.close();
});


describe('User Cart Schema testing', () => {
    // the code below is for insert testing
        it('Add item to cart', () => {
            const usercart = {
                'productid': '62c462dc079db21b8c2960ce',
                'productname': 'SSucculent',
                'productprice': '140',
                'productcategory': 'plants',
                'productimage': 'image-1657037532854.jpg',
                'productnumber': 8,
                'addedbyName': 'Obi Wan Kenobi',
                'addedbyID': '5e2f14011fee7c13aded5409',
            };



            return UserCart.create(usercart)
                .then((pro_ret) => {
                    expect(pro_ret.productnumber).toEqual(8);
                });
        });


    // delete individual cart by id
        it('to test the delete cart is working or not', async () => {
            const status = await UserCart.deleteOne({_id :Object('62c462dc079db21b8c2960ce')});
            expect(status.ok).toBe(1);
        })


       // delete all user cart list
        it('to test the delete cart is working or not', async () => {
            const status = await UserCart.deleteMany();
            expect(status.ok).toBe(1);
        })


        // update user cart detail
    it('to test the cart update', async () => {

        return UserCart.findOneAndUpdate({_id :Object('62c462dc079db21b8c2960ce')}, {$set : {productnumber:8}})
        .then((pp)=>{
            expect(pp.productnumber).toEqual(8)
        })

    });


 // select all list
     it('to test the select all user cart is working or not', async () => {
        const status = await UserCart.find({});
        expect(status.length).toBeGreaterThan(0);
    })




})