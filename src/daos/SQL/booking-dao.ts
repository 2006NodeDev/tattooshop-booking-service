import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";
import {BookingDTOtoBookingConvertor } from "../../utils/BookingDTOConvertor";
import { BookingNotFound } from "../../errors/BookingNotFoundError";
import { Bookings } from "../../models/Bookings";
import { BookingInputError } from "../../errors/BookingInputError";
import { findBookingByBookingIdService } from "../../services/booking-service";
import { ArtistNotFound } from "../../errors/ArtistNotFoundError";
import { errorLogger, logger } from "../../utils/logger";
import { Shop } from "../../models/shops";
import { ShopDTOtoShopConvertor } from "../../utils/ShopDTOConvertor";

const schema = process.env['LB_SCHEMA'] || 'tattoobooking_booking_service'
//updated getAllBooking func for booking DONE
//update DB QUERY DONE
//Promise is representation of a future value of an error
export async function getAllBookings():Promise<Bookings[]>{
    let client: PoolClient
    try {
        //:QueryResult 
        client = await connectionPool.connect()

        let getAllBookingResults:QueryResult = await client.query(`select b.booking_id, u1.user_id as customer,b.size,b.location,b.image,b.color,u2.user_id as artist,b.style,s.style_id,b.shop,sh.shop_id,b.date from ${schema}.bookings b 
            left join tattoobooking_user_service.users u1 on b.customer = u1.user_id
            left join ${schema}.styles s on b.style = s.style_id
            left join tattoobooking_user_service.users u2 on b."artist" = u2.user_id
            left join ${schema}.shops sh on b.shop = sh.shop_id;`)

      if(getAllBookingResults.rowCount === 0){

            throw new BookingNotFound();
       }
    else{
            return getAllBookingResults.rows.map(BookingDTOtoBookingConvertor)
           // return getAllReimResults.rows.map(ReimDTOtoReimbursementConvertor)
      }        
    } catch (e) {
        errorLogger.error(e);
        logger.error(e)
        throw new Error('unimplemented error')
    }finally{
        //  && guard operator we are making sure that client is exist then we release
        client && client.release()
    }
}

//It won't give me the customer information, but it does give me everything else. 
export async function findBookingByCustomer(userId:number):Promise<Bookings>{
    let client : PoolClient
    try {
        client = await connectionPool.connect()
        let bookingByUserIdResult: QueryResult = await client.query(`select b.booking_id, u.first_name, u.last_name, 
        u.user_id, b."style", b."size", b."location", b.image, b.color, b.artist, u.first_name, u.last_name, b.shop , b."date"
        from ${schema}.bookings b 
        left join tattoobooking_user_service.users u 
        on b.customer = u.user_id 
        where b.customer = $1 order by b.date;`, [userId])
        if(bookingByUserIdResult.rowCount ===0){
            throw new Error('Booking Not Found')
        }else{
            return BookingDTOtoBookingConvertor(bookingByUserIdResult.rows[0])
        }
    } catch (error) {
        if(error.message === 'Booking Not Found'){
            throw new BookingNotFound();
        }
        errorLogger.error(error)
        logger.error(error)
        throw new Error('unimplemented error handling')
    }finally{
        //  && guard operator we are making sure that client is exist then we release
        client && client.release()
    }
}


//UPDATED FUNC NAME, CALLS AND EXPORTS DONE
//UPDATE QUERY PER DB PENDING DONE
export async function submitNewBooking(newBooking: Bookings):Promise<Bookings>{
    let client: PoolClient
    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;') //start transaction
        //let typeId = await client.query(`select rt.type_id from tattoobooking_booking_service.reimbursement_type rt where rt."type" = $1;`, [newBooking.type])
        let bookTattoostyle = await client.query(`select s.style_id from ${schema}.styles s where s."style" = $1;`, [newBooking.style])

        if(bookTattoostyle.rowCount === 0){
            throw new Error('Type not found')
        }else {
            bookTattoostyle = bookTattoostyle.rows[0].style_id
        }        

        let results = client.query(`insert into ${schema}.bookings("customer", "style", "size", "location", "image", "color", "artist", "shop", "date") values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning bookings_id`,

        [newBooking.customer, newBooking.style, newBooking.size, newBooking.location,newBooking.imageTest, newBooking.color, newBooking.artist,newBooking.shop,newBooking.date, bookTattoostyle ])
       
        newBooking.bookingId = (await results).rows[0].booking_id
        await client.query('COMMIT;')
        return newBooking
    } catch (error) {
        client && client.query('ROLLBACK;')
        if(error.message === 'Style not found'){
            throw new BookingInputError();
        }
        errorLogger.error(error)
        logger.error(error)
        throw new Error('Unimplemented error handling')
    }finally{
        client && client.release();
    }
}

 
//UPDATED FUNC NAME, CALLS AND EXPORTS DONE
//UPDATE QUERY PER DB PENDING
// Update Booking
export async function updateExistingBooking(updateBooking:Bookings): Promise <Bookings> {
    let client: PoolClient
    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;')
        if(updateBooking.customer){
            await client.query(`update ${schema}.bookings  set "customer" = $1 where "booking_id" = $2;`, [updateBooking.customer, updateBooking.bookingId])
        }
        if(updateBooking.style){
            let style_id = await client.query(`select s.style_id from ${schema}.styles s where s.style_id = $1;` , [updateBooking.style])
            if(style_id.rowCount === 0 ){
                throw new Error("Styles Not Found")
            }
            style_id= style_id.rows[0].style_id
            await client.query('update ${schema}.bookings set "style"= $1 where booking_id = $2;' , [style_id, updateBooking.bookingId])
        }    
          
        if(updateBooking.size){
            await client.query(`update ${schema}.bookings  set "size" = $1 where "booking_id" = $2;`, [updateBooking.size, updateBooking.bookingId])
        }
        if(updateBooking.location){
            await client.query(`update ${schema}.bookings  set "location" = $1 where "booking_id" = $2;`, [updateBooking.location, updateBooking.bookingId])
        }
        if(updateBooking.imageTest){
            await client.query(`update ${schema}.bookings  set "imageTest" = $1 where "booking_id" = $2;`, [updateBooking.imageTest, updateBooking.bookingId])
        }if(updateBooking.color){
            await client.query(`update ${schema}.bookings  set "color" = $1 where "booking_id" = $2;`, [updateBooking.color, updateBooking.bookingId])
        }
        // artist 
        if(updateBooking.artist){
            let user_id = await client.query(`select "user_id" from tattoobooking_user_service.users  where "user_id" = $1;` , [updateBooking.artist])
            if(user_id.rowCount === 0 ){
                throw new Error("Artist Not Found")
            }
           user_id=user_id.rows[0].user_id
            await client.query('update ${schema}.bookings set "artist"= $1 where booking_id = $2;' , [user_id, updateBooking.bookingId])
        }

        if(updateBooking.shop){
            let shop_id = await client.query(`select "shop_id" from ${schema}.shops s where "shop_id" = $1;` , [updateBooking.shop])
            if(shop_id.rowCount === 0 ){
                throw new Error("Shop Not Found")
            }
            shop_id= shop_id.rows[0].shop_id
            await client.query('update ${schema}.bookings set "shop"= $1 where booking_id = $2;' , [shop_id, updateBooking.bookingId])
        }
        if(updateBooking.date){
            await client.query(`update ${schema}.bookings  set "date" = $1 where "booking_id" = $2;`, [updateBooking.date, updateBooking.bookingId])
        }
        
        await client.query('COMMIT;') 
        return findBookingByBookingIdService(updateBooking.bookingId)
        
    } catch (error) {
        client && client.query('ROLLBACK;')
        if(error.message === 'Styles Not Found'){
            throw new Error ('Styles Not Found')
        }else if(error.message === 'Artist Not Found'){
            throw new Error ('Artist Not Found')
        }else if(error.message === 'Shop Not Found'){
            throw new Error ('Shop Not Found')
        }else if(error.message ===  'Invalid ID'){
            throw new Error ('Invalid ID')
        }
        errorLogger.error(error)
        logger.error(error)
        throw new Error('Unhandled Error')
    }finally {
        client && client.release()
    }
}

//UPDATED FUNC NAME, CALLS AND EXPORTS DONE
//UPDATE QUERY PER DB PENDING
export async function findBookingByBookingId(id:number):Promise<Bookings>{
    let client: PoolClient;
    try {
        client = await connectionPool.connect()
        let getBookingById:QueryResult = await client.query(`select * from ${schema}.bookings b
		left join tattoobooking_user_service.users u on b.customer = u.user_id  
        where b.booking_id = $1;`, [id])
        
        if(getBookingById.rowCount === 0){
            throw new Error('Booking not found')
        }else{
            // because there will be one object
            return BookingDTOtoBookingConvertor(getBookingById.rows[0])
        }
    } catch (error) {
        if(error.message === 'Booking not found'){
            throw new BookingNotFound()
        }
        errorLogger.error(error)
        logger.error(error)
        throw new Error('Unimplemented error')
    }finally{
        //  && guard operator we are making sure that client is exist then we release
        client && client.release()
    }
}

export async function findBookingByArtistId(userId:number):Promise<Bookings>{
    let client : PoolClient
    try {
        client = await connectionPool.connect()
        //not the best sql code but good enough for now
        let bookingByUserIdResult: QueryResult = await client.query(`select b.booking_id, u.first_name, u.last_name, 
        u.user_id, b."style", b."size", b."location", b.image, 
        b.color, b.artist, b.shop , b."date"
        from ${schema}.bookings b 
        left join tattoobooking_user_service.users u on b.artist = u.user_id
        where b.artist = ${userId};`, [userId])
        if(bookingByUserIdResult.rowCount ===0){
            throw new Error('Booking Not Found')
        }else{
            return BookingDTOtoBookingConvertor(bookingByUserIdResult.rows[0])
        }
    } catch (error) {
        if(error.message === 'Booking Not Found'){
            throw new BookingNotFound();
        }
        errorLogger.error(error)
        logger.error(error)
        throw new Error('unimplemented error handling')
    }finally{
        client && client.release()
    }
}

//the sql statement is not the prettiest, but we can limit what gets seen with the ui
//Might be better in User
export async function findArtistByStyle(id:number) {
    let client: PoolClient;
    try{
        client = await connectionPool.connect()
        let results: QueryResult = await client.query(`select u.user_id, u.username, u.first_name, u.last_name, 
        u.phone_number, u.email, u."role", 
        as1."style", s.style_name 
        from tattoobooking_user_service.users u 
        left join ${schema}.artist_styles as1 on u.user_id = as1.artist
        left join ${schema}.styles s on as1."style" = s.style_id 
        where as1."style" = ${id};` [id])
        if(results.rowCount === 0){
            throw new Error('NotFound')
        }else{
            return BookingDTOtoBookingConvertor(results.rows[0])
        }
    }catch(e){
        if(e.message === 'NotFound'){
            throw new ArtistNotFound()
        }
        errorLogger.error(e)
        logger.error(e)
        throw new Error('Unimplemented error handling')
    }finally{
        client && client.release()
    }
}

//Get all shops
export async function getAllShops():Promise<Shop[]>{
    let client: PoolClient;
    try{
        client = await connectionPool.connect()
        let results:QueryResult = await client.query(`select * 
        from ${schema}.shops`)
        return results.rows.map(ShopDTOtoShopConvertor)
    }catch(e){
        errorLogger.error(e)
        logger.error(e)
        throw new Error('Unimplemented error handling')
    }finally{
        client && client.release()
    }
}
