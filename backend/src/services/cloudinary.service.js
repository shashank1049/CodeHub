import { cloudinary } from "../config/cloudinary.js";

const uploadToCloudinary = (fileBuffer, folder) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image",
            },
            (error, result) => {
                if (error) {
                    console.error("========== CLOUDINARY ERROR ==========");
                    console.error("Message:", error.message);
                    console.error("HTTP Code:", error.http_code);
                    console.error("Name:", error.name);
                    console.error("Full Error:", error);
                    console.error("======================================");

                    reject(error);
                    return;
                }

                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                });
            }
        );

        uploadStream.end(fileBuffer);
    });
};

const deleteFromCloudinary = async (publicId) => {
    if (!publicId) {
        return;
    }

    await cloudinary.uploader.destroy(publicId);
};

// const testCloudinaryUpload = async () => {
//     // Tiny 1x1 transparent PNG
//     const testImage =
//         "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

//     const result = await cloudinary.uploader.upload(
//         testImage,
//         {
//             folder: "codehub/test",
//         }
//     );

//     return {
//         url: result.secure_url,
//         publicId: result.public_id,
//     };
// };


// const diagnoseCloudinaryUpload = async () => {
//     const imageBuffer = Buffer.from(
//         "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
//         "base64"
//     );

//     const formData = new FormData();

//     formData.append(
//         "file",
//         new Blob([imageBuffer], {
//             type: "image/png",
//         }),
//         "test.png"
//     );

//     const auth = Buffer.from(
//         `${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}`
//     ).toString("base64");

//     const response = await fetch(
//         `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
//         {
//             method: "POST",
//             headers: {
//                 Authorization: `Basic ${auth}`,
//             },
//             body: formData,
//         }
//     );

//     const responseText = await response.text();

//     console.log("Cloudinary HTTP status:", response.status);
//     console.log("Cloudinary headers:", {
//         cldError: response.headers.get("X-Cld-Error"),
//         requestId: response.headers.get("X-Cld-Request-Id"),
//     });
//     console.log("Cloudinary response:", responseText);

//     return {
//         status: response.status,
//         body: responseText,
//         cldError: response.headers.get("X-Cld-Error"),
//     };
// };


export {
    uploadToCloudinary,
    deleteFromCloudinary,
};