import axios from "axios";
import React, { useState } from "react";

export default function UploadMultiple() {
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  const handleChange = (e) => {
    const files = Array.from(e.target.files);

    setImages(files);

    //    Xử lý preview
    const filePreviews = files.map((file) => URL.createObjectURL(file));

    setPreviews(filePreviews);
  };

  const handleRemovePreview = (index) => {
    const newPrivews = previews.filter((prev, i) => i !== index);
    const newImages = images.filter((prev, i) => i !== index);

    setPreviews(newPrivews);
    setImages(newImages);
  };

  const handleUpload = async () => {
    const urls = [];
    if (images.length < 3) {
      alert("Vui lòng chọn ít nhất 3 hình ảnh");
      return;
    }

    // Gọi API
    try {
      for (const pre of images) {
        const formData = new FormData();
        formData.append("file", pre);
        formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
        formData.append("cloud_name", import.meta.env.VITE_CLOUD_NAME);

        // setIsLoading(true);
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUD_NAME
          }/image/upload`,
          formData
        );
        urls.push(response.data.secure_url);
      }

      setImageUrls(urls);

      setPreviews([]);
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      // setIsLoading(false);
    }
  };
  return (
    <div>
      {previews.length !== 0 && (
        <>
          <h3>Ảnh preview</h3>
          {previews.map((prev, index) => (
            <>
              <img height={100} width={200} key={index} src={prev} alt="" />
              <button onClick={() => handleRemovePreview(index)}>X</button>
            </>
          ))}
        </>
      )}

      {imageUrls.length !== 0 && (
        <>
          <h3>Ảnh sau khi upload</h3>
          {imageUrls.map((prev, index) => (
            <>
              <img height={100} width={200} key={index} src={prev} alt="" />
            </>
          ))}
        </>
      )}

      <input type="file" multiple onChange={handleChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
