const cloudinary = require("../cloudinary/index");

exports.uploadImageToCloudinary = async (filePath, contactId) => {
  const { secure_url: url, public_id } = await cloudinary.uploader.upload(
    filePath,
    {
      folder: `/contact-app/contacts/${contactId}`,
    }
  );

  return { url, public_id };
};
