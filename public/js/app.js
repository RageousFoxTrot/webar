window.addEventListener('DOMContentLoaded', () => {
    let video = document.querySelector('video');
    
    if ('mediaDevices' in navigator) {
        navigator.mediaDevices.getUserMedia({ audio: false, video: { width: 720, height: 1080 } })
        .then(stream => {
            video.srcObject = stream;
            video.addEventListener('loadedmetadata', () => video.play());
        })
        .catch(err => document.write(err));
    } else {
        
    }
});