import {Storage} from '@google-cloud/storage'

// bucket name
export const bucketName = 'tattoo_shop_bucket'


// http pat for the bucket and image /{}
export const bucketBaseUrl = `https://storage.googleapis.com/${bucketName}`   // url of the image 

export const imageBucket = new Storage().bucket(bucketName)



//this is where we set up the cloud storage 