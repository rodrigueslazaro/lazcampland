const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');


mongoose.connect('mongodb+srv://m001-student:m001-mongodb-basics@sandbox.ckfsk.mongodb.net/Sandbox?retryWrites=true&w=majority', { 
    useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Seeding finished!");
    })
    .catch(err => {
        console.log("ERROR!!");
        console.log(err);
    });

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    const price = Math.floor(Math.random()*20) + 10;
    for (let i = 0; i < 50; i++) {
        const random1k = Math.floor(Math.random() *1000);
        const camp = new Campground({
            author: '61660315292800c0f1b72412',
            location: `${cities[random1k].city}, ${cities[random1k].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Unde nihil excepturi ipsa expedita repellat quo cum quasi, aspernatur, autem natus fugit possimus architecto nisi sed corporis maiores earum suscipit eos!
                          Quo optio debitis animi, voluptatum error voluptas id, at quidem hic, neque pariatur sunt possimus ipsum quisquam ducimus nam cum natus nulla est. Neque ut ea temporibus aliquid incidunt maxime?`,
            price,
            images: [
                {
                  url: 'https://res.cloudinary.com/dau70uw5o/image/upload/v1634157556/YelpCamp/wvhsjv0fejytefig09gy.jpg',
                  filename: 'YelpCamp/wvhsjv0fejytefig09gy',
                },
                {
                  url: 'https://res.cloudinary.com/dau70uw5o/image/upload/v1634157557/YelpCamp/wfbvhn8fk2vi8syu1drw.jpg',
                  filename: 'YelpCamp/wfbvhn8fk2vi8syu1drw',
                },
                {
                  url: 'https://res.cloudinary.com/dau70uw5o/image/upload/v1634157558/YelpCamp/rnlmezgzej1sbhr495l3.jpg',
                  filename: 'YelpCamp/rnlmezgzej1sbhr495l3',
                }
              ],
              geometry: {
                type:"Point",
                coordinates:[-73.9866,40.7306]
              }
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});
