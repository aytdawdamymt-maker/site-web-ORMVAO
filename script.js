// script.js
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== MENU HAMBURGER =====
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Fermer le menu au clic sur un lien
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
    
    // ===== ANIMATION DES CHIFFRES =====
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'));
                if (!isNaN(target) && !el.dataset.animated) {
                    el.dataset.animated = 'true';
                    let current = 0;
                    const increment = Math.ceil(target / 60);
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            el.textContent = target;
                            clearInterval(timer);
                        } else {
                            el.textContent = current;
                        }
                    }, 30);
                }
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(num => observer.observe(num));
    
    // ===== FORMULAIRE D'INSCRIPTION =====
    const form = document.getElementById('inscriptionForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Récupérer les valeurs
        const nom = document.getElementById('nom').value.trim();
        const email = document.getElementById('email').value.trim();
        const telephone = document.getElementById('telephone').value.trim();
        const sujet = document.getElementById('sujet').value;
        const message = document.getElementById('message').value.trim();
        
        // Validation simple
        if (!nom || !email || !sujet || !message) {
            alert('⚠️ Veuillez remplir tous les champs obligatoires (*)');
            return;
        }
        
        if (!email.includes('@')) {
            alert('⚠️ Veuillez entrer une adresse email valide');
            return;
        }
        
        // Simulation d'envoi
        const btn = form.querySelector('.btn-submit');
        const originalText = btn.textContent;
        btn.textContent = '⏳ Envoi en cours...';
        btn.disabled = true;
        
        setTimeout(() => {
            alert('✅ Votre demande a été envoyée avec succès !\nNous vous contacterons dans les plus brefs délais.');
            form.reset();
            btn.textContent = originalText;
            btn.disabled = false;
        }, 1500);
    });
    
    // ===== NAVBAR SCROLL EFFECT =====
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 100) {
            navbar.style.background = 'rgba(13, 43, 31, 0.98)';
            navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.4)';
        } else {
            navbar.style.background = 'rgba(13, 43, 31, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.3)';
        }
        lastScroll = currentScroll;
    });
    
    // ===== LIENS SOCIAUX (clics) =====
    document.querySelectorAll('.social-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            alert('🔗 Page ' + this.textContent + ' - Suivez-nous sur nos réseaux !');
        });
    });
    
    // ===== EFFET DE SURVOL SUR LES CARTES MISSIONS =====
    document.querySelectorAll('.mission-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.background = '#f7fcf9';
        });
        card.addEventListener('mouseleave', function() {
            this.style.background = 'white';
        });
    });
    
    // ===== MESSAGE DE BIENVENUE CONSOLE =====
    console.log('🌾 ORMVAO - Office Régional de Mise en Valeur Agricole d\'Ouarzazate');
    console.log('📍 Vallée de l\'oued Drâa - Agriculture durable');
    console.log('✅ Site prêt !');
    
    // ===== ANIMATION D'APPARITION DES SECTIONS =====
    const sections = document.querySelectorAll('.section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.8s ease';
        sectionObserver.observe(section);
    });
    
});