// Registra i plugin necessari di GSAP
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Inizializza AOS
AOS.init({
    duration: 1500, // Durata più lunga per un effetto più cinematico
    once: true, 
    easing: 'power3.out',
});

// -----------------------------------------------------------
// 1. Animazione Titolo Hero "Glitch/Cinematic"
// -----------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    
    // Configura lo stato iniziale
    gsap.set(["#hero-title", "#hero-subtitle", "#hero-quote", "#cta-button"], { opacity: 0, y: 50 });
    
    // Timeline Principale
    const tl = gsap.timeline();
    
    // A. Ingresso drammatico e glitch
    tl.to(".hero-overlay", { opacity: 0.95, duration: 0.5 })
      .to("#hero-title", {
            opacity: 1,
            y: 0,
            duration: 0.1, // Ingresso rapido
            ease: "none"
        }, "+=0.2")
        // Applicazione di un effetto glitch temporaneo sul titolo
        .to("#hero-title", {
            duration: 0.5,
            textShadow: "0 0 50px #ff5252, 0 0 20px #00e5ff",
            letterSpacing: 15,
            y: "-=5",
            ease: "steps(1)", // Simula il glitch
            repeat: 1, 
            yoyo: true,
        })
        .to("#hero-title", {
            duration: 0.5,
            textShadow: "0 0 20px var(--primary-color)",
            letterSpacing: 10,
            y: 0,
            ease: "power2.out",
        }, "<0.5") // Ritorna alla normalità
        
        // B. Ingresso smooth degli altri elementi
        .to("#hero-subtitle", {
            opacity: 1,
            y: 0,
            duration: 1.0,
            ease: "power2.out"
        }, "<0.4")
        .to("#hero-quote", {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
        }, "<0.4")
        .to("#cta-button", {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "back.out(1.7)"
        }, "<0.3");
});

// -----------------------------------------------------------
// 2. Parallasse e Contatore (Dinamico e Visivo)
// -----------------------------------------------------------

// Parallasse del contenuto Hero e Video
gsap.to(".hero-content", { yPercent: 25, ease: "none", scrollTrigger: { trigger: "body", start: "top top", end: "bottom top", scrub: true } });
gsap.to("#background-video", { scale: 1.15, ease: "none", scrollTrigger: { trigger: "body", start: "top top", end: "bottom top", scrub: true } });

// Contatore Numerico Animato con Glow Indicator
const counter = { value: 0 };
const finalValue = 1.2;
const tempCounterElement = document.getElementById('temp-counter');
const glowIndicator = document.querySelector('.glow-indicator');

gsap.to(counter, {
    value: finalValue,
    duration: 3.5,
    scrollTrigger: {
        trigger: ".stat-box",
        start: "top 80%",
        toggleActions: "play none none none",
    },
    onUpdate: () => {
        const currentValue = counter.value;
        tempCounterElement.textContent = currentValue.toFixed(1) + '°C';
        
        // Calcolo del colore e della scala del glow (più caldo = più rosso e grande)
        const intensity = currentValue / finalValue;
        const redValue = Math.min(255, Math.floor(intensity * 255));
        
        const color = `rgb(255, ${255 - redValue}, 0)`;
        tempCounterElement.style.color = color;
        
        // Animazione del glow in base all'intensità
        gsap.to(glowIndicator, {
            scale: 1 + intensity * 0.5, // Si ingrandisce fino al 50%
            backgroundColor: color,
            x: intensity * 100, // Spostamento laterale per effetto dinamico
            duration: 0.1,
            ease: "none"
        });
    }
});


// -----------------------------------------------------------
// 3. SCROLL-TELLING AVANZATO (Parallasse 3D e Bug Fix)
// -----------------------------------------------------------

const panels = gsap.utils.toArray(".data-panel");
const scrollSection = document.getElementById('dati');

// Durata del PIN: 4000px è una buona misura per 3-4 pannelli su schermi standard
const PIN_DURATION_PX = 4000; 
const cycleTime = 1.0; 

let scrollTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: scrollSection,
        pin: true, 
        start: "top top", 
        end: `+=${PIN_DURATION_PX}`, 
        scrub: 1, 
    }
});

panels.forEach((panel, index) => {
    
    const position = index * cycleTime; 

    // A. Ingresso del pannello (Fade-in, Slide e leggero Zoom)
    scrollTimeline.to(panel, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: "power2.inOut",
        onStart: () => {
            gsap.set(panels, { zIndex: 1, scale: 0.95, y: 50 }); // Stato iniziale
            gsap.set(panel, { zIndex: 10, pointerEvents: 'auto' }); 
        }
    }, position); 
    
    // B. Animazioni Grafiche Interne (Parallasse dinamico)
    const graphicPosition = position + 0.3; 
    
    const visual = panel.querySelector('.data-visual');
    const parallaxSpeed = parseFloat(visual.getAttribute('data-parallax-speed')) || 0;
    
    // Animazione di parallasse 3D sul pannello
    scrollTimeline.to(panel, {
        x: 100 * parallaxSpeed, // Spostamento orizzontale
        rotationY: 10 * parallaxSpeed, // Rotazione 3D
        duration: cycleTime - 0.5, // Durata per il mantenimento
        ease: "none"
    }, position);

    // Animazioni interne specifiche
    if (panel.id === 'panel-1') {
        scrollTimeline.to(panel.querySelector('.water-level'), { height: '75%', duration: 1.0, ease: "power1.inOut" }, graphicPosition);
    } 
    else if (panel.id === 'panel-2') {
        scrollTimeline.to(panel.querySelector('.gauge-fill'), { opacity: 1, rotation: 120, duration: 1.0, ease: "power2.out" }, graphicPosition);
    }
    else if (panel.id === 'panel-3') {
        scrollTimeline.to(panel.querySelector('.glacier-top'), { top: '80%', duration: 1.0, ease: "power2.out" }, graphicPosition);
        scrollTimeline.to(panel.querySelector('.glacier-crack'), { opacity: 1, duration: 0.5, ease: "power1.out" }, graphicPosition + 0.5);
    }
    
    // C. Uscita del pannello
    if (index < panels.length - 1) {
        scrollTimeline.to(panel, {
            opacity: 0,
            y: -50,
            scale: 0.9,
            duration: 0.5,
            ease: "power2.inOut",
            onComplete: () => {
                gsap.set(panel, { y: 50, pointerEvents: 'none' });
            }
        }, position + cycleTime - 0.5); 
    }
});
