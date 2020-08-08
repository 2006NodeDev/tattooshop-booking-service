import  express, { Request, Response,} from 'express';
import { bookingRouter } from './routers/bookings-router';
import { loggingMiddleware } from './middlewares/logging-middleware';

import { corsFilter } from './middlewares/cors-filter';
import { JWTVerifyMiddleware } from './middlewares/jwt-verify-middleware';


const app = express();

app.use(express.json({limit:'50mb'}))
app.use(loggingMiddleware)
app.use(corsFilter)

app.use(JWTVerifyMiddleware)

//app.use(authenticationMiddleware) //asks for username and password 
// custom middleware to run on all request
app.use('/bookings', bookingRouter)
app.get('/health', (req:Request, res:Response)=>{
    res.sendStatus(200)
})

app.use((err, req, res, next) =>{
    if(err.statusCode){
        res.status(err.statusCode).send(err.message)
    }else {
        console.log(err)
        res.status(500).send("Something went wrong")
    }
})

app.listen(2013, ()=>{
    console.log('Server has started');
})
