
//import { getAllBookings, findUserById, submitNewUser, UpdateExistingUser } from "../daos/SQL/booking-dao-dao";
//import { Users } from "../models/Users";
import { bucketBaseUrl } from "../daos/CloudStorage";
import { Bookings } from "../models/Bookings";
import { getAllBookings, submitNewBooking, updateExistingBooking, findBookingByCustomer, findBookingByBookingId, findBookingByArtistId, getAllShops } from "../daos/SQL/booking-dao";
import { SaveTattooImage } from "../daos/CloudStorage/booking-images";
import { Shop } from "../models/shops";

// this call dao

export async function getAllBookingsService():Promise<Bookings[]>{
    return await getAllBookings()
}

export async function findBookingByCustomerService(userId:number):Promise<Bookings>{
    return await findBookingByCustomer(userId)
}

// will work on in later feel free to comment out this method if you need to 
export async function SubmitNewBookingService(newBooking:Bookings):Promise<Bookings>{
    
    try{
        let base64Image = newBooking.imageTest
        let [dataType, imageBase64Data] = base64Image.split(';base64,')
        let contentType = dataType.split('/').pop()
        if (newBooking.imageTest) {
            newBooking.imageTest = `${bucketBaseUrl}/users/${newBooking.customer}/profile.${contentType}`
        }
        let savedUser =  await submitNewBooking(newBooking)
        await SaveTattooImage(contentType, imageBase64Data, `users/${newBooking.customer}/profile.${contentType}`)
        return savedUser
    }catch (e){
        console.log(e)
        throw e 
    } 
}

export async function UpdateExistingBookingService(booking:Bookings):Promise<Bookings>{
    return await updateExistingBooking(booking)
}

export async function findBookingByBookingIdService(id: number):Promise<Bookings>{
    return await findBookingByBookingId(id)
}

export async function findBookingByArtistIdService(userId:number):Promise<Bookings>{
    return await findBookingByArtistId(userId)
}

export async function getAllShopsService():Promise<Shop[]>{
    return await getAllShops()
}
