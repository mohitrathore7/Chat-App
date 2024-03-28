import { Client,Databases,Account } from 'appwrite';

export const PORJECT_ID = "649c28472e06b3c7e156"
export const DATABASE_ID= "649c29081a419f4dee99"
export const COLLECTION_MSG_ID = "649c2912760a674b1ec4"


const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('649c28472e06b3c7e156');


export const databases = new Databases(client)  
export const account = new Account(client)
    
export default client