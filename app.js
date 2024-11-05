require('dotenv').config();
const express = require('express');
const fs = require('fs');
const { google } = require('googleapis');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const GOOGLE_API_FOLDER_ID = process.env.GOOGLE_API_FOLDER_ID;

// Configuração do multer para upload de arquivos
const upload = multer({ dest: 'uploads/' });

const { GoogleAuth } = require('google-auth-library');

// Recuperar as credenciais do ambiente
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

app.use(express.static('public'));

// Endpoint para upload de arquivos
app.post('/upload', upload.single('file'), async (req, res) => {
    const filePath = path.join(__dirname, req.file.path);
    
    try {
        const auth = new GoogleAuth({
            credentials: credentials,
            scopes: ['https://www.googleapis.com/auth/drive']
        });

        const driveService = google.drive({
            version: 'v3',
            auth
        });

        const fileMetaData = {
            name: req.file.originalname,
            parents: [GOOGLE_API_FOLDER_ID]
        };

        const media = {
            mimeType: req.file.mimetype,
            body: fs.createReadStream(filePath)
        };

        const response = await driveService.files.create({
            resource: fileMetaData,
            media: media,
            fields: 'id'
        });

        fs.unlinkSync(filePath); // Remove o arquivo temporário após o upload
        res.status(200).send(`Arquivo enviado com sucesso: ${response.data.id}`);
    } catch (err) {
        console.log('Upload file error', err);
        res.status(500).send('Erro ao enviar o arquivo.');
    }
});

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './', 'index.html'));
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
