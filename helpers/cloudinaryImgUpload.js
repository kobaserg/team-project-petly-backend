const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const fs = require("fs/promises");
const { CLOUD_NAME, API_KEY, API_SECRET } = process.env;

dotenv.config();

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
  secure: true,
});

const cloudinaryImgUpload = async (req) => {
  if (req.file) {
    const { path: tempUpload } = req.file;

    try {
      const { secure_url: avatarURL, public_id: idCloudAvatar } =
        await cloudinary.uploader.upload(tempUpload, {
          folder: "images",
          transformation: {
            with: 288,
            height: 288,
            gravity: "auto",
            crop: "fill",
          },
        });

      await fs.unlink(tempUpload);

      return { avatarURL, idCloudAvatar };
    } catch (error) {
      await fs.unlink(tempUpload);
      throw new Error(error.message);
    }
  }
};

module.exports = cloudinaryImgUpload;
