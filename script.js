// Script principal para a página da Vera Lima
document.addEventListener('DOMContentLoaded', function() {
    
    // Configurações gerais
    const CONFIG = {
        whatsappNumber: '556399444540', // Número do WhatsApp correto
        email: 'vera.lima.psicologa@email.com',
        animationDelay: 100,
        scrollOffset: 80
    };

    // ============ NAVEGAÇÃO E MENU MOBILE ============
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link, #mobile-menu a');

    // Toggle menu mobile
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            const icon = mobileMenuBtn.querySelector('i');
            
            if (mobileMenu.classList.contains('hidden')) {
                icon.className = 'fas fa-bars text-2xl text-gray-700';
            } else {
                icon.className = 'fas fa-times text-2xl text-gray-700';
            }
        });

        // Fechar menu ao clicar em um link
        document.querySelectorAll('#mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.querySelector('i').className = 'fas fa-bars text-2xl text-gray-700';
            });
        });
    }

    // Scroll suave para links internos
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - CONFIG.scrollOffset;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ============ FORMULÁRIO DE CONTATO ============
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(this);
        });
    }

    function handleFormSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validações
        if (!validateForm(data)) {
            return;
        }

        // Simular loading
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enviando...';

        // Simular envio (aqui você integraria com seu backend)
        setTimeout(() => {
            // Criar mensagem do WhatsApp
            const whatsappMessage = createWhatsAppMessage(data);
            
            // Redirecionar para WhatsApp
            const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');
            
            // Resetar formulário
            form.reset();
            
            // Mostrar feedback de sucesso
            showFeedback('Sua solicitação foi enviada! Você será redirecionado para o WhatsApp.', 'success');
            
            // Restaurar botão
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            
        }, 2000);
    }

    function validateForm(data) {
        const requiredFields = ['nome', 'email', 'telefone', 'tipo-atendimento', 'modalidade'];
        const errors = [];

        requiredFields.forEach(field => {
            if (!data[field] || data[field].trim() === '') {
                errors.push(`O campo ${getFieldLabel(field)} é obrigatório.`);
            }
        });

        // Validar email
        if (data.email && !isValidEmail(data.email)) {
            errors.push('Por favor, insira um email válido.');
        }

        // Validar telefone
        if (data.telefone && !isValidPhone(data.telefone)) {
            errors.push('Por favor, insira um telefone válido.');
        }

        if (errors.length > 0) {
            showFeedback(errors.join(' '), 'error');
            return false;
        }

        return true;
    }

    function getFieldLabel(field) {
        const labels = {
            'nome': 'Nome',
            'email': 'Email',
            'telefone': 'Telefone',
            'tipo-atendimento': 'Tipo de Atendimento',
            'modalidade': 'Modalidade'
        };
        return labels[field] || field;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
    }

    function createWhatsAppMessage(data) {
        let message = `🌟 *Nova Solicitação de Consulta*\n\n`;
        message += `👤 *Nome:* ${data.nome}\n`;
        message += `📧 *Email:* ${data.email}\n`;
        message += `📱 *Telefone:* ${data.telefone}\n`;
        message += `🎯 *Tipo de Atendimento:* ${getServiceType(data['tipo-atendimento'])}\n`;
        message += `💻 *Modalidade:* ${data.modalidade === 'online' ? 'Online' : 'Presencial'}\n`;
        
        if (data.mensagem && data.mensagem.trim() !== '') {
            message += `\n💬 *Mensagem:*\n${data.mensagem}\n`;
        }
        
        message += `\n✨ Enviado através do site oficial`;
        
        return message;
    }

    function getServiceType(type) {
        const types = {
            'individual': 'Terapia Individual',
            'casal': 'Terapia de Casal',
            'familiar': 'Terapia Familiar'
        };
        return types[type] || type;
    }

    function showFeedback(message, type) {
        // Remover feedback anterior se existir
        const existingFeedback = document.querySelector('.feedback-message');
        if (existingFeedback) {
            existingFeedback.remove();
        }

        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = `feedback-message ${type}`;
        feedbackDiv.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'} mr-2"></i>
                <span>${message}</span>
            </div>
        `;

        // Inserir após o formulário
        const form = document.getElementById('contact-form');
        if (form) {
            form.parentNode.insertBefore(feedbackDiv, form.nextSibling);
            
            // Mostrar com animação
            setTimeout(() => {
                feedbackDiv.classList.add('show');
            }, 100);

            // Remover após 5 segundos
            setTimeout(() => {
                if (feedbackDiv.parentNode) {
                    feedbackDiv.classList.remove('show');
                    setTimeout(() => {
                        if (feedbackDiv.parentNode) {
                            feedbackDiv.remove();
                        }
                    }, 300);
                }
            }, 5000);
        }
    }

    // ============ MÁSCARAS DE INPUT ============
    function initInputMasks() {
        const phoneInput = document.getElementById('telefone');
        
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.length > 0) {
                    if (value.length <= 10) {
                        value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
                    } else {
                        value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
                    }
                }
                
                e.target.value = value;
            });
        }
    }

    // ============ SMOOTH SCROLLING E NAVBAR ATIVA ============
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionHeight = section.offsetHeight;
            
            if (sectionTop <= CONFIG.scrollOffset && sectionTop + sectionHeight > CONFIG.scrollOffset) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('text-blue-600');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('text-blue-600');
            }
        });
    }

    // ============ UTILITÁRIOS ============
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ============ EASTER EGGS E INTERATIVIDADE ============
    function initEasterEggs() {
        // Adicionar efeito de hover nos ícones
        const icons = document.querySelectorAll('.fas, .fab');
        icons.forEach(icon => {
            icon.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1) rotate(5deg)';
                this.style.transition = 'transform 0.3s ease';
            });
            
            icon.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1) rotate(0deg)';
            });
        });

        // Efeito de partículas no hero (opcional)
        createParticleEffect();
    }

    function createParticleEffect() {
        // Implementação simples de efeito de partículas
        const hero = document.querySelector('section');
        if (!hero) return;

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: linear-gradient(45deg, #2563eb, #7c3aed);
                border-radius: 50%;
                pointer-events: none;
                opacity: 0.7;
            `;
            
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            
            hero.style.position = 'relative';
            hero.appendChild(particle);
        }
    }

    // ============ INICIALIZAÇÃO ============
    function init() {
        initInputMasks();
        initEasterEggs();
        
        // Event listeners
        window.addEventListener('scroll', debounce(() => {
            updateActiveNavLink();
        }, 10));
        
        // Executar função inicial
        setTimeout(() => {
            updateActiveNavLink();
        }, 500);

        // Log de inicialização (remover em produção)
        console.log('🧠 Site da Psicóloga Vera Lima carregado com sucesso!');
    }

    // ============ PERFORMANCE E OTIMIZAÇÕES ============
    
    // Lazy loading para imagens (se houver)
    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Preload de recursos críticos
    function preloadCriticalResources() {
        const criticalResources = [
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = resource;
            document.head.appendChild(link);
        });
    }

    // ============ ACESSIBILIDADE ============
    function initAccessibility() {
        // Navegação por teclado
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.querySelector('i').className = 'fas fa-bars text-2xl text-gray-700';
            }
        });

        // Skip links para navegação por teclado
        const skipLink = document.createElement('a');
        skipLink.href = '#sobre';
        skipLink.textContent = 'Pular para o conteúdo principal';
        skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white p-2 z-50';
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    // ============ EXECUTAR INICIALIZAÇÃO ============
    preloadCriticalResources();
    init();
    initLazyLoading();
    initAccessibility();
});

// ============ SERVICE WORKER (PWA - Opcional) ============
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registrado com sucesso: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW falha no registro: ', registrationError);
            });
    });
}

// ============ ANALYTICS E TRACKING (Implementar conforme necessário) ============
function trackEvent(eventName, parameters = {}) {
    // Implementar Google Analytics, Facebook Pixel, etc.
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
    }
    
    console.log(`📊 Evento rastreado: ${eventName}`, parameters);
}

// Exemplos de eventos para rastrear
document.addEventListener('DOMContentLoaded', function() {
    // Rastrear cliques em botões importantes
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
        btn.addEventListener('click', function() {
            trackEvent('button_click', {
                button_text: this.textContent.trim(),
                button_location: this.closest('section')?.id || 'unknown'
            });
        });
    });

    // Rastrear envio de formulário
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', function() {
            trackEvent('form_submit', {
                form_name: 'contact_form'
            });
        });
    }
});
