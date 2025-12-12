// Puoi usare JavaScript per animare l'header all'inizio
window.addEventListener('load', () => {
    const heroContent = document.querySelector('.hero-content');
    heroContent.style.opacity = 0;
    
    // Animazione di dissolvenza (Fade-in)
    setTimeout(() => {
        heroContent.style.transition = 'opacity 2s ease-in';
        heroContent.style.opacity = 1;
    }, 500);
});

// Per un effetto di "scroll" che cambia il colore di sfondo (più avanti)
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        // Aggiungi una classe 'visible' per attivare animazioni CSS/JS all'entrata
        if (rect.top < window.innerHeight - 100 && rect.bottom > 100) {
            section.classList.add('is-visible');
        } else {
            section.classList.remove('is-visible');
        }
    });
});
