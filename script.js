gsap.registerPlugin(ScrollTrigger);

const canvas = document.getElementById("sequence-canvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render(); 
});

const frameCount = 16;
const currentFrame = index => `assets/sequence/frame-${(index + 1).toString().padStart(2, '0')}.webp`;
const images = [];
const sequence = { frame: 0 };

for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
}

images[0].onload = render;

function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    const img = images[sequence.frame];
    
    if (!img || !img.complete) return;

    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const x = (canvas.width / 2) - (img.width / 2) * scale;
    const y = (canvas.height / 2) - (img.height / 2) * scale;

    context.drawImage(img, x, y, img.width * scale, img.height * scale);
}

// Atualizamos apenas o gatilho ("trigger") para apontar para o .hero-scroll
gsap.to(sequence, {
    frame: frameCount - 1,
    snap: "frame",
    ease: "none",
    scrollTrigger: {
        trigger: ".hero-scroll", // Agora a animação acaba quando essa seção acaba
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5
    },
    onUpdate: render
});