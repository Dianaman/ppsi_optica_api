var express = require('express');
var router = express.Router();
var cloudinary = require('cloudinary');

cloudinary.config({ 
    cloud_name: 'dianaman', 
    api_key: '287223669325873', 
    api_secret: 'MVi3aZNGq2JNwy9tGot3ut7ub4k' 
});
  
router.post('/image-upload', (req, res) => {
    console.log('files', req.files);

    const values = Object.values(req.files)
    const promises = values.map(image => cloudinary.uploader.upload(image.path))
    
    Promise
      .all(promises)
      .then(results => res.json(results))
})
  
module.exports = router;
