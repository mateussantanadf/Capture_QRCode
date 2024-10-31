// const video = document.getElementById('video');
// const canvas = document.getElementById('canvas');
// const photo = document.getElementById('photo');
// const snapButton = document.getElementById('snap');
// const startRecordingButton = document.getElementById('startRecording');
// const stopRecordingButton = document.getElementById('stopRecording');
// const recordedVideo = document.getElementById('recordedVideo');
// const uploadButton = document.getElementById('uploadButton');

// navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//     .then(stream => {
//         video.srcObject = stream;
//         let mediaRecorder;
//         let recordedChunks = [];

//         startRecordingButton.onclick = () => {
//             recordedChunks = [];
//             mediaRecorder = new MediaRecorder(stream);
//             mediaRecorder.ondataavailable = event => {
//                 if (event.data.size > 0) {
//                     recordedChunks.push(event.data);
//                 }
//             };
//             mediaRecorder.onstop = () => {
//                 const blob = new Blob(recordedChunks, { type: 'video/webm' });
//                 const url = URL.createObjectURL(blob);
//                 recordedVideo.src = url;
//                 recordedVideo.style.display = 'block';
//                 uploadButton.style.display = 'block'; // Mostrar botão de upload
//                 recordedVideo.blob = blob; // Armazenar o blob para upload
//             };
//             mediaRecorder.start();
//             startRecordingButton.disabled = true;
//             stopRecordingButton.disabled = false;
//         };

//         stopRecordingButton.onclick = () => {
//             mediaRecorder.stop();
//             startRecordingButton.disabled = false;
//             stopRecordingButton.disabled = true;
//         };
//     })
//     .catch(err => {
//         console.error("Erro ao acessar a câmera: " + err);
//     });

// snapButton.addEventListener('click', () => {
//     const context = canvas.getContext('2d');
//     context.drawImage(video, 0, 0, canvas.width, canvas.height);
//     photo.src = canvas.toDataURL('image/png');
//     uploadButton.style.display = 'block'; // Mostrar botão de upload
// });

// // Função para autenticação
// function authenticate() {
//     return gapi.auth2.getAuthInstance()
//         .signIn({ scope: 'https://www.googleapis.com/auth/drive.file' })
//         .then(() => console.log("Conectado ao Google Drive!"),
//               (err) => console.error("Erro de autenticação: " + err));
// }

// // Função para enviar arquivo
// function uploadFile(file) {
//     const metadata = {
//         'name': file.name,
//         'mimeType': file.type,
//     };

//     const accessToken = gapi.auth.getToken().access_token;
//     const form = new FormData();
//     form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
//     form.append('file', file);

//     fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
//         method: 'POST',
//         headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
//         body: form,
//     }).then(response => response.json())
//       .then(file => console.log("Arquivo enviado: ", file));
// }

// // Adicionando o evento de upload
// uploadButton.addEventListener('click', () => {
//     const fileBlob = recordedVideo.blob || dataURLtoBlob(photo.src); // Obter blob do vídeo ou da foto
//     uploadFile(new Blob([fileBlob], { type: recordedVideo.blob ? 'video/webm' : 'image/png' }));
// });

// // Converte data URL para Blob
// function dataURLtoBlob(dataURL) {
//     const byteString = atob(dataURL.split(',')[1]);
//     const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
//     const ab = new Uint8Array(byteString.length);
//     for (let i = 0; i < byteString.length; i++) {
//         ab[i] = byteString.charCodeAt(i);
//     }
//     return new Blob([ab], { type: mimeString });
// }

// // Inicializa a API do Google Drive
// function handleClientLoad() {
//     gapi.load('client:auth2', () => {
//         gapi.auth2.init({
//             client_id: '294110654965-5kf1vog63kktsmhd607i87f3i7tbv113.apps.googleusercontent.com', // Substitua pela sua Client ID
//             scope: 'https://www.googleapis.com/auth/drive.file'
//         });
//     });
// }
