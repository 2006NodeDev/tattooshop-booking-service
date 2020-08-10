FROM  node:12.18-stretch

#copy files for the app
# copy node modules
#deal with env vars
#copy in the service account key for GCP



COPY build  tattooshop-booking-service/build/
COPY node_modules tattooshop-booking-service/node_modules/

#this is the command that starts our application
  
CMD npm run deploy --prefix tattooshop-booking-service/build
# FROM and CMD that we need to put in docker file 
