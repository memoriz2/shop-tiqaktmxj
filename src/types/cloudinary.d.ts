interface CloudinaryUploadWidget {
    openUploadWidget: (
        options: {
            cloudName: string;
            uploadPreset: string;
            sources: string[];
            multiple: boolean;
        },
        callback: (error: any, result: any) => void
    ) => void;
}

interface Window {
    cloudinary: CloudinaryUploadWidget;
}
