import React from "react";
import View3D, { Annotation } from "@egjs/react-view3d";
import "@egjs/react-view3d/css/view3d-bundle.min.css";

const Test = () => {
  // const newAnn = new Annotation(View3D, )
  return (
    <div>
      <View3D
        tag="div"
        src="/skybox.jpg"
        envmap="/uploads_files_2397542_black_leather_chair.gltf.hdr"
        className="h-screen w-screen"
        // onReady={(e) => {
        //   console.log(e.target.annotation.add());
        // }}
      ></View3D>
    </div>
  );
};

export default Test;
