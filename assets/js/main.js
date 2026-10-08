/* ==========================================================================
   MECHCOOL AC CLEANING & HVAC - INTERACTIVE JAVASCRIPT LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. HEADER SCROLL & STICKY BEHAVIOR
  const siteHeader = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });

  // 2. MOBILE NAVIGATION MENU TOGGLE
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggleBtn && navMenu) {
    mobileToggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggleBtn.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('active')) {
          icon.className = 'fas fa-times';
        } else {
          icon.className = 'fas fa-bars';
        }
      }
    });

    // Close menu when clicking nav link on mobile
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = mobileToggleBtn.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      });
    });
  }

  // 3. INTERACTIVE AC SERVICE COST CALCULATOR ENGINE
  let selectedAcType = 'split';
  let baseRates = {
    split: 49,
    window: 39,
    cassette: 69,
    central: 99
  };
  let acNames = {
    split: 'Split AC Deep Wash',
    window: 'Window AC Service',
    cassette: 'Cassette/Ceiling AC',
    central: 'Central HVAC System'
  };
  let unitCount = 2;
  let addOns = {
    antiBacterial: true,
    gasCheck: false,
    outdoorWash: true
  };

  const typeButtons = document.querySelectorAll('.calc-option-btn');
  const unitCountEl = document.getElementById('calc-unit-count');
  const btnDecUnits = document.getElementById('btn-dec-units');
  const btnIncUnits = document.getElementById('btn-inc-units');

  const addonAntiBac = document.getElementById('addon-anti-bac');
  const addonGasCheck = document.getElementById('addon-gas-check');
  const addonOutdoor = document.getElementById('addon-outdoor');

  const summaryAcType = document.getElementById('summary-ac-type');
  const summaryUnitCount = document.getElementById('summary-unit-count');
  const summaryAddons = document.getElementById('summary-addons');
  const summaryTotalPrice = document.getElementById('summary-total-price');
  const calcBookBtn = document.getElementById('calc-book-btn');

  function calculateTotal() {
    let rate = baseRates[selectedAcType] || 49;
    let baseTotal = rate * unitCount;

    let addonTotal = 0;
    let addonList = [];

    if (addOns.antiBacterial) {
      addonTotal += 15 * unitCount;
      addonList.push('Anti-Bacterial');
    }
    if (addOns.gasCheck) {
      addonTotal += 35;
      addonList.push('Gas Check');
    }
    if (addOns.outdoorWash) {
      addonTotal += 20 * unitCount;
      addonList.push('Outdoor Jet Wash');
    }

    let grandTotal = baseTotal + addonTotal;

    // Update summary UI elements
    if (summaryAcType) summaryAcType.textContent = acNames[selectedAcType];
    if (summaryUnitCount) summaryUnitCount.textContent = `${unitCount} Unit${unitCount > 1 ? 's' : ''}`;
    if (summaryAddons) summaryAddons.textContent = addonList.length > 0 ? addonList.join(', ') : 'Standard Clean';
    if (summaryTotalPrice) summaryTotalPrice.textContent = `$${grandTotal}`;

    return grandTotal;
  }

  // AC Type Selector listener
  typeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      typeButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedAcType = btn.dataset.type;
      calculateTotal();
    });
  });

  // Quantity Stepper listeners
  if (btnDecUnits) {
    btnDecUnits.addEventListener('click', () => {
      if (unitCount > 1) {
        unitCount--;
        unitCountEl.textContent = unitCount;
        calculateTotal();
      }
    });
  }

  if (btnIncUnits) {
    btnIncUnits.addEventListener('click', () => {
      if (unitCount < 20) {
        unitCount++;
        unitCountEl.textContent = unitCount;
        calculateTotal();
      }
    });
  }

  // Addon Checkbox Listeners
  if (addonAntiBac) {
    addonAntiBac.addEventListener('change', (e) => {
      addOns.antiBacterial = e.target.checked;
      calculateTotal();
    });
  }
  if (addonGasCheck) {
    addonGasCheck.addEventListener('change', (e) => {
      addOns.gasCheck = e.target.checked;
      calculateTotal();
    });
  }
  if (addonOutdoor) {
    addonOutdoor.addEventListener('change', (e) => {
      addOns.outdoorWash = e.target.checked;
      calculateTotal();
    });
  }

  // Initial Calculation Run
  calculateTotal();

  // Calculator Booking Pre-fill
  if (calcBookBtn) {
    calcBookBtn.addEventListener('click', () => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });

        // Pre-fill form service field
        const serviceSelect = document.getElementById('service-type-select');
        if (serviceSelect) {
          serviceSelect.value = selectedAcType;
        }

        const notesField = document.getElementById('form-notes');
        if (notesField) {
          notesField.value = `Pre-calculated estimate: ${unitCount} unit(s) of ${acNames[selectedAcType]} - Estimated total: $${calculateTotal()}`;
        }
      }
    });
  }

  // 4. ACCORDION FAQ LOGIC
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other open items
      faqItems.forEach(i => {
        i.classList.remove('active');
        const body = i.querySelector('.faq-body');
        if (body) body.style.maxHeight = null;
      });

      // Toggle current item
      if (!isOpen) {
        item.classList.add('active');
        const body = item.querySelector('.faq-body');
        if (body) {
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      }
    });
  });

  // Open the first FAQ item by default
  if (faqItems.length > 0) {
    faqItems[0].classList.add('active');
    const firstBody = faqItems[0].querySelector('.faq-body');
    if (firstBody) {
      firstBody.style.maxHeight = firstBody.scrollHeight + 'px';
    }
  }

  // 5. BOOKING FORM SUBMISSION SIMULATION
  const bookingForm = document.getElementById('booking-form');
  const formSuccessAlert = document.getElementById('form-success-alert');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Request...';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        bookingForm.reset();
        if (submitBtn) {
          submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Service Request Sent!';
          submitBtn.disabled = false;
        }

        if (formSuccessAlert) {
          formSuccessAlert.style.display = 'block';
          formSuccessAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 1200);
    });
  }

});
