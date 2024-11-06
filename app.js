require('dotenv').config();
const express = require('express');
const fs = require('fs');
const { google } = require('googleapis');
const multer = require('multer');
const path = require('path');
const { GoogleAuth } = require('google-auth-library');

const app = express();
const PORT = process.env.PORT || 3000;

const GOOGLE_API_FOLDER_ID = process.env.GOOGLE_API_FOLDER_ID;

// Configuração do multer para upload de arquivos
const upload = multer({ dest: 'uploads/' });

// Recuperar as credenciais do ambiente
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

app.use(express.static('public'));

// Função de delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Função de backoff exponencial
async function uploadFileWithBackoff(driveService, fileMetaData, media, retries = 5, delayTime = 1000) {
    let attempt = 0;

    while (attempt < retries) {
        try {
            const response = await driveService.files.create({
                resource: fileMetaData,
                media: media,
                fields: 'id',
            });

            return response;  // Retorna a resposta se o upload for bem-sucedido
        } catch (err) {
            if (err.response && err.response.status === 429) {
                // Exponential backoff
                const backoffTime = delayTime * Math.pow(2, attempt);
                console.log(`Erro 429: Aguardando ${backoffTime / 1000} segundos antes de tentar novamente...`);
                await delay(backoffTime);  // Espera o tempo especificado
                attempt++;
            } else {
                throw err;  // Se não for erro 429, lança o erro
            }
        }
    }

    throw new Error('Número máximo de tentativas excedido');
}

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

        // Usando a função de upload com retry
        const response = await uploadFileWithBackoff(driveService, fileMetaData, media);

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
