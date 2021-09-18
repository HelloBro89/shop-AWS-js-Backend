'use strict';
import AWS from 'aws-sdk';
const BUCKET = 'uploaded-product';

export const importProductsFile = async (event) => {

  const s3 = new AWS.S3({region: 'eu-west-1'});
  const { name } = event.queryStringParameters;
  const catalogPath = `uploaded/${name}`;
  console.log(`NAME: ${name}`);

  const params = {
    Bucket: BUCKET,
    Key: catalogPath,
    Expires: 60,
    ContentType: 'text/csv'
  };

  try {

    const signURL = await new Promise ((resolve, reject) => {

      return s3.getSignedUrl('putObject', params, (error, signURL) => {
        
        if (error || !signURL) {
          reject(error);
         }
        
        resolve(signURL);
    });
 })

  console.log(`TEST CHECK URL: ${signURL}`)
   
  return {
    statusCode: 200,
    headers: {

    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
  body: signURL
}

  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: signURL
    }
  };
};





// 'use strict';
// import AWS from 'aws-sdk';
// const BUCKET = 'uploaded-product';
// 
// export const importProductsFile = async (event) => {
//   const s3 = new AWS.S3({region: 'eu-west-1'});
//   let status = 200;
//   let thumbnails = [];
//   const params = {
//     Bucket: BUCKET,
//     Prefix: 'uploaded/'
//   };
// 
//   try {
//     const s3Response = await s3.listObjectsV2(params).promise();
//     thumbnails = s3Response.Contents;
//   } catch (error) {
//     console.log(error);
//     status = 500;
//   };
// 
//   const response = {
//     statusCode: status,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Credentials': true,
//     },
//     body: JSON.stringify(
//       thumbnails
//       .filter(thumbnails => thumbnails.Size)
//       .map(thumbnails => `https://${BUCKET}.s3.amazonaws.com/${thumbnails.Key}`)
//     )
//   };
//     return response;
// 
// };
