import React from "react";

type CloudinaryInfo = { secure_url: string };
interface CloudinaryUploadButtonProps {
    onUpload: (info: CloudinaryInfo | CloudinaryInfo[]) => void;
}

const CloudinaryUploadButton: React.FC<CloudinaryUploadButtonProps> = ({
    onUpload,
}) => {
    const openWidget = () => {
        window.cloudinary.openUploadWidget(
            {
                cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
                uploadPreset: "art_img",
                sources: ["local", "url", "camera"],
                multiple: true,
            },
            (error: any, result: any) => {
                if (!error && result && result.event === "success") {
                    onUpload(result.info);
                }
            }
        );
    };
    return (
        <button type="button" onClick={openWidget}>
            이미지 업로드
        </button>
    );
};

export default CloudinaryUploadButton;
