import { HttpError } from "./HttpError";

export class ShopNotFound extends HttpError{
    constructor(){
        super(404, 'Shop not found')
    }
}