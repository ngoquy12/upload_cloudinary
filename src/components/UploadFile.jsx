import axios from "axios";
import React, { useEffect, useState } from "react";

export default function UploadFile() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  console.log(import.meta.env.VITE_API_URL);

  // https://api.cloudinary.com/v1_1/{cloud_name}/image/upload
  // https://api.cloudinary.com/v1_1/ngovanquy/image/upload

  const handleChange = (e) => {
    const fileName = e.target.files[0];

    if (fileName) {
      setFile(fileName);

      setPreview(URL.createObjectURL(fileName));
    }
  };

  console.log("preview: ", preview);

  const handleUpload = async () => {
    if (!file) {
      alert("Vui lòng chọn file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
    formData.append("cloud_name", import.meta.env.VITE_CLOUD_NAME);

    // Gọi API
    try {
      setIsLoading(true);
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUD_NAME
        }/image/upload`,
        formData
      );

      setImageUrl(response.data.secure_url);
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      {isLoading && <div>Đang tải...</div>}
      <h3>Anh preview</h3>
      <img src={preview} alt="" />

      <h3>Ảnh sau khi upload</h3>
      <img src={imageUrl} alt="" />
      <input type="file" onChange={handleChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
