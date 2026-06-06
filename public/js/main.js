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
