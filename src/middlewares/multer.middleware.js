import multer from "multer"


// copied from multer docs

// storage is a middleware 

// storage method return filename with url of localpath
 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {   // req(jo user se ati h) is body ka json data and file access milta h vo bech me as middleware and next is cb which is callback function
      cb(null, './public/temp')  // cb ka first parameter is null,second param is destination folder where we want to keep our files in our directory in our same file structure  ( hre we will keep in public folder k andar temo folder)
    },

    filename: function (req, file, cb) {
      cb(null, file.originalname)  // original name means user ne jo nam upload kiya h usse save krlengr 
    }
  })
  
  export const upload = multer({ storage})