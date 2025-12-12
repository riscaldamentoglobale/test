// Inizializza AOS per le animazioni al caricamento/scroll semplici
AOS.init({
    duration: 1200,
    once: true, 
    easing: 'ease-out-back',
});

// Registra i plugin necessari di GSAP
gsap.registerPlugin(ScrollTrigger);

// -----------------------------------------------------------
// 1. Animazione Titolo Hero "Smooth" (Split-Text Simulation)
// -----------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    
    const title = document.getElementById('hero-title');

    // Suddivide il titolo in span per animare ogni parola separatamente
    const titleWords = title.textContent.split(' ');
    title.innerHTML = titleWords.map(word => `<span class="word-split">${word}</span>`).join(' ');

    // Configura lo stato iniziale di tutti gli elementi
    gsap.set(".word-split", { opacity: 0, y: 30 });
    gsap.set(["#hero-subtitle", "#hero-quote", "#cta-button"], { opacity: 0, y: 50 });
    
    // Timeline di animazione
    const tl = gsap.timeline();
    
    tl.to(".hero-overlay", {
        opacity: 0.75,
        duration: 0.5
    })
    // Animazione di ingresso "Smooth" per le parole
    .to(".word-split", {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.1 // Ritardo progressivo tra le parole per l'effetto smooth
    }, "+=0.2") 
    .to("#hero-subtitle", {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: "power2.out"
    }, "<0.4") // Si sovrappone leggermente alla fine del titolo
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
// 2. Parallasse e Contatore (Sezione Impatto)
// -----------------------------------------------------------

// Aggiungi un leggero parallasse al contenuto dell'header e zoom al video
gsap.to(".hero-content", {
    yPercent: 25, 
    ease: "none",
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom top",
        scrub: true 
    }
});

gsap.to("#background-video", {
    scale: 1.15,
    ease: "none",
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});


// Contatore Numerico Animato con ScrollTrigger
const counter = { value: 0 };
const finalValue = 1.2;
const tempCounterElement = document.getElementById('temp-counter');

gsap.to(counter, {
    value: finalValue,
    duration: 3.5,
    scrollTrigger: {
        trigger: ".stat-box",
        start: "top 80%",
        toggleActions: "play none none none",
    },
    onUpdate: () => {
        tempCounterElement.textContent = counter.value.toFixed(1) + '°C';
        // Effetto Colore: diventa Rosso man mano che si avvicina a 1.2°C
        const redValue = Math.min(255, Math.floor(counter.value * 255 / 1.2));
        const color = `rgb(255, ${255 - redValue}, 0)`;
        tempCounterElement.style.color = color;
    }
});


// -----------------------------------------------------------
// 3. SCROLL-TELLING AVANZATO (Sezione Dati)
// -----------------------------------------------------------

const panels = gsap.utils.toArray(".data-panel");
const scrollSection = document.getElementById('dati');

// Definiamo la durata dello scroll necessaria per scorrere tra un pannello e l'altro
const panelScrollLength = 1000; 

// Definisci la Timeline Principale per la Sezione Dati
let scrollTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: scrollSection,
        pin: true, 
        start: "top top", 
        // L'end è calcolato sulla base del numero di pannelli per la massima fluidità
        end: `+=${panels.length * panelScrollLength}`, 
        scrub: 1, 
        // markers: true, // DECOMMENTA PER DEBUGGING
    }
});


// Aggiungi le sequenze di animazione per ogni pannello
panels.forEach((panel, index) => {
    
    const panelStart = index * panelScrollLength;

    // Animazione di Ingresso (Fade-in e Slide)
    scrollTimeline.to(panel, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.inOut",
        onStart: () => {
            gsap.set(panels, { zIndex: 1 });
            gsap.set(panel, { zIndex: 10 }); 
        }
    }, panelStart / panelScrollLength) 
    
    // Animazioni Grafiche Interne al Pannello
    const timelinePosition = panelStart / panelScrollLength + 0.5; // Inizia 0.5s dopo l'ingresso
    
    if (panel.id === 'panel-1') {
        // Grafico Livello del Mare (Altezza sale)
        scrollTimeline.to(panel.querySelector('.water-level'), {
            height: '75%',
            duration: 1.0,
            ease: "power1.inOut"
        }, timelinePosition);
    } 
    else if (panel.id === 'panel-2') {
        // Grafico CO2 (L'indicatore ruota)
        scrollTimeline.to(panel.querySelector('.gauge-fill'), {
            opacity: 1,
            rotation: 120, 
            duration: 1.0,
            ease: "power2.out"
        }, timelinePosition);
    }
    else if (panel.id === 'panel-3') {
        // Grafico Ghiacciaio (La linea d'acqua si abbassa)
        scrollTimeline.to(panel.querySelector('.glacier-top'), {
            top: '80%', 
            duration: 1.0,
            ease: "power2.out"
        }, timelinePosition);
    }
    
    // Animazione di Uscita (Fade-out e Slide-up)
    if (index < panels.length - 1) {
        scrollTimeline.to(panel, {
            opacity: 0,
            y: -50,
            duration: 0.5,
            ease: "power2.inOut",
            onComplete: () => {
                gsap.set(panel, { y: 50 });
            }
        }, panelStart / panelScrollLength + 1.5); // 1.5 secondi dopo l'ingresso
    }
});
