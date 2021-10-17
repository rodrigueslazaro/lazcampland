const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
const m = module.exports;

m.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}

m.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

m.createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    if(!campground.images[0]){
        campground.images = { url: 'https://res.cloudinary.com/dau70uw5o/image/upload/v1634403411/YelpCamp/ehwsqruihejwhqeidg2g.jpg', filename: 'YelpCamp/ehwsqruihejwhqeidg2g'};
    }
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new Campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

m.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if ( !campground ) {
        req.flash('error', "Campground not found!");
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});
    
}

m.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if ( !campground ) {
        req.flash('error', "Campground not found!");
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
}

m.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if ( req.body.deleteImages ) {
        for ( let filename of req.body.deleteImages ) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    }
    req.flash('success', "Successfully updated campground!");
    res.redirect(`/campgrounds/${campground._id}`);
}

m.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', "Successfully deleted campground!");
    res.redirect('/campgrounds');
}