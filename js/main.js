const GITHUB_USERNAME = 'braiidev';

const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const menuIcon = document.getElementById('menuIcon');
const mobileLinks = document.querySelectorAll('.mobile-link');
let isMenuOpen = false;

function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    mobileMenu.classList.toggle('active', isMenuOpen);
    menuIcon.textContent = isMenuOpen ? '✕' : '☰';
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
}

menuBtn.addEventListener('click', toggleMenu);

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (isMenuOpen) toggleMenu();
    });
});

mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu && isMenuOpen) {
        toggleMenu();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) {
        toggleMenu();
    }
});

document.addEventListener('mousemove', (e) => {
    document.documentElement.style.setProperty('--x', e.clientX + 'px');
    document.documentElement.style.setProperty('--y', e.clientY + 'px');
});

const phrases = [
    "Construyo aplicaciones web con Python y Flask.",
    "Backend robusto, frontend moderno.",
    "Disponible para tu próximo proyecto."
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterElement = document.getElementById('typewriter');

function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let typeSpeed = isDeleting ? 50 : 100;
    
    if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
    }
    
    setTimeout(typeEffect, typeSpeed);
}

setTimeout(typeEffect, 800);

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

async function fetchRepos() {
    const container = document.getElementById('repos-container');
    
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);
        
        if (!response.ok) throw new Error('Error al cargar');
        
        const repos = await response.json();
        const filteredRepos = repos.filter(repo => !repo.fork).slice(0, 6);
        
        if (filteredRepos.length === 0) {
            container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No hay repositorios públicos para mostrar</div>';
            return;
        }
        
        const langColors = {
            JavaScript: '#f1e05a',
            TypeScript: '#3178c6',
            Python: '#3572A5',
            HTML: '#e34c26',
            CSS: '#563d7c',
            Java: '#b07219',
            Go: '#00ADD8',
            Rust: '#dea584',
            'C++': '#f34b7d',
            C: '#555555',
            Shell: '#89e051',
            default: '#58a6ff'
        };
        
        container.innerHTML = filteredRepos.map(repo => {
            const lang = repo.language || 'Documentación';
            const color = langColors[lang] || langColors.default;
            const stars = repo.stargazers_count > 0 ? `<i class="fas fa-star"></i> ${repo.stargazers_count}` : '';
            const forks = repo.forks_count > 0 ? `<i class="fas fa-code-branch"></i> ${repo.forks_count}` : '';
            const page = repo.homepage || ''
            return `
                <article title="Go to repo" class="repo-card reveal" onclick="window.open('${repo.html_url}', '_blank')">
                    <div class="repo-icon"><i class="fas fa-folder-open"></i></div>
                    <h3 class="repo-name">${repo.name}</h3>
                    <p class="repo-desc">${repo.description || 'Sin descripción disponible'}</p>
                    <div class="repo-meta">
                        <span>
                            <span class="lang-color" style="background-color: ${color}"></span>
                            ${lang}
                        </span>
                        ${stars ? `<span>${stars}</span>` : ''}
                        ${forks ? `<span>${forks}</span>` : ''}
                        ${page? `<span><a href="${page}" target="_blank">Visit Page</a></span>` : ''}
                    </div>
                </article>
            `;
        }).join('');
        
        document.querySelectorAll('.repo-card.reveal').forEach(el => observer.observe(el));
        
    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = `
            <div class="repo-card reveal" style="grid-column: 1/-1; text-align: center;">
                <div class="repo-icon"><i class="fas fa-exclamation-triangle"></i></div>
                <h3 class="repo-name">No se pudieron cargar los repositorios</h3>
                <p class="repo-desc">Puedes ver mis proyectos directamente en GitHub</p>
                <div class="repo-meta">
                    <span><i class="fas fa-arrow-right"></i> <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" style="color: var(--accent); text-decoration: none;">github.com/${GITHUB_USERNAME}</a></span>
                </div>
            </div>
        `;
    }
}

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

document.getElementById('year').textContent = new Date().getFullYear();

fetchRepos();
