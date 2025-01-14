const validatePictureUpload = (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ message: "No picture file provided" });
    }
    next();
  };
  export default validatePictureUpload;