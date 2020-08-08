import {HttpError} from './HttpError'

export class BookingNotFound extends HttpError{
    constructor(){
        super(404, 'Booking Not Found')
    }
}