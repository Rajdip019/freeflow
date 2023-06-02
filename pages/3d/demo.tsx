import React, { useEffect, useRef } from "react";
import * as BABYLON from "babylonjs";
import "babylonjs-loaders";
import { Avatar, Textarea } from "@chakra-ui/react";
import Moment from "react-moment";
import Linkify from "react-linkify";

const Test = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCommenting, setIsCommenting] = React.useState<boolean>(false);
  const [annotations, setAnnotations] = React.useState<any[]>([]);
  const [annotationComment, setAnnotationComment] = React.useState<string>("");
  const [cameraPosition, setCameraPosition] = React.useState<any>({
    x: 0,
    y: 0,
    z: 5,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const engine = new BABYLON.Engine(canvas, true);

    // Annotations

    const createScene = async () => {
      const scene = new BABYLON.Scene(engine);

      // Camera
      const camera = new BABYLON.ArcRotateCamera(
        "camera",
        0,
        0,
        0.05,
        BABYLON.Vector3.Zero(),
        scene
      );
      camera.attachControl(canvas, true);

      // Set the camera's radius constraint
      const minCameraRadius = 2;
      const maxCameraRadius = 10;
      camera.lowerRadiusLimit = minCameraRadius;
      camera.upperRadiusLimit = maxCameraRadius;

      // Light
      const light = new BABYLON.HemisphericLight(
        "light",
        new BABYLON.Vector3(0, 1, 0),
        scene
      );

      // Environment
      const hdrTexture = new BABYLON.CubeTexture(
        "uploads_files_2397542_black_leather_chair.gltf",
        scene
      );
      scene.environmentTexture = hdrTexture;

      // Model
      await BABYLON.SceneLoader.ImportMeshAsync(
        "",
        "/",
        "uploads_files_2397542_black_leather_chair.gltf",
        scene
      );

      if (canvas) {
        canvas.addEventListener("dblclick", () => {
          const pickResult = scene.pick(scene.pointerX, scene.pointerY);
          if (pickResult.hit) {
            const position = pickResult.pickedPoint;
            createAnnotation(position, scene);
          }
        });
      }

      function createAnnotation(position: any, scene: any) {
        // Create a disc (2D circle) instead of a sphere
        const disc = BABYLON.MeshBuilder.CreateDisc(
          "annotation",
          { radius: 0.025 },
          scene
        );
        disc.position.copyFrom(position);
        disc.material = new BABYLON.StandardMaterial(
          "annotationMaterial",
          scene
        );

        var textureGround = new BABYLON.DynamicTexture(
          "dynamic texture",
          { width: 800, height: 800 },
          scene
        );
        var materialGround = new BABYLON.StandardMaterial("Mat", scene);
        materialGround.diffuseTexture = textureGround;
        disc.material = materialGround;

        //Add text to dynamic texture
        var font = "bold 500px monospace";
        textureGround.drawText(
          `${annotations.length + 1}`,
          260,
          550,
          font,
          "green",
          "white",
          false,
          true
        );
        // disc.material.diffuseColor = BABYLON.Color3.Yellow();
        disc.actionManager = new BABYLON.ActionManager(disc.getScene());
        disc.actionManager.registerAction(
          new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPickTrigger,
            () => {
              // Do something when the disc is clicked/tapped
              console.log("Annotation clicked");
            }
          )
        );

        // Make the disc transparent
        disc.material.alpha = 0.6;

        // Make the disc always face the camera
        disc.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;

        // Set the renderingGroupId to ensure the disc is always visible
        disc.renderingGroupId = 1;

        annotations.push(disc);
        setIsCommenting(true);
      }

      return scene;
    };

    const runRenderLoop = async () => {
      const scene = await createScene();

      engine.runRenderLoop(() => {
        scene.render();
      });
    };

    window.addEventListener("resize", () => {
      engine.resize();
    });

    runRenderLoop();

    return () => {
      engine.dispose();
    };
  }, [annotations, cameraPosition]);

  function deleteAnnotation() {
    setAnnotations((prev) => {
      const newAnnotations = prev.slice(0, prev.length - 1);
      return newAnnotations;
    });
    setIsCommenting(false);
  }

  function addAnnotation() {
    annotations[annotations.length - 1].uname = "Rajdeep Sengupta";
    annotations[annotations.length - 1].comment = annotationComment;
    annotations[annotations.length - 1].timeStampNew = new Date();
    setIsCommenting(false);
  }

  // console.log(annotations[0].position);

  const componentDecorator = (href: string, text: string, key: any) => (
    <a className="linkify__text" href={href} key={key} target="_blank">
      {text}
    </a>
  );

  return (
    <div className=" font-sec  flex h-[100vh] w-[100vw] bg-gray-900">
      <div>
        <canvas ref={canvasRef} className=" h-[75vh] w-[75vw]"></canvas>
        <div className=" mt-5 w-[75vw] px-5">
          {isCommenting ? (
            <div>
              <div className=" mb-2 flex items-center justify-between">
                <p className=" text-white">Write your comment here</p>
                <button
                  className=" text-gray-300 underline underline-offset-4"
                  onClick={deleteAnnotation}
                >
                  Cancel Comment
                </button>
              </div>
              <Textarea
                className="h-5 border-none bg-gray-900 text-white"
                size="sm"
                // ref={textareaRef}
                placeholder="Write your message..."
                focusBorderColor="purple.500"
                value={annotationComment}
                onChange={(e) => {
                  setAnnotationComment(e.target.value);
                }}
                //   onKeyPress={(e) => {
                //     if(newThread.comment.value === "") return;
                //     if (e.key === "Enter") {
                //       addNewThread();
                //     }
                // }}
              />
              <button
                onClick={addAnnotation}
                className=" mt-2 rounded bg-purple-500 px-2 py-1 text-white hover:bg-purple-600"
              >
                Add Comment
              </button>
            </div>
          ) : (
            <p className=" mx-auto text-lg text-white">
              {" "}
              Double Click on anywhere to start commenting...
            </p>
          )}
        </div>
      </div>
      <div className=" w-[25vw] bg-gray-800">
        <div className="flex items-center">
          <p className=" py-2 pl-4 pr-2 text-xl text-white">Comments</p>
          <p className=" flex h-6 w-6 items-center justify-center rounded-full bg-gray-700 p-1 text-white">
            {annotations.length}
          </p>
        </div>
        {annotations.map((annotation, index) => {
          return (
            <div
              className="border-b border-gray-950 bg-gray-700 p-4"
              key={index}
              // onClick={() => setCameraPosition({x : annotation.position._x, y : annotation.position._y, z : annotation.position._z - 200})}
            >
              <div className=" flex items-center">
                {annotation.uname && (
                  <Avatar size="md" name={`${index + 1}`} className="mr-2" />
                )}
                <div>
                  <p className=" font-sec font-semibold text-white">
                    {annotation.uname}
                  </p>
                  {annotation.timeStampNew && (
                    <Moment
                      fromNow
                      className="font-sec text-xs font-semibold text-gray-400"
                    >
                      {annotation.timeStampNew}
                    </Moment>
                  )}
                </div>
              </div>
              <p className=" font-sec mt-2 text-sm text-gray-200">
                {" "}
                <Linkify componentDecorator={componentDecorator}>
                  {annotation.comment}
                </Linkify>
              </p>
              {/* <button
                onClick={() => {
                  setHighlightedComment(thread);
                  setIsFocusedThread(true);
                }}
                className=" font-sec mt-1 text-sm text-gray-400 hover:text-gray-200"
              >
                Reply
              </button> */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Test;