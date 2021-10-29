import axios from 'axios';
import Express, { response } from 'express';
import { config } from './common/config.js';
// import cors from 'cors';
const app = Express();
const PORT = process.env.PORT || 3000;


console.log(config.PORT);

app.use(Express.json());
app.use(Express.urlencoded({ extended: false }));
// app.use(cors());

app.all('/*', /* async */ (req, res) => {
   
    console.log(req.originalUrl);

    const axiosConfig = {
        method: 'get',
        url: 'https://b6sld3tghb.execute-api.eu-west-1.amazonaws.com/dev/products',
        // ...(Object.keys(req.body || {}).length > 0 && {data: req.body})
    }

    console.log(`axiosConfig: ${JSON.stringify(axiosConfig)}`)
    /* const response = await */ axios(axiosConfig)
    // console.log(`RESPONSE FROM AWS: ${JSON.stringify(response)}`)
   .then((response) => {
       console.log(`res from aws: ${response.data}`);
       res.json(response.data)
   })
   .catch(error => {
       console.log(`ERROR: ${JSON.stringify(error)}`)
   })
    // res.json(response.data);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})