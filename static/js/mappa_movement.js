const img = document.getElementById('game-map');
    let scale = 1;
    const scaleFactor = 0.01;
    const minScale = 1;
    const maxScale = 1.55;

    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0;

    img.addEventListener('wheel', (event) => {
        event.preventDefault();

        const rect = img.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;

        const originX = offsetX / img.width * 100;
        const originY = offsetY / img.height * 100;

        img.style.transformOrigin = `${originX}% ${originY}%`;

        if (event.deltaY < 0) {
            scale += scaleFactor;
        } else {
            scale -= scaleFactor;
        }
        scale = Math.min(Math.max(minScale, scale), maxScale); // Limit zoom scale between 1 and 3
        img.style.transform = `scale(${scale})`;
    });

    img.addEventListener('mousedown', (event) => {
        if(scale>1){
            isDragging = true;
            startX = event.clientX;
            startY = event.clientY;
            console.log('startX', startX);
            console.log('startY', startY);
        }
    });

    document.addEventListener('mousemove', (event) => {
        if (isDragging) {

            const dx = ((event.clientX - startX) / scale)*10;
            const dy = ((event.clientY - startY) / scale)*10;
            translateX += dx;
            translateY += dy;

            const rect = img.getBoundingClientRect();
            const containerRect = img.parentElement.getBoundingClientRect();
            const maxTranslateX = (rect.width - containerRect.width) / 2;
            const maxTranslateY = (rect.height - containerRect.height) / 2;

            translateX = Math.min(Math.max(translateX, -maxTranslateX), maxTranslateX);
            translateY = Math.min(Math.max(translateY, -maxTranslateY), maxTranslateY);

            img.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
            isDragging = false;

        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

