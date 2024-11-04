const fs = require('fs')
const { google } = require('googleapis')

const GOOGLE_API_FOLDER_ID = '1graDV-yFauZMP-5oqY17hCJKfXtzxv4J';

async function uploadFile(){
    try{
        const { GoogleAuth } = require('google-auth-library');

        const auth = new GoogleAuth({
            credentials: {
                type: "service_account",
                project_id: "captureqrcode",
                private_key_id: "8ba6998d36d5c03fdb572427d370cf9415002004",
                private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCe/51FMNWxNu1o\nW3icZrURkmv6pi4rGUhgEtAbSGp5+5dRhjM3RRWMrEhXibFXPo3REp3y7HA/yPoR\nHNrBLIWPBVFM5xy66cIMV1NJkgkjbT66YO6DH+cGd33+hiVgIM80GG9pVrxaQePC\nZ0+9yJS6EkaaxvFPhDT7j17Zvosh2c6bU05fJ7PKARu3ezj5aAz931Qq+12W4yIF\nOnQVNLbNxJVG5zcuWRva9iiRY+kxfDPe3sfuT4XcrYwQw2uoOfs46qF4vvMQYLlV\nk7/xmTzVUBzymIcMfJL6eNqL58XK+KENgPH6/vGsPHMEiz4AE3IzUAD99ORgjV8K\nOTR4m1bhAgMBAAECggEAAot95/Wy/GmAH5kT9Ukmr5io1znb5CFFH4JKk963A1OA\ny6+IrCM0N/CJnoLR+I78Ci08k2bn2aoC4GVuTgxrWXeG2nK6KsbXPf9Dckpq0HcR\nE46tz6IJ/qBIz0M0d8FDrsJPvXNrq6xJf+77U4rZcFBewl9B/VVM66w68vRUBdVQ\nI0VyS8i4gL4U0wTwBxMXg7Lxg+XXbkcYm11vB0+wCAtpZh99EVXXLF5qd1PzR/UX\nKvn2+1qOi0St5J2BYAZ0TctfTi/EF1yIyQcoLtJ458sxgtUZKje946viyGzTLWjq\nzwRhrA+LclE/jWrR/FbSg1nU69i2kGEBMcETPQ2nQQKBgQDV8TH+uS1FS6i/rcpx\na/yMYfi+QEOyl+Ek0r/+d/1YKwhrCsUXutVcqUIKzXsn2muS+iWfVhXvWGUfhC6o\nedkTKJa/B8bqqphy6nl9iHZj/BJ4xTelAokMd4e9gA5VP4lOQsFQan3c9KDAC5v1\nmosBSNbqSzulF/iXsEeGy2E0wQKBgQC+QVYQDi7kpyBnDngvz9VKjq/EZMMDJxYX\nGzzufvhWKrzZk2aV43q3BVNr6nlfoOfq/9tMKdBSKDD8hv4l9dLZvc+xOHJJe1uP\npAx84X2jivX0KHiErIatHYaPGf5ANCoHW9HlcILo1ldjtSCyKSHDTxMMPJ3jx93Y\nj/FcIgQKIQKBgQDL52vc+KS7DNcyiPMPkvpK2f13ZkyfZL4CmJLAd6AQbkNBsiwS\n59D+1ZrKLPmaDETG+n7tE+EoEzmeBh9qF2fbKK40N7dQZXOS4wMTsAIWXWNFk8Hr\nFTWFmk7XP7tpaHr3CgyxFi4Lb2PeZbIpLTga609aUoXwXZ5jBHHHeQOWgQKBgHnU\nALY7Ps/wLRGQ9Gk5Xs1lXSwXkcC9EKovKO9XotIaf9+bQb+NcREteePKu3n+4UNc\nHyNAS0OwtN2f27KXHTONFifXi2d+dH0ggVaeVgOZgjGckL/0cjD8jSOpc2PNg3Q+\n2cNgLpPGXSNd4tfy+snEIuBdGIW5gFeipN1ocsnBAoGAKk1gNn9fLfK6j76BXPO/\n9TLXqz/ObNpHTN3JJ8mEd8jseTP5JWHNwRi9THyiCjfWnqweln/BXh2Q/qfMg6B2\nDaz4wyLzcnOQJO52UwYdynnHMJQHi6p+A6v3xoQmGIaqYRkvZXqoSRXE7jZTXbzy\nUnKsoXHI+6Myw3peksUSIhc=\n-----END PRIVATE KEY-----\n",
                client_email: "googledrive@captureqrcode.iam.gserviceaccount.com",
                client_id: "108664466355775931513",
                auth_uri: "https://accounts.google.com/o/oauth2/auth",
                token_uri: "https://oauth2.googleapis.com/token",
                auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
                client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/googledrive%40captureqrcode.iam.gserviceaccount.com",
                universe_domain: "googleapis.com"
            },
            scopes: ['https://www.googleapis.com/auth/drive']
        });

        const driveService = google.drive({
            version: 'v3',
            auth
        })

        const fileMetaData = {
            'name': 'titoplace.jpeg',
            'parents': [GOOGLE_API_FOLDER_ID]
        }

        const media = {
            mimeType: 'image/jpeg',
            body: fs.createReadStream('./tito.jpeg')
        }

        const response = await driveService.files.create({
            resource: fileMetaData,
            media: media,
            field: 'id'
        })
        return response.data.id

    }catch(err){
        console.log('Upload file error', err)
    }
}

uploadFile().then(data => {
    console.log(data)
    //https://drive.google.com/uc?export=view&id=
})