window.addEventListener('DOMContentLoaded', () => {
    let video = document.querySelector('video');
    
    if ('mediaDevices' in navigator) {
        const constraints = {
            audio: false,
            video: {
                width: {
                    min: 720,
                    max: 1440,
                    ideal: 1080
                },
                height: {
                    min: 1280,
                    max: 2560,
                    ideal: 1920
                },
                facingMode: {
                    exact: 'environment'
                }
            }
        };

        navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            video.srcObject = stream;
            video.addEventListener('loadedmetadata', () => video.play());
        })
        .catch(err => video.innerHTML = "<h1>Please use a device with a camera.</h1>");
    } else {
        
    }
});