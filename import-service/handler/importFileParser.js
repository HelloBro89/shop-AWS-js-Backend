'use strict';
import AWS from 'aws-sdk';
import csv from 'csv-parser';
// const BUCKET = 'uploaded-product';

export const importFileParser = async (event) => {
    const s3 = new AWS.S3({region: 'eu-west-1'});
    console.log(`CHEKC EVENT: ${JSON.stringify(event)}`);
    try {

        const recordsS3 = event.Record[0].s3;
        const BUCKET = recordsS3.Bucket.name;
        const key = recordsS3.object.key;

        const params = {
            Bucket: BUCKET,
            Key: key,
        };


        const s3Stream = s3.getObject(params).createReadStream();

        s3Stream.pipe(csv())
       
           .on('data', (data) => {
               console.log(data);
           })
           .on('error', err => {
            throw new Error(`Reading file failed: ${err}`);
          })
           .on('end', async () => {
               console.log(`Copy from ${BUCKET}/${key}`);

               await s3.copyObject({
               Bucket: BUCKET,
               CopySource: `${BUCKET}/${key}`,
               Key: key.replace('uploaded', 'parser')
              }).promise();

              await s3.deleteObject({
                Bucket: BUCKET,
                Key: key,
              }).promise();
              console.log('File was moved');

           });

         
        // console.log(`Result: ${response}`);

        
   

    return {
        statusCode: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: null
      }

  } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: null
      }
  }
}