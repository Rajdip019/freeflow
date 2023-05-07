import React, { useEffect, useRef, useState } from "react";

const Test = () => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [image, setImage] = useState<string>();

  useEffect(() => {
    console.log(imageRef.current?.height);
  }, [imageRef, image]);

  useEffect(() => {
    setImage(
      "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
    );
  }, []);

  return (
    <div>
      <img ref={imageRef} className="w-full" src={image} alt="" />
    </div>
  );
};

export default Test;
