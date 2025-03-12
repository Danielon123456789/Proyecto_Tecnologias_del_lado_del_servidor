
import express from 'express'
import {config} from 'dotenv'
config();

import routes from './routes/index';

const port = process.env.PORT || 5000

const app = express();

app.get('',(req,res) =>{
    res.send("api work")
})

app.use('',routes);

app.listen(port,()=>{
    console.log(`app is runnign in port ${port}`)
})