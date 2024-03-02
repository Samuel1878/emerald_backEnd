// import {
//   S3Client,
//   PutObjectCommand,
//   GetObjectCommand,
// } from "@aws-sdk/client-s3";
// import { fromEnv } from "@aws-sdk/credential-providers";

// const region = "ap-southeast-1";
// const s3Client = new S3Client({
//   credentials: fromEnv(),
//   region,
// });

// export const Get_Photo = (id) => {
//     let photo
//      const readParam = {
//        Bucket: process.env.BUCKET_NAME,
//        Key: process.env.PROFILE_OBJECT_KEY + id,
//      };
//      s3Client
//        .send(new GetObjectCommand(readParam))
//        .then((e) => {
//          return photo = e.Body
//        })
//        .catch((e) => photo = null);
//     return photo
// };