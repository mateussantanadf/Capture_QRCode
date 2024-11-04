const fs = require('fs')
const { google } = require('googleapis')

const GOOGLE_API_FOLDER_ID = '1graDV-yFauZMP-5oqY17hCJKfXtzxv4J';

async function uploadFile(){
    try{
        const { GoogleAuth } = require('google-auth-library');

        const auth = new GoogleAuth({
            credentials: {
                type: 'service_account',
                project_id: 'captureqrcode',
                private_key_id: process.env.PRIVATE_KEY_ID, // ou `${{ secrets.PRIVATE_KEY_ID }}`
                private_key: process.env.private_key.replace(/\\n/g, '\n'), // formatação correta
                client_email: process.env.client_email,
                client_id: process.env.client_id,
                auth_uri: process.env.auth_uri,
                token_uri: process.env.token_uri,
                auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
                client_x509_cert_url: process.env.client_x509_cert_url,
                universe_domain: process.env.universe_domain
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