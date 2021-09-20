'use strict';
import AWS from 'aws-sdk';
const BUCKET = 'uploaded-product';

export const importProductsFile = async (event) => {

  const s3 = new AWS.S3({region: 'eu-west-1'});
  const { name } = event.queryStringParameters;
  
  console.log(`CHECK EVENT ${event}`);
  console.log(`CHECK NAME: ${name}`);

  const catalogPath = `uploaded/${name}`;

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

    console.log(`CHECK URL: ${signURL}`);
   
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
      body: JSON.stringify({
        message: `Unhandled error!!!`
      })
    }
  };
};
