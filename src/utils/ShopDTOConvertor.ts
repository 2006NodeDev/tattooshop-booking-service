import { ShopDTO } from "../dtos/shop-dto"
import { Shop } from "../models/shops"


export function ShopDTOtoShopConvertor(sdto:ShopDTO) : Shop{
    return {
        shopId: sdto.shop_id,
        shopName: sdto.shop_name,
        streetAddress: sdto.street_address,
        city: sdto.city,
        state: sdto.state,
        phoneNumber: sdto.phone_number,
        email: sdto.email, 
        openAt: sdto.open_at,
        closeAt: sdto.close_at
    }

}