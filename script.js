gsap.registerPlugin(ScrollTrigger);

// ========================================================
// LENIS - SCROLL FLUIDO (ESTILO TALES RAMIRO)
// ========================================================
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ========================================================
// CONFIGURAÇÃO DO CANVAS E IMAGE SEQUENCE
// ========================================================
const canvas = document.getElementById("horizon-canvas");
const context = canvas.getContext("2d");

// Tamanho original da sua renderização (Altere se necessário)
canvas.width = 1920; 
canvas.height = 1080;

// Quantidade total de imagens geradas
const frameCount = 14; 

// Função que monta o caminho do arquivo baseado no número
// Exemplo: frame-001.webp, frame-002.webp
const currentFrame = index => (
  `sequence/frame-${(index + 1).toString().padStart(3, '0')}.webp`
);

const images = [];
const horizonAnim = {
  frame: 0 // Começamos no frame 0
};

// 1. Fazer o pré-carregamento (Preload) de todas as imagens para a memória
for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
}

// 2. Quando a primeira imagem carregar, já desenha ela na tela
images[0].onload = render;

function render() {
  // Limpa o canvas e desenha o frame atual
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(images[horizonAnim.frame], 0, 0); 
}

// ========================================================
// O MOTOR DO SCROLL (GSAP)
// ========================================================
gsap.to(horizonAnim, {
  frame: frameCount - 1, // Vai do frame 0 até o último
  snap: "frame", // Garante que não desenhe "meio" frame (ex: frame 1.5)
  ease: "none",  // A velocidade segue puramente o dedo do usuário
  scrollTrigger: {
    trigger: "#canvas-container",
    pin: true,     // Fixa o container na tela
    start: "top top",
    // end: "+=300%" significa que o usuário precisa rolar o equivalente a 
    // 3 telas de altura para o vídeo acabar. Aumente se quiser o scroll mais demorado.
    end: "+=300%", 
    scrub: 0.5,    // Suavidade da interligação do scroll (efeito manteiga)
  },
  onUpdate: render // Toda vez que a barra rolar, ele roda a função render()
});