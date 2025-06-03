import React from "react";

type CloudinaryInfo = { secure_url: string };
interface CloudinaryUploadButtonProps {
    onUpload: (info: CloudinaryInfo | CloudinaryInfo[]) => void;
    buttonText?: string;
    multiple?: boolean;
}

const CloudinaryUploadButton: React.FC<CloudinaryUploadButtonProps> = ({
    onUpload,
    buttonText = "이미지 업로드",
    multiple = true,
}) => {
    const openWidget = () => {
        window.cloudinary.openUploadWidget(
            {
                cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
                uploadPreset: "art_img",
                sources: ["local", "url", "camera"],
                multiple,
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
            {buttonText}
        </button>
    );
};

export default CloudinaryUploadButton;
