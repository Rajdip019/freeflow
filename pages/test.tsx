import React from 'react'
import { createDefaultColorOptions, createMarkupEditorShapeStyleControls, createMarkupEditorToolbar, getEditorDefaults } from '@pqina/pintura'
import { PinturaEditor } from '@pqina/react-pintura'
import '@pqina/pintura/pintura.css';

const Test = () => {
    const [imageSrc, setImageSrc] = React.useState("https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg");
    const [editedImage, setEditedImage] = React.useState("");
    const editorRef = React.useRef(null)

    const handleButtonClick = async () => {
        //@ts-ignore
        editorRef?.current?.editor.processImage().then((imageWriterResult : any) => {
            // Logs resulting image
            console.log(URL.createObjectURL(imageWriterResult.dest));
            console.log(imageWriterResult);
            
            setEditedImage(URL.createObjectURL(imageWriterResult.dest))
        });
        //@ts-ignore
        await editorRef?.current?.editor.loadImage(imageSrc);
    };

    const editorPdfconfig = getEditorDefaults({})
    return (
        <div className=' h-[80vh]'>
            <PinturaEditor
                {...editorPdfconfig}
                previewUpscale={true}
                ref={editorRef}
                src={imageSrc}
                utils={['annotate']}
                markupEditorToolbar={createMarkupEditorToolbar([
                    ['sharpie', "Pen", {icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>'}],
                    'arrow',
                    'rectangle',
                    'ellipse',
                    'text',
                ])}
                markupEditorShapeStyleControls={createMarkupEditorShapeStyleControls({
                    myStyle : createDefaultColorOptions(),
                    strokeWidthOptions: [2, 4, 8],
                    lineEndStyleOptions: false,
                    lineHeightOptions : false,
                })}
                enableToolbar={false}
                enableButtonExport={false}
                cropEnableZoomInput={false}
                cropEnableRotationInput={false}
                cropEnableButtonFlipHorizontal={false}
                cropEnableButtonRotateLeft={false}
                cropEnableImageSelection={false}
            ></PinturaEditor>
            <button onClick={handleButtonClick}>Load Image</button>
            <img src={editedImage} alt="" />
        </div>
    )
}

export default Test