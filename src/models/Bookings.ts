//changed class name DONE
//Update field names per db 
export class Bookings {
   bookingId: number // booking_id serial primary key
    customer: number // int references tattoobooking_user_service.users("user_id")
    style: number // int references styles ("style_id")
    size: string// text
    location: string 
    imageTest: string // FIGURE THIS OUT
    color: boolean // 	color BOOLEAN
    artist: number // 	artist int references tattoobooking_user_service.users ("user_id"),
    shop: number // 	shop int references shops ("shop_id"),
    date: Date //	"date" date,
    //time: string //	"time" time
}


