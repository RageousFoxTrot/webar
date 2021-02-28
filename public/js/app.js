window.addEventListener('DOMContentLoaded', () => {
    let video = document.querySelector('video');
    
    if ('mediaDevices' in navigator) {
        navigator.mediaDevices.getUserMedia({ audio: false })
        .then(stream => {
            video.srcObject = stream;
            video.addEventListener('loadedmetadata', () => video.play());
        })
        .catch(err => document.write(err));
    } else {
        
    }
});