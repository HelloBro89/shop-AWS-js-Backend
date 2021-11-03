import axios from 'axios';
import express from 'express';
import NodeCache from 'node-cache';
import { config } from './common/config.js';

const app = express();
const PORT = config.PORT || 3000;
 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const cache = new NodeCache({ stdTTL: 10 });

const verifyPath = (req) => {
    if (req.originalUrl.split('/')[1] === 'products' && req.method === 'GET' && !req.query.productId) {
        console.log(`CACHED!`);
       return true;
    } 
    return false;
};

const verifyCache = (req, res, next) => { 
    try {
        if (verifyPath(req) === true) {
            if (cache.has(req.originalUrl)) {
                return res.status(200).json(cache.get(req.originalUrl));
            };
        };
        return next();
    } catch (err) {
        throw Error (err);
    }
};

app.all('/*', verifyCache, (req, res) => {
    const recipient = req.originalUrl.split('/')[1].split('?')[0];
    const strictMatch = req.originalUrl.split('/')[2];
    const recipientURL = process.env[recipient];
    
    if ( strictMatch === '' || !strictMatch && recipientURL) {

        let finishedURL = '';

        switch (recipient) {
            case 'cart':
                finishedURL = recipientURL;
                break;
            case 'products':
                const productId = req.query.productId ? req.query.productId : '';
                finishedURL  = `${recipientURL}/${recipient}/${productId}`;
                break;
        }

        const axiosConfig = {
            method: req.method,
            url: finishedURL,
            // data: Object.keys(req.body).length === 0 ? null : req.body,
            ...(Object.keys(req.body || {}).length > 0 && {data: req.body})
        }

       console.log(`AXIOS CONFIG: ${JSON.stringify(axiosConfig)}`);

       axios(axiosConfig)
       .then((response) => {

           console.log(`RES FROM AWS: ${response.data}`);
           if (verifyPath(req) === true) {
               cache.set(`${req.originalUrl}`, response.data);
           }
           res.json(response.data);
       })
       .catch(error => {
           console.log(`ERROR MESSAGE: ${JSON.stringify(error)}`);
           if (error.response) {
               const {
                   status,
                   data
               } = error.response;
               res.status(status).json(data);
           } 
       });

    } else {
        res.status(500).json({error: 'Cannot process request!'});
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})