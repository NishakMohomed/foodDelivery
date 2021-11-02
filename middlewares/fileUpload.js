const multer = require('multer');

    //Define storage for image upload
    const storage = multer.diskStorage({

        //destination for the files
        destination: function(req, file, callback){
            callback(null, './public/images/products');
        },

        //add back the extension
        filename: function(req, file, callback){
            callback(null, Date.now() + file.originalname)
        }
    });

    //upload parameters for multer
    const upload = multer({
        storage: storage,
        limits: {
            fieldSize: 1024 * 1024 * 3
        }
    });

    module.exports = upload;