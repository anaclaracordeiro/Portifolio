// ==========================================================
// 1. Rolagem suave ao clicar nos links do menu
// ==========================================================
document.querySelectorAll('.menu a').forEach((link) => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ==========================================================
// 2. Destaca o link do menu correspondente à seção visível
// ==========================================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.menu a');

function highlightNav() {
    let current = '';
    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 150;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove('active');
        if (current && link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightNav);

// ==========================================================
// 3. Botão "Mais informações" — expande/recolhe texto extra
// ==========================================================
const btnMais = document.querySelector('.btn-mais');
const extraInfo = document.querySelector('.extra-info');

if (btnMais && extraInfo) {
    btnMais.addEventListener('click', () => {
        const aberto = extraInfo.classList.toggle('aberto');
        btnMais.textContent = aberto ? 'Mostrar menos' : 'Mais informações';
    });
}

// ==========================================================
// 4. Carrossel de Skills
// ==========================================================
const track = document.querySelector('.carousel-track');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');

if (track && prevBtn && nextBtn) {
    const items = track.querySelectorAll('.skill-item');
    const wrapper = document.querySelector('.carousel-track-wrapper');
    let index = 0;

    function getVisibleCount() {
        const itemWidth = items[0].offsetWidth + 60; // largura + gap
        return Math.max(1, Math.floor(wrapper.offsetWidth / itemWidth));
    }

    function updateCarousel() {
        const itemWidth = items[0].offsetWidth + 60;
        const maxIndex = Math.max(0, items.length - getVisibleCount());
        index = Math.min(index, maxIndex);
        track.style.transform = `translateX(-${index * itemWidth}px)`;

        prevBtn.disabled = index === 0;
        nextBtn.disabled = index >= maxIndex;
    }

    function irParaProximo() {
        const maxIndex = Math.max(0, items.length - getVisibleCount());
        index = index < maxIndex ? index + 1 : 0; // volta ao início
        updateCarousel();
    }

    function irParaAnterior() {
        const maxIndex = Math.max(0, items.length - getVisibleCount());
        index = index > 0 ? index - 1 : maxIndex;
        updateCarousel();
    }

    nextBtn.addEventListener('click', irParaProximo);
    prevBtn.addEventListener('click', irParaAnterior);

    window.addEventListener('resize', updateCarousel);
    updateCarousel();

    // --- Autoplay, pausando ao passar o mouse ---
    let autoplay = setInterval(irParaProximo, 3500);

    wrapper.addEventListener('mouseenter', () => clearInterval(autoplay));
    wrapper.addEventListener('mouseleave', () => {
        autoplay = setInterval(irParaProximo, 3500);
    });

    // --- Arraste / swipe (mouse e toque) ---
    let arrastando = false;
    let posInicial = 0;

    function iniciarArraste(x) {
        arrastando = true;
        posInicial = x;
        clearInterval(autoplay);
        track.style.transition = 'none';
    }

    function finalizarArraste(x) {
        if (!arrastando) return;
        arrastando = false;
        track.style.transition = '';

        const diferenca = posInicial - x;
        if (diferenca > 40) irParaProximo();
        else if (diferenca < -40) irParaAnterior();
        else updateCarousel();

        autoplay = setInterval(irParaProximo, 3500);
    }

    wrapper.addEventListener('mousedown', (e) => iniciarArraste(e.clientX));
    wrapper.addEventListener('mouseup', (e) => finalizarArraste(e.clientX));
    wrapper.addEventListener('mouseleave', () => (arrastando = false));

    wrapper.addEventListener('touchstart', (e) => iniciarArraste(e.touches[0].clientX), { passive: true });
    wrapper.addEventListener('touchend', (e) => finalizarArraste(e.changedTouches[0].clientX));
}

// ==========================================================
// 5. Revelação suave dos blocos ao rolar a página
// ==========================================================
const revealEls = document.querySelectorAll('.reveal');

if (revealEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    revealEls.forEach((el) => observer.observe(el));
} else {
    // fallback: se o navegador não suportar, apenas mostra tudo
    revealEls.forEach((el) => el.classList.add('visible'));
}

// ==========================================================
// 6. Formulário de contato (feedback visual, sem back-end)
// ==========================================================
const form = document.querySelector('.form-contato');
const formMsg = document.querySelector('.form-msg');

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (formMsg) {
            formMsg.textContent = 'Mensagem enviada! Em breve retorno o contato.';
            formMsg.style.display = 'block';
        }

        form.reset();

        setTimeout(() => {
            if (formMsg) formMsg.style.display = 'none';
        }, 4000);
    });
}

// ==========================================================
// 7. Barra de progresso de leitura no topo
// ==========================================================
const progressBar = document.getElementById('progressBar');

if (progressBar) {
    window.addEventListener('scroll', () => {
        const alturaTotal = document.documentElement.scrollHeight - window.innerHeight;
        const progresso = alturaTotal > 0 ? (window.scrollY / alturaTotal) * 100 : 0;
        progressBar.style.width = `${progresso}%`;
    });
}

// ==========================================================
// 8. Brilho roxo seguindo o cursor (só na área do banner)
// ==========================================================
const cursorGlow = document.getElementById('cursorGlow');
const bannerEl = document.getElementById('banner');

if (cursorGlow && bannerEl) {
    bannerEl.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
        cursorGlow.classList.add('ativo');
    });

    bannerEl.addEventListener('mouseleave', () => {
        cursorGlow.classList.remove('ativo');
    });
}

// ==========================================================
// 9. Efeito de digitação no subtítulo do banner
// ==========================================================
const typedTextEl = document.getElementById('typedText');

if (typedTextEl) {
    const texto = 'Desenvolvedora Full-Stack em formação';
    let i = 0;

    function digitar() {
        if (i <= texto.length) {
            typedTextEl.textContent = texto.slice(0, i);
            i++;
            setTimeout(digitar, 55);
        }
    }

    digitar();
}

// ==========================================================
// 10. Tilt 3D nas imagens de projeto ao passar o mouse
// ==========================================================
document.querySelectorAll('.tilt').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centroX = rect.width / 2;
        const centroY = rect.height / 2;

        const rotX = ((y - centroY) / centroY) * -8;
        const rotY = ((x - centroX) / centroX) * 8;

        el.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
    });

    el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
    });
});

// ==========================================================
// 11. Efeito ripple (ondulação) ao clicar nos botões
// ==========================================================
document.querySelectorAll('.ripple-btn').forEach((btn) => {
    btn.addEventListener('click', function (e) {
        const rect = btn.getBoundingClientRect();
        const tamanho = Math.max(rect.width, rect.height);

        const onda = document.createElement('span');
        onda.className = 'ripple';
        onda.style.width = onda.style.height = `${tamanho}px`;
        onda.style.left = `${e.clientX - rect.left - tamanho / 2}px`;
        onda.style.top = `${e.clientY - rect.top - tamanho / 2}px`;

        btn.appendChild(onda);
        setTimeout(() => onda.remove(), 600);
    });
});