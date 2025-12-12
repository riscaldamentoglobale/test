// Inizializza AOS per le animazioni al caricamento/scroll semplici
AOS.init({
    duration: 1200,
    once: true, 
    easing: 'ease-out-back',
    // offset: 150, // Parte prima di raggiungere l'elemento
});

// Registra i plugin necessari di GSAP
gsap.registerPlugin(ScrollTrigger);

// -----------------------------------------------------------
// 1. Animazione Iniziale (Hero Section) con GSAP
// -----------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    
    // Configura lo stato iniziale
    gsap.set(["#hero-title", "#hero-subtitle", "#hero-quote", "#cta-button"], { opacity: 0, y: 50 });
    
    // Timeline di animazione
    const tl = gsap.timeline();
    
    tl.to(".hero-overlay", {
        opacity: 0.7,
        duration: 0.5
    })
    .to("#hero-title", {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power4.out"
    }, "+=0.2") 
    .to("#hero-subtitle", {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out"
    }, "<0.3")
    .to("#hero-quote", {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: "power2.out"
    }, "<0.4")
    .to("#cta-button", {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: "elastic.out(1, 0.5)"
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

// Definisci la Timeline Principale per la Sezione Dati
let scrollTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: scrollSection,
        pin: true, 
        start: "top top", 
        end: "+=3500", // Estende la durata dello scroll per l'animazione
        scrub: 1, 
        // markers: true, // DECOMMENTA PER DEBUG
    }
});


// Aggiungi le sequenze di animazione per ogni pannello
panels.forEach((panel, index) => {
    
    // Animazione di Ingresso (Fade-in e Slide)
    scrollTimeline.to(panel, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.inOut",
        onStart: () => {
            // Assicura che solo il pannello corrente sia visibile
            gsap.set(panels, { zIndex: 1 });
            gsap.set(panel, { zIndex: 10 }); 
        }
    })
    
    // Animazioni Grafiche Interne al Pannello
    if (panel.id === 'panel-1') {
        // Grafico Livello del Mare (Altezza sale)
        scrollTimeline.to(panel.querySelector('.water-level'), {
            height: '75%',
            duration: 1.0,
            ease: "power1.inOut"
        }, "<0.2");
    } 
    else if (panel.id === 'panel-2') {
        // Grafico CO2 (L'indicatore ruota)
        scrollTimeline.to(panel.querySelector('.gauge-fill'), {
            opacity: 1,
            rotation: 120, // Rotazione da -135deg a -135 + 120 = -15deg (riempimento)
            duration: 1.0,
            ease: "power2.out"
        }, "<0.2");
    }
    else if (panel.id === 'panel-3') {
        // Grafico Ghiacciaio (La linea d'acqua si abbassa)
        scrollTimeline.to(panel.querySelector('.glacier-top'), {
            top: '80%', // Simula lo scioglimento
            duration: 1.0,
            ease: "power2.out"
        }, "<0.2");
    }
    
    // Mantenimento (Pausa per la lettura)
    scrollTimeline.to(panel, {
        duration: 2.0, 
    })
    
    // Animazione di Uscita (Fade-out)
    .to(panel, {
        opacity: 0,
        y: -50,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
            gsap.set(panel, { y: 50 }); // Reset per la prossima volta
        }
    });

});
