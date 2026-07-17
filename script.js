(function () {
  "use strict";

  /* ---------------------------------------------------
     Mobile navigation
  --------------------------------------------------- */
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      const isOpen = mainNav.classList.toggle("open");
      navToggle.classList.toggle("open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------------------------------------------
     FAQ accordion
  --------------------------------------------------- */
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(function (item) {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", function () {
      const isOpen = question.getAttribute("aria-expanded") === "true";

      // close all others (single-open accordion)
      faqItems.forEach(function (other) {
        if (other !== item) {
          other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
          other.querySelector(".faq-answer").style.maxHeight = null;
        }
      });

      question.setAttribute("aria-expanded", String(!isOpen));
      answer.style.maxHeight = isOpen ? null : answer.scrollHeight + "px";
    });
  });

  /* ---------------------------------------------------
     Service showcase — WhatsApp deep links
  --------------------------------------------------- */
  const WHATSAPP_NUMBER = "5598992209189";

  document.querySelectorAll(".service-card[data-service]").forEach(function (card) {
    const service = card.getAttribute("data-service");
    const msg = "Olá! Vim pelo site e gostaria de saber mais sobre o crédito para " + service + ".";
    card.href = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg);
  });

  /* ---------------------------------------------------
     Currency helpers
  --------------------------------------------------- */
  const brl = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const brlCents = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  // Estimated monthly rate used purely for illustrative simulation purposes.
  const MONTHLY_RATE = 0.018;

  function calcInstallment(principal, months) {
    const i = MONTHLY_RATE;
    const factor = i / (1 - Math.pow(1 + i, -months));
    return principal * factor;
  }

  function updateSliderFill(input) {
    const min = Number(input.min);
    const max = Number(input.max);
    const val = Number(input.value);
    const pct = ((val - min) / (max - min)) * 100;
    input.style.setProperty("--fill", pct + "%");
  }

  /* ---------------------------------------------------
     Hero mini simulator
  --------------------------------------------------- */
  const heroValor = document.getElementById("heroValor");
  const heroPrazo = document.getElementById("heroPrazo");
  const heroValorDisplay = document.getElementById("heroValorDisplay");
  const heroPrazoDisplay = document.getElementById("heroPrazoDisplay");
  const heroParcela = document.getElementById("heroParcela");

  function updateHeroSim() {
    if (!heroValor || !heroPrazo) return;
    const valor = Number(heroValor.value);
    const prazo = Number(heroPrazo.value);
    const parcela = calcInstallment(valor, prazo);

    heroValorDisplay.textContent = brl.format(valor);
    heroPrazoDisplay.textContent = prazo + "x";
    heroParcela.textContent = brlCents.format(parcela);

    updateSliderFill(heroValor);
    updateSliderFill(heroPrazo);
  }

  if (heroValor && heroPrazo) {
    heroValor.addEventListener("input", updateHeroSim);
    heroPrazo.addEventListener("input", updateHeroSim);
    updateHeroSim();
  }

  /* ---------------------------------------------------
     Full simulator section
  --------------------------------------------------- */
  const simValor = document.getElementById("simValor");
  const simPrazo = document.getElementById("simPrazo");
  const simTipo = document.getElementById("simTipo");
  const simValorDisplay = document.getElementById("simValorDisplay");
  const simPrazoDisplay = document.getElementById("simPrazoDisplay");
  const simParcela = document.getElementById("simParcela");
  const simTotal = document.getElementById("simTotal");
  const simWhatsapp = document.getElementById("simWhatsapp");

  function updateFullSim() {
    if (!simValor || !simPrazo) return;
    const valor = Number(simValor.value);
    const prazo = Number(simPrazo.value);
    const parcela = calcInstallment(valor, prazo);
    const total = parcela * prazo;

    simValorDisplay.textContent = brl.format(valor);
    simPrazoDisplay.textContent = prazo + " meses";
    simParcela.textContent = brlCents.format(parcela);
    simTotal.textContent = brlCents.format(total);

    updateSliderFill(simValor);
    updateSliderFill(simPrazo);

    if (simWhatsapp && simTipo) {
      const msg =
        "Olá! Fiz uma simulação no site e gostaria de saber mais sobre o " +
        simTipo.value +
        ". Valor desejado: " +
        brl.format(valor) +
        ", em " +
        prazo +
        " parcelas de aproximadamente " +
        brlCents.format(parcela) +
        ".";
      simWhatsapp.href = "https://wa.me/5598992209189?text=" + encodeURIComponent(msg);
    }
  }

  if (simValor && simPrazo) {
    simValor.addEventListener("input", updateFullSim);
    simPrazo.addEventListener("input", updateFullSim);
    if (simTipo) simTipo.addEventListener("change", updateFullSim);
    updateFullSim();
  }
})();