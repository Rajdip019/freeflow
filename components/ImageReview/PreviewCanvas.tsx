import React from 'react'
import { getEditorDefaults } from '@pqina/pintura'
import { PinturaEditor } from '@pqina/react-pintura'

interface PreviewCanvasProps {
    imageSrc: string,
    height?: string,
}

const PreviewCanvas: React.FC<PreviewCanvasProps> = ({ imageSrc, height='65vh' }) => {
    const editorRef = React.useRef(null)
    const editorPdfconfig = getEditorDefaults({})
    return (
        <div style={{ height: height}}>
            <PinturaEditor
                {...editorPdfconfig}
                previewUpscale={true}
                ref={editorRef}
                src={imageSrc.replace(
                    "https://firebasestorage.googleapis.com",
                    "https://ik.imagekit.io/freeflow"
                )}
                enableUtils={false}
                enableToolbar={false}
                enableButtonExport={false}
                cropEnableZoomInput={false}
                cropEnableRotationInput={false}
                cropEnableButtonFlipHorizontal={false}
                cropEnableButtonRotateLeft={false}
                cropEnableImageSelection={false}
            ></PinturaEditor>
        </div>
    )
}

export default PreviewCanvas