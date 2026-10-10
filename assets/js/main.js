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
        btn.textContent = '✓ ADICIONADO';
      } else {
        btn.classList.remove('selected');
        btn.textContent = 'ADICIONAR À EXPERIÊNCIA';
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
  document.querySelectorAll('.tab-pane-cta a, .category-art-block button, .hero-actions-clean a, .cta-final-section a, .footer-brand a').forEach(btn => {
    btn.addEventListener('click', (e) => {
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
});
