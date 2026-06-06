/* --- Écran de chargement --- */
(function () {
  const ecran = document.getElementById('chargement');
  const barre = document.getElementById('chargement-barre');
  if (!ecran || !barre) return;

  // Déjà affiché cette session → masquer immédiatement sans animation
  if (sessionStorage.getItem('chargement-vu')) {
    ecran.style.display = 'none';
    return;
  }

  let animTerminee = false;
  let ressourcesChargees = false;

  function tenterMasquer() {
    if (animTerminee && ressourcesChargees) {
      ecran.classList.add('chargement--cache');
      sessionStorage.setItem('chargement-vu', '1');
    }
  }

  barre.addEventListener('animationend', function () {
    animTerminee = true;
    tenterMasquer();
  });

  // Attendre la page complète ET les polices Google Fonts
  Promise.all([
    new Promise(function (resolve) {
      window.addEventListener('load', resolve, { once: true });
    }),
    document.fonts.ready
  ]).then(function () {
    ressourcesChargees = true;
    tenterMasquer();
  });
})();

/* --- Tiroir de navigation (mobile) --- */
(function () {
  const btnBurger = document.getElementById('nav-burger');
  const tiroir    = document.getElementById('nav-tiroir');
  const fondTiroir = document.getElementById('nav-tiroir-fond');
  const btnFermer = document.getElementById('nav-tiroir-fermer');

  if (!btnBurger || !tiroir) return;

  function ouvrir() {
    tiroir.classList.add('ouvert');
    btnBurger.classList.add('ouvert');
    btnBurger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function fermer() {
    tiroir.classList.remove('ouvert');
    btnBurger.classList.remove('ouvert');
    btnBurger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  btnBurger.addEventListener('click', ouvrir);
  if (btnFermer)   btnFermer.addEventListener('click', fermer);
  if (fondTiroir)  fondTiroir.addEventListener('click', fermer);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && tiroir.classList.contains('ouvert')) fermer();
  });
})();

document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('.footer__ticker-piste').forEach((piste) => {
    if (piste.dataset.dupliquee === 'true') return;

    const elements = Array.from(piste.children);
    elements.forEach((element) => {
      const clone = element.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      piste.appendChild(clone);
    });

    piste.dataset.dupliquee = 'true';
  });

  const observeur = new IntersectionObserver((entrees) => {
    entrees.forEach((entree) => {
      if (entree.isIntersecting) {
        entree.target.classList.add('visible');
        observeur.unobserve(entree.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(
    '.histoire__entete, .histoire__grille, .histoire__chiffres, .avis__entete, .avis__grille'
  ).forEach((el) => observeur.observe(el));

});
