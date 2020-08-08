import { BookingDTO } from "../dtos/book-dto";
import { Bookings } from "../models/Bookings";

//changed function call  DONE
//updates rdtos after updating book dto fields - inside return
//update fields per db fields
//updated model name to bookings DONE

export function BookingDTOtoBookingConvertor(bdto:BookingDTO) : Bookings{
    return {
        bookingId: bdto.booking_id,
        customer: bdto.customer,
        style: bdto.style,
        size: bdto.size,
        location: bdto.location,
        imageTest:bdto.image,
        color: bdto.color,
        artist: bdto.artist,
        shop: bdto.shop,
        date:bdto.date
        //time: bdto.time
    }

}