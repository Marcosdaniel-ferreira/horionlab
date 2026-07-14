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
// Lembre-se do caminho correto que ajustamos antes
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

// 2. Scroll-Bound Animation para o Canvas
gsap.to(sequence, {
    frame: frameCount - 1,
    snap: "frame",
    ease: "none",
    scrollTrigger: {
        trigger: ".hero-scroll",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5
    },
    onUpdate: render
});

// --------------------------------------------------------
// 3. FADE-IN E BLUR PARA OS TEXTOS (Tipografia Dinâmica)
// --------------------------------------------------------
const fadeElements = gsap.utils.toArray('.fade-blur');

fadeElements.forEach(el => {
    gsap.fromTo(el, 
        // Estado Inicial (Invisível, levemente para baixo e com Blur)
        { 
            opacity: 0, 
            y: 40, 
            filter: "blur(15px)" 
        }, 
        // Estado Final (Visível, no lugar certo e focado)
        {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%", // Dispara quando o elemento atinge 85% da altura da tela
                toggleActions: "play none none reverse" // Volta o desfoque se o usuário rolar para cima de novo
            }
        }
    );
});