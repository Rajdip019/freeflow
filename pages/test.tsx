import React, { useState } from "react";
import axios from "axios";

const GoogleAPIKey = "YOUR_GOOGLE_API_KEY";
const AutoMLModelID = "YOUR_AUTOML_MODEL_ID";

function ImageAutoTagging() {
  const [tags, setTags] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) return;

    const uploadedImage = event.target.files[0];
    setImage(uploadedImage);

    const formData = new FormData();
    formData.append("file", uploadedImage);

    try {
      const response = await axios.post(
        `https://automl.googleapis.com/v1/projects/YOUR_PROJECT_ID/locations/us-central1/models/${AutoMLModelID}:predict`,
        {
          payload: {
            image: {
              imageBytes: formData.get("file"),
            },
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GoogleAPIKey}`,
          },
        }
      );

      // Parse the response and extract tags from the result
      const predictedTags: string[] = response.data.payload.map(
        (prediction: { displayName: string }) => prediction.displayName
      );
      setTags(predictedTags);
    } catch (error) {
      console.error("Error analyzing image:", error);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {image && <img src={URL.createObjectURL(image)} alt="Uploaded" />}
      {tags.length > 0 && (
        <div>
          <h3>Generated Tags:</h3>
          <ul>
            {tags.map((tag, index) => (
              <li key={index}>{tag}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ImageAutoTagging;
