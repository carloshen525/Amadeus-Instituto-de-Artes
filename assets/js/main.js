/**
 * Amadeus Instituto de Artes - Landing Page Premium (One-Page)
 * São João da Boa Vista - SP
 * WhatsApp Oficial: (19) 3366-6484
 */

document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP_NUMBER = '551933666484';
  const MAX_SELECTION = 10;
  const selectedCourses = new Set();

  // --- ROLAGEM SUAVE PARA ÂNCORAS ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId || targetId.startsWith('#tab-')) return;
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // --- ABAS DE TODAS AS AULAS POR CATEGORIA ---
  const tabButtons = document.querySelectorAll('.category-tab-btn');
  const tabPanes = document.querySelectorAll('.category-tab-pane');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetSelector = button.getAttribute('data-tab-target');
      if (!targetSelector) return;

      tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      tabPanes.forEach(pane => {
        pane.classList.remove('active');
      });

      const targetPane = document.querySelector(targetSelector);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // --- ELEMENTOS DO MODAL & BARRA FLUTUANTE ---
  const modal = document.getElementById('modal-agendamento');
  const modalClose = document.getElementById('modal-close');
  const modalTagsList = document.getElementById('modal-tags-list');
  const tagsCount = document.getElementById('tags-count');
  const form = document.getElementById('agendamento-form');
  const formNome = document.getElementById('form-nome');
  const formNascimento = document.getElementById('form-nascimento');
  const formInteresse = document.getElementById('form-interesse');

  const selectionBar = document.getElementById('selection-bar');
  const barCount = document.getElementById('bar-count');
  const btnClearSelection = document.getElementById('btn-clear-selection');
  const btnOpenModal = document.getElementById('btn-open-modal');

  // --- MÁSCARA AUTOMÁTICA DE DATA (DD/MM/AAAA) ---
  if (formNascimento) {
    formNascimento.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 8) value = value.slice(0, 8);
      if (value.length > 4) {
        value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
      } else if (value.length > 2) {
        value = `${value.slice(0, 2)}/${value.slice(2)}`;
      }
      e.target.value = value;
    });
  }

  // --- ATUALIZAR INTERFACE DE SELEÇÃO ---
  function updateUI() {
    const count = selectedCourses.size;

    // Atualiza tags no modal
    if (tagsCount) tagsCount.textContent = count;
    if (modalTagsList) {
      if (count === 0) {
        modalTagsList.innerHTML = '<span class="modal-empty-notice">Nenhuma aula selecionada ainda. Clique nas aulas do catálogo ou digite seu interesse abaixo.</span>';
      } else {
        modalTagsList.innerHTML = '';
        selectedCourses.forEach(course => {
          const tag = document.createElement('div');
          tag.className = 'selected-tag';
          tag.innerHTML = `
            <span>${course}</span>
            <button type="button" class="tag-remove" aria-label="Remover ${course}" data-remove="${course}">✕</button>
          `;
          modalTagsList.appendChild(tag);
        });

        // Eventos nos botões de remover das tags
        modalTagsList.querySelectorAll('.tag-remove').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const courseToRemove = btn.getAttribute('data-remove');
            toggleCourse(courseToRemove);
          });
        });
      }
    }

    // Atualiza barra flutuante
    if (barCount) barCount.textContent = count;
    if (selectionBar) {
      if (count > 0) {
        selectionBar.classList.add('active');
        document.body.classList.add('has-selection');
      } else {
        selectionBar.classList.remove('active');
        document.body.classList.remove('has-selection');
      }
    }

    // Atualiza cards no catálogo de Todas as Aulas
    document.querySelectorAll('.music-item-card').forEach(card => {
      const courseName = card.getAttribute('data-course-cta') || card.querySelector('span:last-child')?.textContent?.trim();
      const bullet = card.querySelector('.music-bullet');
      if (selectedCourses.has(courseName)) {
        card.classList.add('selected');
        if (bullet) bullet.textContent = '✓';
      } else {
        card.classList.remove('selected');
        if (bullet) bullet.textContent = '✦';
      }
    });

    // Atualiza botões nos Cursos em Destaque
    document.querySelectorAll('.btn-card-gold').forEach(btn => {
      const courseName = btn.getAttribute('data-course-cta');
      if (selectedCourses.has(courseName)) {
        btn.classList.add('selected');
        btn.textContent = '✓ SELECIONADO';
      } else {
        btn.classList.remove('selected');
        btn.textContent = 'AGENDAR AULA EXPERIMENTAL';
      }
    });
  }

  // --- SELECIONAR / DESSELECIONAR AULA ---
  function toggleCourse(courseName) {
    if (!courseName) return;
    if (selectedCourses.has(courseName)) {
      selectedCourses.delete(courseName);
    } else {
      if (selectedCourses.size >= MAX_SELECTION) {
        alert(`Você pode selecionar até ${MAX_SELECTION} aulas experimentais por agendamento.`);
        return;
      }
      selectedCourses.add(courseName);
    }
    updateUI();
  }

  // --- CLIQUE NOS CARDS DO CATÁLOGO ---
  document.querySelectorAll('.music-item-card').forEach(card => {
    card.addEventListener('click', () => {
      const courseName = card.getAttribute('data-course-cta') || card.querySelector('span:last-child')?.textContent?.trim();
      toggleCourse(courseName);
    });
  });

  // --- CLIQUE NOS BOTÕES DOS CURSOS EM DESTAQUE ---
  document.querySelectorAll('.btn-card-gold').forEach(btn => {
    btn.addEventListener('click', () => {
      const courseName = btn.getAttribute('data-course-cta');
      if (!selectedCourses.has(courseName)) {
        toggleCourse(courseName);
      }
      openModal();
    });
  });

  // --- LIMPAR SELEÇÃO ---
  if (btnClearSelection) {
    btnClearSelection.addEventListener('click', () => {
      selectedCourses.clear();
      updateUI();
    });
  }

  // --- MODAL: ABRIR / FECHAR ---
  function openModal(defaultCourse) {
    if (defaultCourse && !selectedCourses.has(defaultCourse) && selectedCourses.size < MAX_SELECTION) {
      selectedCourses.add(defaultCourse);
    }
    updateUI();
    if (modal) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        if (formNome) formNome.focus();
      }, 100);
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  if (btnOpenModal) {
    btnOpenModal.addEventListener('click', () => openModal());
  }

  // --- BOTÕES GERAIS DE AGENDAMENTO (ABREM O FORMULÁRIO) ---
  document.querySelectorAll('.tab-pane-cta a, .category-art-block button, .hero-actions-clean a:not(.btn-secondary), .cta-final-section a, .footer-brand a').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Links de ancoragem interna (ex: #cursos-destaque) navegam pela página e não abrem modal
      const href = btn.getAttribute('href');
      if (btn.classList.contains('btn-secondary') || (href && href.startsWith('#'))) {
        return;
      }
      e.preventDefault();
      const courseAttr = btn.getAttribute('data-course-cta');
      openModal(courseAttr);
    });
  });

  // --- SUBMISSÃO DO FORMULÁRIO PARA WHATSAPP ---
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nome = formNome ? formNome.value.trim() : '';
      const nascimento = formNascimento ? formNascimento.value.trim() : '';
      const interesse = formInteresse ? formInteresse.value.trim() : '';

      if (!nome) {
        alert('Por favor, informe seu nome completo.');
        if (formNome) formNome.focus();
        return;
      }

      // Monta lista de aulas
      let aulasTexto = '';
      if (selectedCourses.size > 0) {
        aulasTexto = Array.from(selectedCourses).map(c => `• ${c}`).join('\n');
      } else {
        aulasTexto = '• A definir na conversa (interesse geral)';
      }

      // Constrói mensagem elegante e formatada
      let mensagem = `Olá! Gostaria de agendar aula(s) experimental(is) no Amadeus Instituto de Artes em São João da Boa Vista.\n\n`;
      mensagem += `*Dados do Aluno:*\n`;
      mensagem += `• *Nome:* ${nome}\n`;
      if (nascimento) {
        mensagem += `• *Data de Nascimento:* ${nascimento}\n`;
      }
      if (interesse) {
        mensagem += `• *Interesse / Observações:* ${interesse}\n`;
      }
      mensagem += `\n*Aulas Selecionadas (${selectedCourses.size}):*\n`;
      mensagem += `${aulasTexto}\n\n`;
      mensagem += `Como funcionam os horários e vagas disponíveis?`;

      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      closeModal();
    });
  }

  // =========================================================================
  // CENOGRAFIA & ANIMAÇÕES CINEMATOGRÁFICAS TEATRAIS
  // =========================================================================

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- 1. ABERTURA DAS CORTINAS DO TEATRO (UMA VEZ POR SESSÃO) ---
  function initTheaterCurtains() {
    const curtainsOverlay = document.getElementById('theater-curtains');
    if (!curtainsOverlay) return;

    const alreadyShown = sessionStorage.getItem('amadeus_curtain_shown');
    if (alreadyShown || prefersReducedMotion) {
      curtainsOverlay.remove();
      return;
    }

    // Dispara a abertura suave após breve instante para pintura da cena
    requestAnimationFrame(() => {
      setTimeout(() => {
        curtainsOverlay.classList.add('curtains-opening');
        setTimeout(() => {
          curtainsOverlay.style.display = 'none';
          curtainsOverlay.remove();
          sessionStorage.setItem('amadeus_curtain_shown', 'true');
        }, 1400);
      }, 120);
    });
  }

  // --- 2. PARTÍCULAS DOURADAS (POEIRA ILUMINADA POR REFLETORES DE PALCO) ---
  function initTheaterDust() {
    const canvas = document.getElementById('theater-dust-canvas');
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles = [];
    let animationId = null;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    const particleCount = window.innerWidth < 768 ? 12 : 22;

    class DustParticle {
      constructor() {
        this.reset(true);
      }
      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 10;
        this.radius = 0.8 + Math.random() * 1.5;
        this.baseAlpha = 0.12 + Math.random() * 0.22;
        this.alpha = this.baseAlpha;
        this.pulseSpeed = 0.01 + Math.random() * 0.02;
        this.pulseVal = Math.random() * Math.PI * 2;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = -0.15 - Math.random() * 0.25; // flutuação ascendente suave
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.pulseVal += this.pulseSpeed;
        this.alpha = this.baseAlpha + Math.sin(this.pulseVal) * 0.08;

        if (this.y < -10 || this.x < -10 || this.x > width + 10) {
          this.reset(false);
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(218, 165, 32, ${Math.max(0, this.alpha)})`;
        ctx.fill();
      }
    }

    function initParticles() {
      resize();
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new DustParticle());
      }
    }

    function loop() {
      if (document.hidden) {
        animationId = requestAnimationFrame(loop);
        return;
      }
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      animationId = requestAnimationFrame(loop);
    }

    initParticles();
    loop();

    window.addEventListener('resize', () => {
      resize();
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && animationId) {
        cancelAnimationFrame(animationId);
      } else {
        loop();
      }
    });
  }

  // --- 3. ENTRADA DE SEÇÕES & REVELAÇÃO DOS TÍTULOS COM A PENA DOURADA ---
  function initTheatricalScrollObserver() {
    const titles = document.querySelectorAll('.theatrical-title');

    // Suporte a acessibilidade (prefers-reduced-motion)
    if (prefersReducedMotion) {
      document.querySelectorAll('.theatrical-section').forEach(s => s.classList.add('in-view'));
      titles.forEach(t => t.classList.add('quill-completed'));
      return;
    }

    // Função que divide o texto em palavras individuais preservando marcação e espaços
    function wrapTitleWords(rootEl) {
      const words = [];

      function traverse(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          if (!text || !text.trim()) return;

          const fragment = document.createDocumentFragment();
          const tokens = text.split(/(\s+)/);

          tokens.forEach(token => {
            if (!token) return;
            if (/^\s+$/.test(token)) {
              fragment.appendChild(document.createTextNode(token));
            } else {
              const span = document.createElement('span');
              span.className = 'theatrical-word';
              span.textContent = token;
              fragment.appendChild(span);
              words.push(span);
            }
          });

          node.parentNode.replaceChild(fragment, node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.classList.contains('theatrical-word') || node.classList.contains('theatrical-quill')) {
            return;
          }
          Array.from(node.childNodes).forEach(traverse);
        }
      }

      traverse(rootEl);
      return words;
    }

    // Prepara cada título dividindo suas palavras
    const titleWordsMap = new Map();
    titles.forEach(title => {
      const words = wrapTitleWords(title);
      titleWordsMap.set(title, words);
    });

    // Animação da pena caligráfica escrevendo cada palavra rapidamente
    function animateQuillWriting(titleEl, words) {
      if (!words || words.length === 0) {
        titleEl.classList.add('quill-completed');
        return;
      }

      // Cria a pena dourada com bico e brilho de tinta
      const quill = document.createElement('div');
      quill.className = 'theatrical-quill';
      quill.setAttribute('aria-hidden', 'true');
      quill.innerHTML = `
        <img src="assets/img/pena-dourada.webp" alt="" class="theatrical-quill-img" />
        <div class="theatrical-quill-nib-sparkle"></div>
      `;
      titleEl.appendChild(quill);

      // Coordenadas da ponta da pena no arquivo WebP (6.4% X, 99.8% Y)
      const NIB_X_RATIO = 0.064;
      const NIB_Y_RATIO = 0.998;

      // Medidas dinâmicas da pena
      const quillW = quill.offsetWidth || 44;
      const quillH = quill.offsetHeight || 47;

      let currentIndex = 0;
      const WORD_DELAY = 105; // Cadência ágil e dinâmica por palavra

      // Posição inicial da pena antes da primeira palavra
      const titleRect = titleEl.getBoundingClientRect();
      const firstWordRect = words[0].getBoundingClientRect();
      const initX = (firstWordRect.left - titleRect.left) - (quillW * NIB_X_RATIO);
      const initY = (firstWordRect.bottom - titleRect.top) - (quillH * NIB_Y_RATIO);

      quill.style.transform = `translate3d(${initX}px, ${initY}px, 0) rotate(-6deg)`;
      
      requestAnimationFrame(() => {
        quill.style.opacity = '1';
      });

      function writeNextWord() {
        if (currentIndex >= words.length) {
          // Conclusão: a pena finaliza com um elegante movimento para cima e some
          const lastWord = words[words.length - 1];
          const lastWordRect = lastWord.getBoundingClientRect();
          const curTitleRect = titleEl.getBoundingClientRect();
          const endX = (lastWordRect.right - curTitleRect.left) - (quillW * NIB_X_RATIO) + 10;
          const endY = (lastWordRect.bottom - curTitleRect.top) - (quillH * NIB_Y_RATIO) - 22;

          quill.style.transition = 'transform 0.38s cubic-bezier(0.2, 0.8, 0.3, 1), opacity 0.32s ease';
          quill.style.transform = `translate3d(${endX}px, ${endY}px, 0) rotate(16deg) scale(0.92)`;
          quill.style.opacity = '0';

          // Brilho discreto na palavra-chave dourada em destaque (~300ms)
          const goldWord = titleEl.querySelector('.text-gold-italic, .gold-italic, em.seo-gold');
          if (goldWord) {
            goldWord.classList.add('theatrical-shimmer');
            setTimeout(() => {
              goldWord.classList.remove('theatrical-shimmer');
            }, 320);
          }

          setTimeout(() => {
            titleEl.classList.add('quill-completed');
            quill.remove();
          }, 400);
          return;
        }

        const currentWord = words[currentIndex];
        const curTitleRect = titleEl.getBoundingClientRect();
        const wordRect = currentWord.getBoundingClientRect();

        // Posiciona a ponta da pena no final da palavra escrita
        const targetX = (wordRect.right - curTitleRect.left) - (quillW * NIB_X_RATIO);
        const targetY = (wordRect.bottom - curTitleRect.top) - (quillH * NIB_Y_RATIO);

        // Leve inclinação caligráfica natural alternada
        const writeAngle = (currentIndex % 2 === 0) ? -9 : -3;
        quill.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) rotate(${writeAngle}deg)`;

        // Mostra a palavra completa instantaneamente
        currentWord.classList.add('written');

        // Discreto brilho de tinta no bico ao completar a palavra
        const sparkle = quill.querySelector('.theatrical-quill-nib-sparkle');
        if (sparkle) {
          sparkle.style.opacity = '0.9';
          sparkle.style.transform = 'translate(-50%, 50%) scale(1.15)';
          setTimeout(() => {
            sparkle.style.opacity = '0';
            sparkle.style.transform = 'translate(-50%, 50%) scale(0.5)';
          }, 65);
        }

        currentIndex++;
        setTimeout(writeNextWord, WORD_DELAY);
      }

      // Pequena pausa inicial de acomodação antes de começar a escrever
      setTimeout(writeNextWord, 80);
    }

    // Observador de Seções (Fade suave + Deslocamento vertical de 20px)
    const sectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.12
    });

    document.querySelectorAll('.theatrical-section').forEach(sec => {
      sectionObserver.observe(sec);
    });

    // Observador de Títulos (Pena dourada escreve cada palavra rapidamente)
    const titleObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const title = entry.target;
          observer.unobserve(title);

          const words = titleWordsMap.get(title);
          animateQuillWriting(title, words);
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.25
    });

    titles.forEach(title => {
      titleObserver.observe(title);
    });
  }

  // Inicialização das artes cênicas
  initTheaterCurtains();
  initTheaterDust();
  initTheatricalScrollObserver();
});
