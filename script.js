// JavaScript para funcionalidades interactivas de la página web

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las funcionalidades
    initScrollEffects();
    initNavbarBehavior();
    initFormHandling();
    initAnimations();
    initCounters();
    initTooltips();
    initLanguageButtons();
});

// Efectos de scroll suave y navbar
function initScrollEffects() {
    // Smooth scroll para enlaces de navegación
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Ajustar por navbar fija
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Comportamiento del navbar al hacer scroll
function initNavbarBehavior() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    // Verificar que el navbar existe antes de agregar el event listener
    if (!navbar) {
        console.log('Navbar not found, skipping navbar behavior initialization');
        return;
    }
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Cambiar opacidad del navbar al hacer scroll
        if (scrollTop > 100) {
            navbar.style.background = 'rgba(13, 110, 253, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'rgba(13, 110, 253, 0.9)';
            navbar.style.backdropFilter = 'none';
        }
        
        // Ocultar/mostrar navbar al hacer scroll hacia abajo/arriba
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Manejo del formulario de contacto
function initFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
}

// Inicializar EmailJS (comentado hasta que se configure)
// (function() {
//     emailjs.init("YOUR_PUBLIC_KEY"); // Reemplazar con tu clave pública
// })();

// Función para manejar el envío del formulario
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Obtener datos del formulario
    const formData = new FormData(event.target);
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const mensaje = document.getElementById('mensaje').value;
    
    // Validación básica
    if (!nombre || !email || !mensaje) {
        showAlert('Por favor, completa todos los campos.', 'warning');
        return;
    }
    
    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showAlert('Por favor, ingresa un email válido.', 'warning');
        return;
    }
    
    // Mostrar loading
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Enviando...';
    submitButton.disabled = true;
    
    // Configurar los parámetros del email
    const templateParams = {
        from_name: nombre,
        from_email: email,
        message: mensaje,
        to_email: 'gerenciaelecsas@gmail.com'
    };
    
    // Enviar mensaje al backend de C#
    fetch('http://localhost:5000/api/contact/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nombre: nombre,
            email: email,
            mensaje: mensaje
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.message) {
            showAlert('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
            event.target.reset();
        } else {
            showAlert('Error al enviar el mensaje. Por favor, inténtalo de nuevo.', 'danger');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        let errorMessage = 'Error al enviar el mensaje. Por favor, inténtalo de nuevo.';
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
        } else if (error.message.includes('500')) {
            errorMessage = 'Error interno del servidor. Por favor, inténtalo más tarde.';
        } else if (error.message.includes('400')) {
            errorMessage = 'Datos inválidos. Por favor, revisa la información ingresada.';
        }
        
        showAlert(errorMessage, 'danger');
    })
    .finally(function() {
        // Restaurar botón
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    });
}

// Función para mostrar alertas
function showAlert(message, type) {
    // Crear elemento de alerta
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Agregar al body
    document.body.appendChild(alertDiv);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Animaciones al hacer scroll
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);
    
    // Observar elementos para animaciones
    const animatedElements = document.querySelectorAll('.card, .service-card, h2, h3, .lead');
    animatedElements.forEach(el => {
        el.classList.add('scroll-reveal');
        observer.observe(el);
    });
}

// Animación de contadores
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Función para animar contadores
function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/\D/g, ''));
    const duration = 2000; // 2 segundos
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + '+';
    }, 16);
}

// Inicializar tooltips de Bootstrap
function initTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Language Toggle Function - Global scope
var currentLanguage = 'es'; // Spanish by default
var translations = null; // Will be initialized when DOM is ready

// Initialize translations when DOM is ready
function initializeTranslations() {
    translations = {
    'es': {
        // Navigation
        'nav-inicio': 'Inicio',
        'nav-sobre-nosotros': 'Sobre Nosotros',
        'nav-servicios': 'Servicios',
        'nav-galeria': 'Galería',
        'nav-contacto': 'Contacto',
        
        // Hero Section
        'hero-subtitle': 'Especialistas en soluciones eléctricas profesionales',
        
        // About Section
        'about-title': 'Sobre Nosotros',
        'about-description': 'Con más de 8 años de experiencia, somos especialistas en soluciones eléctricas profesionales para los sectores residencial, industrial y comercial. Ofrecemos servicios integrales en sistemas eléctricos, cableado estructurado y telecomunicaciones, cumpliendo con las normativas RETIE y RITEL. Nuestro equipo especializado garantiza la más alta calidad en cada proyecto, utilizando metodología BIM y herramientas avanzadas como Revit para optimizar la eficiencia y precisión en cada etapa.',
        'projects-count': 'Proyectos',
        'clients-count': 'Clientes',
        'years-count': 'Años',
        
        // Services Section
        'services-title': 'Nuestros Servicios',
        'services-subtitle': 'Ofrecemos soluciones completas en sistemas eléctricos y telecomunicaciones',
        'service-1-title': 'Diseño y Construcción Eléctrica',
        'service-1-desc': 'Incluye sistemas eléctricos residenciales, industriales y comerciales, cumpliendo con normativas RETIE.',
        'service-2-title': 'Diseño y Construcción de Infraestructura y Telecomunicaciones',
        'service-2-desc': 'Abarca cableado estructurado, conectividad y trámites ante operadores de red, bajo normativa RITEL.',
        'service-3-title': 'Automatización y Consultoría',
        'service-3-desc': 'Ofrece servicios de interventoría, consultoría, integración de metodología BIM (con herramientas como Revit) y certificación de proyectos.',
        'more-info': 'Más información',
        
        // Clients Section
        'clients-title': 'Nuestros Clientes',
        'clients-subtitle': 'Empresas que confían en nuestros servicios',
        
        // Contact Section
        'contact-title': 'Contacto',
        'contact-subtitle': '¿Tienes alguna pregunta? ¡Contáctanos!',
        'contact-info-title': 'Información de Contacto',
        'follow-us': 'Síguenos en redes sociales',
        'contact-form-title': 'Envíanos un mensaje',
        'form-name': 'Nombre',
        'form-name-placeholder': 'Tu nombre',
        'form-email': 'Email',
        'form-email-placeholder': 'Tu email',
        'form-message': 'Mensaje',
        'form-message-placeholder': 'Tu mensaje',
        'send-message': 'Enviar Mensaje',
        
        // Footer
        'footer-rights': 'Todos los derechos reservados.',
        
        // About Us Page
        'about-hero-title': 'Sobre Nosotros',
        'about-hero-subtitle': 'Conoce nuestra historia y compromiso con la excelencia',
        'about-history-title': 'Nuestra Historia',
        'about-history-description': 'Con más de 8 años de experiencia, somos aliados estratégicos en el diseño y construcción de proyectos eléctricos, IS y TDT para los sectores residencial, industrial y comercial en todo el país. Nuestro portafolio integral nos permite acompañar a cada cliente desde la planeación hasta la entrega final, ofreciendo soluciones seguras, eficientes y modernas en sistemas eléctricos, cableado estructurado y telecomunicaciones, bajo el cumplimiento de las normativas RETIE y RITEL. Contamos con el respaldo de un equipo especializado en interventoría, consultoría, automatización, trámites ante operadores de red y certificación RETIE, garantizando que cada proyecto cumpla con los más altos estándares de calidad y la normatividad vigente. Como parte de nuestro compromiso con la innovación y la excelencia, integramos la metodología BIM en la gestión de proyectos y utilizamos herramientas de diseño avanzadas como Revit, lo que nos permite optimizar la precisión, la coordinación multidisciplinaria y la eficiencia en cada etapa, consolidándonos como una empresa que aporta valor, modernización tecnológica y confianza a sus clientes.',
        'mission-title': 'Nuestra Misión',
        'mission-description': 'Ser líderes en el diseño y construcción de proyectos eléctricos, IS y TDT, ofreciendo soluciones integrales que cumplan con los más altos estándares de calidad y normatividad vigente.',
        'vision-title': 'Nuestra Visión',
        'vision-description': 'Consolidarnos como la empresa de referencia en el sector eléctrico, reconocida por nuestra innovación, calidad y compromiso con la excelencia en cada proyecto.',
        'values-title': 'Nuestros Valores',
        'values-description': 'Compromiso, calidad, innovación y responsabilidad social son los pilares que guían nuestro trabajo diario.',
        'quality-title': 'Calidad',
        'quality-description': 'Cumplimos con los más altos estándares de calidad y normativas RETIE y RITEL.',
        'innovation-title': 'Innovación',
        'innovation-description': 'Utilizamos metodología BIM y herramientas avanzadas como Revit.',
        'trust-title': 'Confianza',
        'trust-description': 'Construimos relaciones duraderas basadas en la transparencia y el compromiso.',
        
        // Services Page
        'services-specialized-title': 'Servicios Especializados',
        'services-specialized-subtitle': 'Ofrecemos soluciones completas en sistemas eléctricos y telecomunicaciones',
        'service-1-title': 'Diseño y Construcción Eléctrica',
        'service-1-desc': 'Incluye sistemas eléctricos residenciales, industriales y comerciales, cumpliendo con normativas RETIE.',
        'service-2-title': 'Infraestructura de Telecomunicaciones',
        'service-2-desc': 'Abarca cableado estructurado, conectividad y trámites ante operadores de red, bajo normativa RITEL.',
        'service-3-title': 'Automatización y Consultoría',
        'service-3-desc': 'Ofrece servicios de interventoría, consultoría, integración de metodología BIM (con herramientas como Revit) y certificación de proyectos.',
        'quote-title': '¿Necesitas una cotización?',
        'quote-subtitle': 'Contáctanos para conocer más sobre nuestros servicios y obtener una propuesta personalizada',
        'whatsapp-text': 'WhatsApp',
        
        // Gallery Page
        'gallery-title': 'Galería de Proyectos',
        'gallery-subtitle': 'Conoce algunos de nuestros trabajos más destacados',
        'gallery-projects-title': 'Nuestros Proyectos',
        'gallery-projects-subtitle': 'Proyectos realizados en diferentes sectores',
        'filter-all': 'Todos',
        'filter-residencial': 'Residencial',
        'filter-industrial': 'Industrial',
        'filter-comercial': 'Comercial',
        'project-residencial-1': 'Proyecto Residencial',
        'project-residencial-1-desc': 'Instalación eléctrica completa en vivienda unifamiliar',
        'project-industrial-1': 'Planta Industrial',
        'project-industrial-1-desc': 'Sistema eléctrico para planta de manufactura',
        'project-comercial-1': 'Centro Comercial',
        'project-comercial-1-desc': 'Cableado estructurado y sistemas de iluminación',
        'project-residencial-2': 'Casa Inteligente',
        'project-residencial-2-desc': 'Sistema de domótica y automatización residencial',
        'project-industrial-2': 'Automatización Industrial',
        'project-industrial-2-desc': 'Sistema SCADA y control de procesos',
        'project-comercial-2': 'Oficinas Corporativas',
        'project-comercial-2-desc': 'Sistema de telecomunicaciones y fibra óptica',
        'badge-residencial': 'Residencial',
        'badge-industrial': 'Industrial',
        'badge-comercial': 'Comercial',
        'stats-projects': 'Proyectos Completados',
        'stats-experience': 'Años de Experiencia',
        'stats-compliance': 'Cumplimiento RETIE',
        'stats-support': 'Soporte Técnico',
        'footer-rights': 'Todos los derechos reservados.',
        
        // Contact Page
        'contact-get-in-touch': 'Ponte en Contacto',
        'contact-question': '¿Tienes alguna pregunta? ¡Contáctanos!',
        'contact-info-title': 'Información de Contacto',
        'contact-follow-us': 'Síguenos en redes sociales',
        'contact-form-title': 'Envíanos un mensaje',
        'contact-form-name': 'Nombre',
        'contact-form-name-placeholder': 'Tu nombre',
        'contact-form-email': 'Email',
        'contact-form-email-placeholder': 'Tu email',
        'contact-form-message': 'Mensaje',
        'contact-form-message-placeholder': 'Tu mensaje',
        'contact-form-send': 'Enviar Mensaje',
        'contact-location-title': 'Nuestra Ubicación',
        'contact-location-subtitle': 'Visítanos en nuestras oficinas principales',
        'contact-address': 'Cra 73B #32-12 Sur, Bogotá, Colombia',
        'contact-map-title': 'Mapa Interactivo',
        'contact-map-button': 'Ver en Google Maps'
    },
    'en-us': {
        // Navigation
        'nav-inicio': 'Home',
        'nav-sobre-nosotros': 'About Us',
        'nav-servicios': 'Services',
        'nav-galeria': 'Gallery',
        'nav-contacto': 'Contact',
        
        // Hero Section
        'hero-subtitle': 'Specialists in professional electrical solutions',
        
        // About Section
        'about-title': 'About Us',
        'about-description': 'With more than 8 years of experience, we are specialists in professional electrical solutions for residential, industrial and commercial sectors. We offer comprehensive services in electrical systems, structured cabling and telecommunications, complying with RETIE and RITEL regulations. Our specialized team guarantees the highest quality in each project, using BIM methodology and advanced tools such as Revit to optimize efficiency and precision in each stage.',
        'projects-count': 'Projects',
        'clients-count': 'Clients',
        'years-count': 'Years',
        
        // Services Section
        'services-title': 'Our Services',
        'services-subtitle': 'We offer complete solutions in electrical systems and telecommunications',
        'service-1-title': 'Electrical Design and Construction',
        'service-1-desc': 'Includes residential, industrial and commercial electrical systems, complying with RETIE regulations.',
        'service-2-title': 'Infrastructure and Telecommunications Design and Construction',
        'service-2-desc': 'Covers structured cabling, connectivity and procedures with network operators, under RITEL regulation.',
        'service-3-title': 'Automation and Consulting',
        'service-3-desc': 'Offers supervision services, consulting, BIM methodology integration (with tools such as Revit) and project certification.',
        'more-info': 'More information',
        
        // Clients Section
        'clients-title': 'Our Clients',
        'clients-subtitle': 'Companies that trust our services',
        
        // Contact Section
        'contact-title': 'Contact',
        'contact-subtitle': 'Do you have any questions? Contact us!',
        'contact-info-title': 'Contact Information',
        'follow-us': 'Follow us on social networks',
        'contact-form-title': 'Send us a message',
        'form-name': 'Name',
        'form-name-placeholder': 'Your name',
        'form-email': 'Email',
        'form-email-placeholder': 'Your email',
        'form-message': 'Message',
        'form-message-placeholder': 'Your message',
        'send-message': 'Send Message',
        
        // Footer
        'footer-rights': 'All rights reserved.',
        
        // About Us Page
        'about-hero-title': 'About Us',
        'about-hero-subtitle': 'Learn about our history and commitment to excellence',
        'about-history-title': 'Our History',
        'about-history-description': 'With more than 8 years of experience, we are strategic allies in the design and construction of electrical, IS and TDT projects for residential, industrial and commercial sectors throughout the country. Our comprehensive portfolio allows us to accompany each client from planning to final delivery, offering safe, efficient and modern solutions in electrical systems, structured cabling and telecommunications, under compliance with RETIE and RITEL regulations. We have the support of a specialized team in supervision, consulting, automation, procedures with network operators and RETIE certification, guaranteeing that each project meets the highest quality standards and current regulations. As part of our commitment to innovation and excellence, we integrate BIM methodology in project management and use advanced design tools such as Revit, which allows us to optimize precision, multidisciplinary coordination and efficiency in each stage, consolidating ourselves as a company that brings value, technological modernization and trust to its clients.',
        'mission-title': 'Our Mission',
        'mission-description': 'To be leaders in the design and construction of electrical, IS and TDT projects, offering comprehensive solutions that meet the highest quality standards and current regulations.',
        'vision-title': 'Our Vision',
        'vision-description': 'To consolidate ourselves as the reference company in the electrical sector, recognized for our innovation, quality and commitment to excellence in each project.',
        'values-title': 'Our Values',
        'values-description': 'Commitment, quality, innovation and social responsibility are the pillars that guide our daily work.',
        'quality-title': 'Quality',
        'quality-description': 'We comply with the highest quality standards and RETIE and RITEL regulations.',
        'innovation-title': 'Innovation',
        'innovation-description': 'We use BIM methodology and advanced tools such as Revit.',
        'trust-title': 'Trust',
        'trust-description': 'We build lasting relationships based on transparency and commitment.',
        
        // Services Page
        'services-specialized-title': 'Specialized Services',
        'services-specialized-subtitle': 'We offer complete solutions in electrical systems and telecommunications',
        'service-1-title': 'Electrical Design and Construction',
        'service-1-desc': 'Includes residential, industrial and commercial electrical systems, complying with RETIE regulations.',
        'service-2-title': 'Telecommunications Infrastructure',
        'service-2-desc': 'Covers structured cabling, connectivity and procedures with network operators, under RITEL regulation.',
        'service-3-title': 'Automation and Consulting',
        'service-3-desc': 'Offers supervision services, consulting, BIM methodology integration (with tools such as Revit) and project certification.',
        'quote-title': 'Need a quote?',
        'quote-subtitle': 'Contact us to learn more about our services and get a personalized proposal',
        'whatsapp-text': 'WhatsApp',
        
        // Gallery Page
        'gallery-title': 'Project Gallery',
        'gallery-subtitle': 'Discover some of our most outstanding works',
        'gallery-projects-title': 'Our Projects',
        'gallery-projects-subtitle': 'Projects carried out in different sectors',
        'filter-all': 'All',
        'filter-residencial': 'Residential',
        'filter-industrial': 'Industrial',
        'filter-comercial': 'Commercial',
        'project-residencial-1': 'Residential Project',
        'project-residencial-1-desc': 'Complete electrical installation in single-family home',
        'project-industrial-1': 'Industrial Plant',
        'project-industrial-1-desc': 'Electrical system for manufacturing plant',
        'project-comercial-1': 'Shopping Center',
        'project-comercial-1-desc': 'Structured cabling and lighting systems',
        'project-residencial-2': 'Smart Home',
        'project-residencial-2-desc': 'Home automation and residential automation system',
        'project-industrial-2': 'Industrial Automation',
        'project-industrial-2-desc': 'SCADA system and process control',
        'project-comercial-2': 'Corporate Offices',
        'project-comercial-2-desc': 'Telecommunications and fiber optic system',
        'badge-residencial': 'Residential',
        'badge-industrial': 'Industrial',
        'badge-comercial': 'Commercial',
        'stats-projects': 'Completed Projects',
        'stats-experience': 'Years of Experience',
        'stats-compliance': 'RETIE Compliance',
        'stats-support': 'Technical Support',
        'footer-rights': 'All rights reserved.',
        
        // Contact Page
        'contact-get-in-touch': 'Get in Touch',
        'contact-question': 'Do you have any questions? Contact us!',
        'contact-info-title': 'Contact Information',
        'contact-follow-us': 'Follow us on social networks',
        'contact-form-title': 'Send us a message',
        'contact-form-name': 'Name',
        'contact-form-name-placeholder': 'Your name',
        'contact-form-email': 'Email',
        'contact-form-email-placeholder': 'Your email',
        'contact-form-message': 'Message',
        'contact-form-message-placeholder': 'Your message',
        'contact-form-send': 'Send Message',
        'contact-location-title': 'Our Location',
        'contact-location-subtitle': 'Visit us at our main offices',
        'contact-address': 'Cra 73B #32-12 Sur, Bogotá, Colombia',
        'contact-map-title': 'Interactive Map',
        'contact-map-button': 'View on Google Maps'
    }
    };
    console.log('Translations initialized:', translations);
}

// Global functions for language toggle
function toggleLanguageColombia() {
    console.log('toggleLanguageColombia called');
        currentLanguage = 'es';
        translateToSpanish();
    updateLanguageButtons('colombia');
}

function toggleLanguageUS() {
    console.log('toggleLanguageUS called');
    currentLanguage = 'en-us';
    translateToEnglishUS();
    updateLanguageButtons('us');
}

function toggleLanguageUK() {
    if (currentLanguage === 'es') {
        // Switch to English UK
        currentLanguage = 'en-uk';
        translateToEnglishUK();
    } else {
        // Switch to Spanish
        currentLanguage = 'es';
        translateToSpanish();
    }
}

// Global function to update language buttons
function updateLanguageButtons(activeLanguage) {
    console.log('updateLanguageButtons called with:', activeLanguage);
    const colombiaBtn = document.getElementById('language-toggle-colombia');
    const usBtn = document.getElementById('language-toggle-us');
    const mobileColombiaBtn = document.getElementById('mobile-language-toggle-colombia');
    const mobileUsBtn = document.getElementById('mobile-language-toggle-us');
    
    console.log('Found buttons:', { colombiaBtn, usBtn, mobileColombiaBtn, mobileUsBtn });
    
    // Reset all desktop buttons
    if (colombiaBtn) colombiaBtn.classList.remove('active');
    if (usBtn) usBtn.classList.remove('active');
    
    // Reset all mobile buttons
    if (mobileColombiaBtn) mobileColombiaBtn.classList.remove('active');
    if (mobileUsBtn) mobileUsBtn.classList.remove('active');
    
    // Activate the selected language button (both desktop and mobile)
    if (activeLanguage === 'colombia') {
        if (colombiaBtn) colombiaBtn.classList.add('active');
        if (mobileColombiaBtn) mobileColombiaBtn.classList.add('active');
        console.log('Activated Colombia button');
    } else if (activeLanguage === 'us') {
        if (usBtn) usBtn.classList.add('active');
        if (mobileUsBtn) mobileUsBtn.classList.add('active');
        console.log('Activated US button');
    }
}

// Global translation functions
function translateToEnglishUS() {
    console.log('translateToEnglishUS called');
    currentLanguage = 'en-us';
    translatePage('en-us');
    showAlert('Switched to English (US)', 'info');
}

function translateToEnglishUK() {
    console.log('translateToEnglishUK called');
    currentLanguage = 'en-uk';
    translatePage('en-uk');
    showAlert('Switched to English (UK)', 'info');
}

function translateToSpanish() {
    console.log('translateToSpanish called');
    currentLanguage = 'es';
    translatePage('es');
    showAlert('Cambiado a Español', 'info');
}

// Global function to translate the page
function translatePage(language) {
    console.log('Translating to:', language);
    console.log('Translations object:', translations);
    console.log('Language exists:', translations && translations[language]);
    const elements = document.querySelectorAll('[data-translate]');
    console.log('Found elements to translate:', elements.length);
    
    if (!translations || !translations[language]) {
        console.error('Translations not available for language:', language);
        return;
    }
    
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[language] && translations[language][key]) {
            if (element.tagName === 'INPUT' && element.type === 'text') {
                element.placeholder = translations[language][key];
            } else if (element.tagName === 'TEXTAREA') {
                element.placeholder = translations[language][key];
            } else {
                element.textContent = translations[language][key];
            }
            console.log('Translated:', key, 'to:', translations[language][key]);
        } else {
            console.log('Translation not found for key:', key, 'in language:', language);
        }
    });
}

// Initialize language buttons on page load
function initLanguageButtons() {
    // Initialize translations first
    initializeTranslations();
    
    // Set Spanish as active by default
    updateLanguageButtons('colombia');
    
    // Add click event listeners for desktop buttons
    const colombiaBtn = document.getElementById('language-toggle-colombia');
    const usBtn = document.getElementById('language-toggle-us');
    
    if (colombiaBtn) {
        colombiaBtn.addEventListener('click', function() {
            toggleLanguageColombia();
        });
    }
    
    if (usBtn) {
        usBtn.addEventListener('click', function() {
            toggleLanguageUS();
        });
    }
    
    // Add click event listeners for mobile buttons
    const mobileColombiaBtn = document.getElementById('mobile-language-toggle-colombia');
    const mobileUsBtn = document.getElementById('mobile-language-toggle-us');
    
    if (mobileColombiaBtn) {
        mobileColombiaBtn.addEventListener('click', function() {
            toggleLanguageColombia();
        });
    }
    
    if (mobileUsBtn) {
        mobileUsBtn.addEventListener('click', function() {
            toggleLanguageUS();
        });
    }
}

// Función para scroll suave a sección (usada en botones)
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Efectos de hover para las tarjetas de servicios
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
    });
});

// Efecto de typing para el título principal
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Aplicar efecto de typing al cargar la página
window.addEventListener('load', function() {
    const heroTitle = document.querySelector('.hero-section h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 80);
    }
});

// Función para cambiar tema (bonus)
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// Cargar tema guardado
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
});

// Efecto de partículas en el hero (opcional)
function createParticles() {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            pointer-events: none;
            animation: float ${Math.random() * 3 + 2}s infinite ease-in-out;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 2}s;
        `;
        hero.appendChild(particle);
    }
}

// CSS para las partículas
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.5; }
        50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
    }
`;
document.head.appendChild(particleStyle);

// Crear partículas al cargar
window.addEventListener('load', createParticles);

// Función para mostrar/ocultar botón de scroll hacia arriba
function initScrollToTop() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
    scrollToTopBtn.className = 'btn btn-primary position-fixed';
    scrollToTopBtn.style.cssText = `
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        display: none;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.display = 'block';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Inicializar botón de scroll hacia arriba
document.addEventListener('DOMContentLoaded', initScrollToTop);

// Función para preloader (opcional)
function initPreloader() {
    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3">Cargando...</p>
        </div>
    `;
    preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    `;
    
    document.body.appendChild(preloader);
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }, 1000);
    });
}

// Inicializar preloader
// initPreloader(); // Descomenta si quieres usar el preloader
