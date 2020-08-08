import { Request, Response, NextFunction } from "express";


export function corsFilter(req:Request, res:Response, next:NextFunction){
//we always have to set Access-Control-Allow-Origin header on every request
    res.header('Access-Control-Allow-Origin',  `${req.headers.origin}`) // this is bad, don't do this when your app is deployed
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization')
    res.header('Access-Control-Expose-Headers', 'Authorization')
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE')

        //purpose of option is to figure out  what kind of request allowed to the server
        //we specifiy the kinds of request using the headers
    if(req.method === 'OPTIONS'){
        res.sendStatus(200) // will send back the options for pre flight requests
    }else {
        next()  // allow the real request to go to the endpoint
    }




}