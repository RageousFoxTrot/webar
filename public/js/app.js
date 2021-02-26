window.addEventListener('DOMContentLoaded', () => {
    let file = document.querySelector('input');
    let img  = document.querySelector('img');
    const reader = new FileReader();

    reader.addEventListener('load', () => {
        file.parentNode.removeChild(file);
        img.style.width = '100%';
        // img.style.height = '100vh';
        img.style.margin = 0;
        document.body.style.margin = 0;
        img.src = reader.result;
    }, false);

    file.addEventListener('change', ev => {
        if (file.files[0]) {
            reader.readAsDataURL(file.files[0]);
        }
    });
});