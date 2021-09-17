'use strict';
import AWS from 'aws-sdk';
const BUCKET = 'uploaded-product';

export const importProductsFile = async (event) => {
  const s3 = new AWS.S3({region: 'eu-west-1'});

  // const catalogPath = `uploaded/USA.csv`;

  const { name } = event.queryStringParameters;
  console.log(`NAME: ${name}`)

  let status = 200;
 
  const params = {
    Bucket: BUCKET,
    Key: `uploaded/${name}`,
    Expires: 60,
    ContentType: 'text/csv'
  };

  try {
    let signURL = await new Promise ((resolve, reject) => {

      return s3.getSignedUrl('putObject', params, (error, signURL) => {
        
        if (error || !signURL) {
          reject(error);
         }
        
        resolve(signURL);
    });
 })

 console.log(`Test URL ${signURL}`);
 console.log(`TYPEOF:  ${typeof signURL}`);
   
  } catch (error) {
    console.log(error);
    status = 500;
  };


  const response = {
    statusCode: status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: signURL
  };
    return response;

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
