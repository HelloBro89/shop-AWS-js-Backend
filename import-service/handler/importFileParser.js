'use strict';
import AWS from 'aws-sdk';
import * as csv from 'csv-parser';
// const BUCKET = 'uploaded-product';

export const importFileParser = async (event) => {
    const s3 = new AWS.S3({region: 'eu-west-1'});
    console.log(`CHEKC EVENT: ${JSON.stringify(event)}`);

    try {

        for (const record of event.Records) {
            
            // event.Records.forEach(records => {

            const BUCKET = record.s3.bucket.name;
            const key = record.s3.object.key;

            const params = {
                Bucket: BUCKET,
                Key: key,
            };

            console.log(`CHECK PARAMS  ${params}`);

            await new Promise((resolve, reject) => {
                s3.getObject(params).createReadStream().pipe(csv())
                .on('data', (data) => {
                    console.log(data);
                })
                .on('error', err => {
                    reject(`Failed: ${err}`)
                })
                .on('end', async () => {

                    console.log(`Copy from ${BUCKET}/${key}`);

                    await s3.copyObject({

                        Bucket: BUCKET,
                        CopySource: `${BUCKET}/${key}`,
                        Key: key.replace('uploaded', 'parser')
                    }).promise();

                    console.log(`Copied to file parser.`)

                    await s3.deleteObject({
                        Bucket: BUCKET,
                        Key: key,
                    }).promise();

                    console.log('File deleted');
                    resolve(`GOOD`);
                });
            })
        }

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