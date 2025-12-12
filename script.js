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
        stagger: 0.15 // Leggermente più lento per massima fluidità
    }, "+=0.2") 
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
// 2. Parallasse e Contatore
// -----------------------------------------------------------

// ... (Il codice Parallasse e Contatore rimane invariato per funzionalità) ...

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
        const redValue = Math.min(255, Math.floor(counter.value * 255 / 1.2));
        const color = `rgb(255, ${255 - redValue}, 0)`;
        tempCounterElement.style.color = color;
    }
});


// -----------------------------------------------------------
// 3. SCROLL-TELLING AVANZATO (Bug Fix)
// -----------------------------------------------------------

const panels = gsap.utils.toArray(".data-panel");
const scrollSection = document.getElementById('dati');

// Definiamo una durata fissa generosa per il pin, per garantire un rilascio smooth
const PIN_DURATION_PX = 4000; 

let scrollTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: scrollSection,
        pin: true, 
        start: "top top", 
        end: `+=${PIN_DURATION_PX}`, // Durata fissa
        scrub: 1, 
        // markers: true, // DECOMMENTA PER DEBUGGING se devi vedere i trigger
    }
});

// Tempo di animazione totale per un ciclo completo di pannello (ingresso + hold + uscita)
const cycleTime = 1.0; 

panels.forEach((panel, index) => {
    
    // Posizione di ingresso del pannello nella timeline (0, 1, 2, 3...)
    const position = index * cycleTime; 

    // 1. Ingresso del pannello (Fade-in e Slide)
    scrollTimeline.to(panel, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.inOut",
        onStart: () => {
            gsap.set(panels, { zIndex: 1 });
            gsap.set(panel, { zIndex: 10 }); 
        }
    }, position); 
    
    // 2. Animazioni Grafiche Interne (Si sovrappongono all'ingresso)
    const graphicPosition = position + 0.3; // 0.3 secondi dopo l'ingresso
    
    if (panel.id === 'panel-1') {
        scrollTimeline.to(panel.querySelector('.water-level'), {
            height: '75%',
            duration: 1.0,
            ease: "power1.inOut"
        }, graphicPosition);
    } 
    else if (panel.id === 'panel-2') {
        scrollTimeline.to(panel.querySelector('.gauge-fill'), {
            opacity: 1,
            rotation: 120, 
            duration: 1.0,
            ease: "power2.out"
        }, graphicPosition);
    }
    else if (panel.id === 'panel-3') {
        scrollTimeline.to(panel.querySelector('.glacier-top'), {
            top: '80%', 
            duration: 1.0,
            ease: "power2.out"
        }, graphicPosition);
    }
    
    // 3. Uscita del pannello (Solo se non è l'ultimo)
    if (index < panels.length - 1) {
        scrollTimeline.to(panel, {
            opacity: 0,
            y: -50,
            duration: 0.5,
            ease: "power2.inOut",
            onComplete: () => {
                gsap.set(panel, { y: 50 });
            }
        }, position + cycleTime - 0.5); // Finisce 0.5s prima che il ciclo finisca
    }
    // L'ultimo pannello (panel-3) rimane visibile fino alla fine della timeline di ScrollTrigger,
    // garantendo una transizione smooth alla sezione #soluzioni quando il pin si rilascia.
});
