import { HttpError } from "./HttpError";

//DONE UPDATING TO BOOKING DONE
export class BookingInputError extends HttpError {
    constructor(){//has no params
        super(400, 'Please fill out all necessary fields')
    }
}