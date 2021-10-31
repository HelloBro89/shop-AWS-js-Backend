import axios from 'axios';
import express from 'express';
import { config } from './common/config.js';
// import cors from 'cors';
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cors());

app.all('/*', (req, res) => {
    const recipient = req.originalUrl.split('/')[1].split('?')[0];
    const recipientURL = process.env[recipient];
    // console.log(`CHECK DATA: ${JSON.stringify(req.body)}`)

    if (recipientURL) {
        let finishedURL = '';
        if (recipient === 'cart') {
            finishedURL = recipientURL;
        } else if (recipient === 'products') {
            const productId = (req.query.productId) ? req.query.productId : '';
            finishedURL  = `${recipientURL}/${recipient}/${productId}`;
        }
    // console.log(`*******: ${req.query.productId}`);
    // console.log(`FIRST RECIPIENT: ${recipient}`);
    // console.log(`RECIPIENT URL: ${recipientURL}`);
    // console.log(`FINISHED URL: ${finishedURL}`);

        const axiosConfig = {
            method: req.method,
            url: finishedURL,
            data: Object.keys(req.body).length === 0 ? null : req.body,
            ...(Object.keys(req.body || {}).length > 0 && {data: req.body})
        }

       console.log(`axiosConfig: ${JSON.stringify(axiosConfig)}`);

       axios(axiosConfig)
       .then((response) => {
           console.log(`res from aws: ${response.data}`);
           res.json(response.data)
       })
       .catch(error => {
           console.log(`ERROR MESSAGE: ${JSON.stringify(error)}`);
            if (error.response) {
                const {
                    status,
                    data
                } = error.response;
                console.log(`CHECK STATUS: ${status}`)
                res.status(status).json(data)
            }
       });

    } else {
        res.status(500).json({error: 'Cannot process request!'})
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})