/* DIFERENCIAIS ACCORDION */

const differentialItems = document.querySelectorAll(".differential-item");

function rotateDifferentialIcon(targetItem, opening) {
  const icon = targetItem.querySelector(".differential-arrow img");

  if (!icon) return;

  icon.getAnimations().forEach(animation => animation.cancel());
  icon.animate(
    opening
      ? [{ transform:"rotate(0deg)" }, { transform:"rotate(180deg)" }]
      : [{ transform:"rotate(180deg)" }, { transform:"rotate(0deg)" }],
    {
      duration:650,
      easing:"cubic-bezier(.22, 1, .36, 1)"
    }
  );
}

differentialItems.forEach(item => {

  const questionBtn = item.querySelector(".differential-question");

  questionBtn.addEventListener("click", () => {

    const isActive = item.classList.contains("active");

    differentialItems.forEach(otherItem => {
      if (otherItem.classList.contains("active")) {
        rotateDifferentialIcon(otherItem, false);
      }

      otherItem.classList.remove("active");
      otherItem.querySelector(".differential-question").setAttribute("aria-expanded", "false");
    });

    if (!isActive) {
      item.classList.add("active");
      questionBtn.setAttribute("aria-expanded", "true");
      rotateDifferentialIcon(item, true);
    }

  });

});

/* ESCUDOS ALEATÓRIOS AO REDOR DO CELULAR */

const securityIcons = [...document.querySelectorAll(".security-icon")];
let lastSecurityIcon = -1;

function pulseRandomSecurityIcon() {
  if (!securityIcons.length) return;

  let nextIcon;

  do {
    nextIcon = Math.floor(Math.random() * securityIcons.length);
  } while (securityIcons.length > 1 && nextIcon === lastSecurityIcon);

  lastSecurityIcon = nextIcon;
  const icon = securityIcons[nextIcon];

  icon.classList.add("is-pulsing");

  icon.addEventListener("animationend", () => {
    icon.classList.remove("is-pulsing");

    const randomPause = 150 + Math.random() * 450;
    window.setTimeout(pulseRandomSecurityIcon, randomPause);
  }, { once:true });
}

pulseRandomSecurityIcon();

/* MENU PRINCIPAL */

const header = document.querySelector(".site-header");
const headerToggle = document.querySelector(".site-header-toggle");
const headerNav = document.querySelector(".site-header-nav");
const headerDropdown = document.querySelector(".site-header-dropdown");
const headerDropdownToggle = document.querySelector(".site-header-dropdown-toggle");

function closeHeaderDropdown() {
  if (!headerDropdown || !headerDropdownToggle) return;
  headerDropdown.classList.remove("is-open");
  headerDropdownToggle.setAttribute("aria-expanded", "false");
}

function closeHeaderMenu() {
  if (!header || !headerToggle) return;
  header.classList.remove("menu-open");
  headerToggle.setAttribute("aria-expanded", "false");
  headerToggle.setAttribute("aria-label", "Abrir menu");
  closeHeaderDropdown();
}

if (header && headerToggle && headerNav) {
  const updateHeaderOnScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  };

  updateHeaderOnScroll();
  window.addEventListener("scroll", updateHeaderOnScroll, { passive:true });

  headerToggle.addEventListener("click", () => {
    const opening = !header.classList.contains("menu-open");
    header.classList.toggle("menu-open", opening);
    headerToggle.setAttribute("aria-expanded", String(opening));
    headerToggle.setAttribute("aria-label", opening ? "Fechar menu" : "Abrir menu");
  });

  headerNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeHeaderMenu);
  });

  if (headerDropdown && headerDropdownToggle) {
    headerDropdownToggle.addEventListener("click", () => {
      const opening = !headerDropdown.classList.contains("is-open");
      headerDropdown.classList.toggle("is-open", opening);
      headerDropdownToggle.setAttribute("aria-expanded", String(opening));
    });

    document.addEventListener("click", event => {
      if (!headerDropdown.contains(event.target)) closeHeaderDropdown();
    });
  }

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeHeaderDropdown();
      closeHeaderMenu();
    }
  });
}

/* BRILHO DO PLANO EM DESTAQUE */

const featuredPlan = document.querySelector(".plan-card-featured");

if (featuredPlan) {
  const shine = document.createElement("span");
  shine.className = "plan-shine";
  shine.setAttribute("aria-hidden", "true");
  featuredPlan.appendChild(shine);
  let shineAnimation;

  function playFeaturedPlanShine() {
    if (shineAnimation) shineAnimation.cancel();

    shineAnimation = shine.animate(
      [
        { transform:"translateX(-180%) skewX(-14deg)", opacity:0 },
        { transform:"translateX(-120%) skewX(-14deg)", opacity:.85, offset:.16 },
        { transform:"translateX(255%) skewX(-14deg)", opacity:.85, offset:.84 },
        { transform:"translateX(330%) skewX(-14deg)", opacity:0 }
      ],
      {
        duration:1900,
        easing:"cubic-bezier(.45, 0, .2, 1)",
        fill:"none"
      }
    );
  }

  function stopFeaturedPlanShine() {
    if (!shineAnimation) return;
    shineAnimation.cancel();
    shineAnimation = null;
  }

  featuredPlan.addEventListener("mouseenter", playFeaturedPlanShine);
  featuredPlan.addEventListener("mouseleave", stopFeaturedPlanShine);
  featuredPlan.addEventListener("focusin", playFeaturedPlanShine);
  featuredPlan.addEventListener("focusout", stopFeaturedPlanShine);
}

/* ÍNDICE DA POLÍTICA DE PRIVACIDADE */

const privacyLinks = [...document.querySelectorAll(".privacy-index a")];
const privacySections = privacyLinks
  .map(link => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if (privacyLinks.length && privacySections.length) {
  const setActivePrivacyLink = id => {
    privacyLinks.forEach(link => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", isActive);
      if (isActive && window.innerWidth <= 900) {
        link.scrollIntoView({ behavior:"smooth", block:"nearest", inline:"center" });
      }
    });
  };

  const privacyObserver = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (visible.length) setActivePrivacyLink(visible[0].target.id);
  }, { rootMargin:"-25% 0px -60% 0px", threshold:0 });

  privacySections.forEach(section => privacyObserver.observe(section));
}

/* CANAL DE DENUNCIAS */
const reportForm = document.querySelector("#report-form");
const anonymousReport = document.querySelector("#anonymous-report");

if (reportForm && anonymousReport) {
  const identityInputs = reportForm.querySelectorAll(".report-identity-fields input");
  anonymousReport.addEventListener("change", () => {
    identityInputs.forEach(input => {
      input.disabled = anonymousReport.checked;
      if (anonymousReport.checked) input.value = "";
    });
  });

  reportForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!reportForm.reportValidity()) return;
    const protocol = `PE-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const success = reportForm.querySelector(".report-success");
    success.innerHTML = `<strong>Denúncia registrada.</strong><br>Guarde seu protocolo: ${protocol}`;
    success.hidden = false;
    reportForm.reset();
    identityInputs.forEach(input => { input.disabled = false; });
    success.scrollIntoView({ behavior:"smooth", block:"center" });
  });
}

/* CONTATOS E REDES SOCIAIS */
// Quando o numero estiver definido, informe apenas DDI + DDD + numero (ex.: 5511999999999).
const WHATSAPP_NUMBER = "";

const createWhatsAppUrl = message => {
  const text = encodeURIComponent(message);
  return WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
    : `https://api.whatsapp.com/send?text=${text}`;
};

const pageName = window.location.pathname.split("/").pop() || "index.html";
const pageMessages = {
  "index.html":"Olá! Vim pelo site do Protege Escola e gostaria de saber como tornar minha escola mais segura.",
  "sobre.html":"Olá! Conheci melhor o Protege Escola e gostaria de conversar com a equipe.",
  "como-funciona.html":"Olá! Gostaria de entender melhor como funciona a formação do Protege Escola.",
  "planos.html":"Olá! Gostaria de receber mais informações sobre os planos do Protege Escola.",
  "faq.html":"Olá! Consultei as dúvidas frequentes, mas gostaria de falar com um especialista.",
  "politica-de-privacidade.html":"Olá! Gostaria de falar sobre privacidade e tratamento de dados no Protege Escola.",
  "canal-de-denuncias.html":"Olá! Vim pela página do Canal de Denúncias e gostaria de falar com a equipe."
};

const whatsappButtons = document.querySelectorAll([
  ".site-header-cta",
  ".site-footer-whatsapp",
  ".btn-animated",
  ".btn-diferential",
  ".how-cta",
  ".plan-action a",
  ".specialist-action a[href*='contato']",
  ".privacy-contact a"
].join(","));

whatsappButtons.forEach(link => {
  let message = pageMessages[pageName] || pageMessages["index.html"];
  const planCard = link.closest(".plan-card");
  const planTitle = planCard?.querySelector("h2, h3, .plan-name")?.textContent.trim();
  if (planTitle) message = `Olá! Gostaria de solicitar uma proposta para o ${planTitle} do Protege Escola.`;
  link.href = createWhatsAppUrl(message);
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

document.querySelectorAll(".site-footer-social-links a").forEach(link => {
  const network = link.getAttribute("aria-label");
  if (network === "Instagram") link.href = "https://www.instagram.com/protege_escola/";
  if (network === "LinkedIn") link.href = "https://www.linkedin.com/company/protege-escola/";
  if (network === "WhatsApp") link.href = createWhatsAppUrl("Olá! Vim pelas redes do Protege Escola e gostaria de mais informações.");
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});
