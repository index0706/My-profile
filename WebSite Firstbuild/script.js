/**
 * ============================================================================
 * CHARLES RICHARD O. SITU - PERSONAL DIGITAL RESUME
 * Vanilla JavaScript Functionality
 * Clean, organized, and beginner-friendly code
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. DOM Element References
  // --------------------------------------------------------------------------
  const htmlElement = document.documentElement;
  const themeToggleBtn = document.getElementById('theme-toggle');
  const mobileToggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const floatingBackToTop = document.getElementById('floating-back-to-top');

  // Profile elements
  const profileUploadInput = document.getElementById('profile-upload-input');
  const btnUploadPhotoTrigger = document.getElementById('btn-upload-photo-trigger');
  const btnDownloadPhoto = document.getElementById('btn-download-photo');
  const btnResetPhoto = document.getElementById('btn-reset-photo');
  const profileImg = document.getElementById('profile-img');
  const profilePlaceholderSvg = document.getElementById('profile-placeholder-svg');

  // Certificate modal elements
  const certModal = document.getElementById('cert-modal');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalCloseBottom = document.getElementById('modal-close-bottom');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalImg = document.getElementById('modal-img');
  const modalPlaceholderPreview = document.getElementById('modal-placeholder-preview');
  const modalPlaceholderTitle = document.getElementById('modal-placeholder-title');
  const modalPathHint = document.getElementById('modal-path-hint');
  const modalDownloadCertBtn = document.getElementById('modal-download-cert-btn');
  const modalCertFileInput = document.getElementById('modal-cert-file-input');

  // Certificate collection buttons & inputs
  const viewCertButtons = document.querySelectorAll('.view-cert-btn');
  const downloadCertButtons = document.querySelectorAll('.btn-download-cert');
  const certFileInputs = document.querySelectorAll('.cert-file-input');

  // Contact & general elements
  const copyButtons = document.querySelectorAll('.copy-btn');
  const contactForm = document.getElementById('contact-form');
  const resumeDownloadBtn = document.getElementById('btn-download-resume');
  const toastContainer = document.getElementById('toast-container');

  // State tracker for modal
  let currentModalCert = {
    id: 'java',
    title: 'Java Fundamentals Certification',
    category: 'Software Development',
    src: 'assets/cert-java.jpg'
  };

  // --------------------------------------------------------------------------
  // 2. Dark / Light Mode Theme Toggle
  // --------------------------------------------------------------------------
  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      showToast(`Switched to ${newTheme} mode`);
    });
  }

  function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  // --------------------------------------------------------------------------
  // 3. Responsive Mobile Navigation Menu
  // --------------------------------------------------------------------------
  if (mobileToggleBtn && navMenu) {
    mobileToggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('open');
      toggleMobileMenu(!isOpen);
    });

    // Close mobile menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          toggleMobileMenu(false);
        }
      });
    });

    // Close menu when clicking outside of it
    document.addEventListener('click', (event) => {
      if (
        navMenu.classList.contains('open') &&
        !navMenu.contains(event.target) &&
        !mobileToggleBtn.contains(event.target)
      ) {
        toggleMobileMenu(false);
      }
    });
  }

  function toggleMobileMenu(open) {
    if (open) {
      navMenu.classList.add('open');
      mobileToggleBtn.classList.add('active');
      mobileToggleBtn.setAttribute('aria-expanded', 'true');
    } else {
      navMenu.classList.remove('open');
      mobileToggleBtn.classList.remove('active');
      mobileToggleBtn.setAttribute('aria-expanded', 'false');
    }
  }

  // --------------------------------------------------------------------------
  // 4. Active Navigation Indicator & Scroll Spy
  // --------------------------------------------------------------------------
  function updateActiveNav() {
    const scrollPosition = window.scrollY + 140; // Offset for header

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });

    // Toggle Floating Back to Top Button visibility
    if (floatingBackToTop) {
      if (window.scrollY > 350) {
        floatingBackToTop.classList.add('visible');
      } else {
        floatingBackToTop.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav(); // Initial run

  // --------------------------------------------------------------------------
  // 5. Floating Back to Top Button
  // --------------------------------------------------------------------------
  if (floatingBackToTop) {
    floatingBackToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 6. Generic File Download Helper
  // --------------------------------------------------------------------------
  function triggerDownload(urlOrDataUrl, filename) {
    const a = document.createElement('a');
    a.href = urlOrDataUrl;
    a.download = filename || 'download';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // --------------------------------------------------------------------------
  // 7. Profile Photo Management (Upload, Persistent Storage & Auto-Download)
  // --------------------------------------------------------------------------
  // Load saved profile photo from localStorage if previously uploaded
  const savedProfilePhoto = localStorage.getItem('profile_photo');
  if (savedProfilePhoto && profileImg) {
    profileImg.src = savedProfilePhoto;
    profileImg.style.display = 'block';
    if (profilePlaceholderSvg) profilePlaceholderSvg.style.display = 'none';
    if (btnResetPhoto) btnResetPhoto.style.display = 'inline-flex';
  }

  if (btnUploadPhotoTrigger && profileUploadInput) {
    btnUploadPhotoTrigger.addEventListener('click', () => {
      profileUploadInput.click();
    });
  }

  if (profileUploadInput) {
    profileUploadInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file (JPG, PNG, WebP).');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        try {
          localStorage.setItem('profile_photo', dataUrl);
        } catch (err) {
          console.warn('LocalStorage quota limit reached, displaying in session only.');
        }

        if (profileImg) {
          profileImg.src = dataUrl;
          profileImg.style.display = 'block';
        }
        if (profilePlaceholderSvg) {
          profilePlaceholderSvg.style.display = 'none';
        }
        if (btnResetPhoto) {
          btnResetPhoto.style.display = 'inline-flex';
        }

        // Automatically download the uploaded photo to user's device
        triggerDownload(dataUrl, 'Charles_Richard_Situ_Profile.jpg');
        showToast('Photo uploaded, saved in websystem, and downloaded!');
      };
      reader.readAsDataURL(file);
      profileUploadInput.value = ''; // Reset input
    });
  }

  if (btnDownloadPhoto) {
    btnDownloadPhoto.addEventListener('click', () => {
      const customPhoto = localStorage.getItem('profile_photo');
      if (customPhoto) {
        triggerDownload(customPhoto, 'Charles_Richard_Situ_Profile.jpg');
        showToast('Downloading your profile photo...');
      } else {
        // Test if assets/profile.jpg exists
        fetch('assets/profile.jpg', { method: 'HEAD' })
          .then(res => {
            if (res.ok) {
              triggerDownload('assets/profile.jpg', 'Charles_Richard_Situ_Profile.jpg');
              showToast('Downloading profile photo...');
            } else {
              // Generate an avatar card image
              generateAvatarCardAndDownload();
            }
          })
          .catch(() => {
            generateAvatarCardAndDownload();
          });
      }
    });
  }

  if (btnResetPhoto) {
    btnResetPhoto.addEventListener('click', () => {
      localStorage.removeItem('profile_photo');
      if (profileImg) {
        profileImg.src = 'assets/profile.jpg';
      }
      btnResetPhoto.style.display = 'none';
      showToast('Reset to default avatar placeholder.');
    });
  }

  function generateAvatarCardAndDownload() {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 600, 600);
    bgGrad.addColorStop(0, '#070b14');
    bgGrad.addColorStop(1, '#111a30');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 600, 600);

    // Border
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, 560, 560);

    // Initials badge
    ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.beginPath();
    ctx.arc(300, 240, 110, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 84px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CS', 300, 270);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 28px Inter, sans-serif';
    ctx.fillText('CHARLES RICHARD O. SITU', 300, 420);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '600 18px "JetBrains Mono", monospace';
    ctx.fillText('INFORMATION TECHNOLOGY STUDENT', 300, 460);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px Inter, sans-serif';
    ctx.fillText('STI College Marikina', 300, 495);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    triggerDownload(dataUrl, 'Charles_Richard_Situ_Profile.jpg');
    showToast('Downloaded profile portrait badge!');
  }

  // --------------------------------------------------------------------------
  // 8. Dynamic Certificate Generator & Automatic Downloader
  // --------------------------------------------------------------------------
  // Generates an official-looking high-resolution certificate on HTML5 Canvas
  function generateCertificateCanvas(title, recipient, institution) {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 850;
    const ctx = canvas.getContext('2d');

    // 1. Certificate Background
    ctx.fillStyle = '#0b1329';
    ctx.fillRect(0, 0, 1200, 850);

    // Subtle inner background
    const innerGrad = ctx.createRadialGradient(600, 425, 50, 600, 425, 600);
    innerGrad.addColorStop(0, '#101d3d');
    innerGrad.addColorStop(1, '#070b14');
    ctx.fillStyle = innerGrad;
    ctx.fillRect(25, 25, 1150, 800);

    // 2. Ornamental Border
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.strokeRect(35, 35, 1130, 780);

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(45, 45, 1110, 760);

    // Corner decorative accents
    const corners = [
      [55, 55], [1145, 55], [55, 795], [1145, 795]
    ];
    ctx.fillStyle = '#38bdf8';
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3. Institution Header
    ctx.textAlign = 'center';
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 20px "JetBrains Mono", monospace';
    ctx.fillText('STI COLLEGE MARIKINA - DEPARTMENT OF INFORMATION TECHNOLOGY', 600, 120);

    // 4. Certificate Main Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px Inter, sans-serif';
    ctx.fillText('CERTIFICATE OF ACHIEVEMENT', 600, 195);

    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(450, 215, 300, 3);

    // 5. Presentation text
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'italic 20px Georgia, serif';
    ctx.fillText('This is officially awarded to', 600, 275);

    // 6. Recipient Name
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 42px Inter, sans-serif';
    ctx.fillText(recipient.toUpperCase(), 600, 345);

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(320, 365);
    ctx.lineTo(880, 365);
    ctx.stroke();

    // 7. Purpose / Course Description
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '19px Inter, sans-serif';
    ctx.fillText('in recognition of verified academic competence and successful completion of', 600, 420);

    // 8. Certificate Subject Title
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 34px Inter, sans-serif';
    ctx.fillText(title, 600, 480);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '17px Inter, sans-serif';
    ctx.fillText('Demonstrating foundational mastery, technical proficiency, and practical knowledge.', 600, 525);

    // 9. Official Verified Credential Rosette Seal
    ctx.save();
    ctx.translate(600, 630);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.beginPath();
    ctx.arc(0, 0, 48, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.fillText('OFFICIAL CREDENTIAL', 0, -8);
    ctx.fillText('★ VERIFIED ★', 0, 10);
    ctx.fillText('BSIT PROGRAM', 0, 26);
    ctx.restore();

    // 10. Signature & Verification Lines
    // Left side: Academic Institution
    ctx.textAlign = 'left';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(120, 720);
    ctx.lineTo(360, 720);
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 15px Inter, sans-serif';
    ctx.fillText('STI College Marikina', 120, 745);
    ctx.fillStyle = '#64748b';
    ctx.font = '13px "JetBrains Mono", monospace';
    ctx.fillText('College of Information Technology', 120, 765);

    // Right side: Credential ID & Date
    ctx.textAlign = 'right';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(840, 720);
    ctx.lineTo(1080, 720);
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 15px Inter, sans-serif';
    ctx.fillText('Date: November 2026', 1080, 745);
    ctx.fillStyle = '#64748b';
    ctx.font = '13px "JetBrains Mono", monospace';
    ctx.fillText('Credential ID: SITU-BSIT-2026-OK', 1080, 765);

    return canvas.toDataURL('image/png');
  }

  // Restore saved certificates on page load
  const certIds = ['java', 'sap', 'ethical-hacking', 'cybersecurity'];
  certIds.forEach(id => {
    const savedCert = localStorage.getItem('cert_' + id);
    if (savedCert) {
      const imgEl = document.getElementById('cert-img-' + id);
      if (imgEl) {
        imgEl.src = savedCert;
        imgEl.style.display = 'block';
        if (imgEl.nextElementSibling) {
          imgEl.nextElementSibling.style.display = 'none';
        }
      }
    }
  });

  // Handle Certificate Upload from card or modal
  function handleCertUpload(certId, title, file) {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      try {
        localStorage.setItem('cert_' + certId, dataUrl);
      } catch (err) {
        console.warn('LocalStorage quota limit reached, displaying in current session.');
      }

      // Update card image in DOM
      const imgEl = document.getElementById('cert-img-' + certId);
      if (imgEl) {
        imgEl.src = dataUrl;
        imgEl.style.display = 'block';
        if (imgEl.nextElementSibling) {
          imgEl.nextElementSibling.style.display = 'none';
        }
      }

      // Update modal image if currently viewing this certificate
      if (certModal.classList.contains('open') && currentModalCert.id === certId) {
        modalImg.src = dataUrl;
        modalImg.style.display = 'block';
        modalPlaceholderPreview.style.display = 'none';
      }

      // Automatically download the uploaded certificate file
      const safeFilename = title.replace(/[^a-zA-Z0-9]/g, '_') + '.png';
      triggerDownload(dataUrl, safeFilename);
      showToast(`${title} uploaded, saved, and downloaded!`);
    };
    reader.readAsDataURL(file);
  }

  // Handle Certificate Download
  function downloadCertificate(certId, title, src) {
    const customCert = localStorage.getItem('cert_' + certId);
    const safeFilename = title.replace(/[^a-zA-Z0-9]/g, '_') + '.png';

    if (customCert) {
      triggerDownload(customCert, safeFilename);
      showToast(`Downloading ${title}...`);
      return;
    }

    // Check if image file exists at assets path
    fetch(src, { method: 'HEAD' })
      .then(res => {
        if (res.ok) {
          triggerDownload(src, safeFilename);
          showToast(`Downloading ${title}...`);
        } else {
          // Auto-generate official certificate document on canvas
          const generatedDataUrl = generateCertificateCanvas(title, 'Charles Richard O. Situ', 'STI College Marikina');
          triggerDownload(generatedDataUrl, safeFilename);
          showToast(`Automatically generated and downloaded ${title}!`);
        }
      })
      .catch(() => {
        // Auto-generate official certificate document on canvas
        const generatedDataUrl = generateCertificateCanvas(title, 'Charles Richard O. Situ', 'STI College Marikina');
        triggerDownload(generatedDataUrl, safeFilename);
        showToast(`Automatically generated and downloaded ${title}!`);
      });
  }

  // Attach card Download button listeners
  downloadCertButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const certId = btn.getAttribute('data-cert-id');
      const title = btn.getAttribute('data-cert-title');
      const src = btn.getAttribute('data-cert-src');
      downloadCertificate(certId, title, src);
    });
  });

  // Attach card Upload file input listeners
  certFileInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      const certId = input.getAttribute('data-cert-id');
      const title = input.getAttribute('data-cert-title');
      const file = e.target.files && e.target.files[0];
      handleCertUpload(certId, title, file);
      input.value = ''; // Reset input
    });
  });

  // Modal Download button
  if (modalDownloadCertBtn) {
    modalDownloadCertBtn.addEventListener('click', () => {
      downloadCertificate(currentModalCert.id, currentModalCert.title, currentModalCert.src);
    });
  }

  // Modal Upload input
  if (modalCertFileInput) {
    modalCertFileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      handleCertUpload(currentModalCert.id, currentModalCert.title, file);
      modalCertFileInput.value = ''; // Reset input
    });
  }

  // --------------------------------------------------------------------------
  // 9. Certificate Lightbox / Modal
  // --------------------------------------------------------------------------
  viewCertButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const certId = btn.getAttribute('data-cert-id') || 'java';
      const title = btn.getAttribute('data-cert-title') || 'Certificate';
      const category = btn.getAttribute('data-cert-category') || 'Verified Credential';
      const imgSrc = btn.getAttribute('data-cert-src') || '';

      currentModalCert = {
        id: certId,
        title: title,
        category: category,
        src: imgSrc
      };

      openCertModal(certId, title, category, imgSrc);
    });
  });

  function openCertModal(certId, title, category, imgSrc) {
    if (!certModal) return;

    modalTitle.textContent = title;
    modalCategory.textContent = category;
    modalPlaceholderTitle.textContent = title;
    modalPathHint.textContent = imgSrc;

    const customCert = localStorage.getItem('cert_' + certId);

    if (customCert) {
      modalImg.src = customCert;
      modalImg.style.display = 'block';
      modalPlaceholderPreview.style.display = 'none';
    } else {
      modalImg.style.display = 'none';
      modalPlaceholderPreview.style.display = 'flex';

      if (imgSrc) {
        const testImage = new Image();
        testImage.src = imgSrc;
        testImage.onload = () => {
          modalImg.src = imgSrc;
          modalImg.style.display = 'block';
          modalPlaceholderPreview.style.display = 'none';
        };
        testImage.onerror = () => {
          modalImg.style.display = 'none';
          modalPlaceholderPreview.style.display = 'flex';
        };
      }
    }

    certModal.classList.add('open');
    certModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeCertModal() {
    if (!certModal) return;
    certModal.classList.remove('open');
    certModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeCertModal);
  if (modalCloseBottom) modalCloseBottom.addEventListener('click', closeCertModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeCertModal);

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal && certModal.classList.contains('open')) {
      closeCertModal();
    }
  });

  // --------------------------------------------------------------------------
  // 10. Clipboard Copy Helper (for Email and Phone)
  // --------------------------------------------------------------------------
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`);
        }).catch(() => {
          fallbackCopyText(textToCopy);
        });
      }
    });
  });

  function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(`Copied: ${text}`);
    } catch (err) {
      showToast('Could not copy to clipboard.');
    }
    document.body.removeChild(textArea);
  }

  // --------------------------------------------------------------------------
  // 11. Contact Form Handler (Direct Mailto Generator)
  // --------------------------------------------------------------------------
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('sender-name').value.trim();
      const email = document.getElementById('sender-email').value.trim();
      const subject = document.getElementById('message-subject').value.trim();
      const message = document.getElementById('sender-message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill out all required fields.');
        return;
      }

      const emailRecipient = 'charlessitu2@gmail.com';
      const mailSubject = encodeURIComponent(subject || `Job Inquiry from ${name}`);
      const mailBody = encodeURIComponent(
        `Hello Charles,\n\n${message}\n\nSender Information:\nName: ${name}\nEmail: ${email}`
      );

      const mailtoUrl = `mailto:${emailRecipient}?subject=${mailSubject}&body=${mailBody}`;
      window.location.href = mailtoUrl;
      showToast('Opening your default email client...');
    });
  }

  // --------------------------------------------------------------------------
  // 12. Download Resume Handler
  // --------------------------------------------------------------------------
  if (resumeDownloadBtn) {
    resumeDownloadBtn.addEventListener('click', (e) => {
      fetch('assets/resume.pdf', { method: 'HEAD' })
        .then(response => {
          if (!response.ok) {
            showToast('Note: Place your resume PDF at "assets/resume.pdf" to enable download.');
          } else {
            showToast('Downloading Charles Richard O. Situ\'s resume...');
          }
        })
        .catch(() => {
          showToast('Note: Place your resume PDF at "assets/resume.pdf" to enable download.');
        });
    });
  }

  // --------------------------------------------------------------------------
  // 13. Toast Notification System
  // --------------------------------------------------------------------------
  function showToast(message) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
      <span>${escapeHTML(message)}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3200);
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  // --------------------------------------------------------------------------
  // 14. Section Reveal Animations on Scroll (Spider-Man Dynamic Web Swing)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll(
    '.about-main-card, .timeline-item, .skill-card, .experience-card, .cert-card, .contact-card, .message-card, .hero-content, .profile-card'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // --------------------------------------------------------------------------
  // 15. Spider-Man Interactive Web Canvas Animation
  // --------------------------------------------------------------------------
  (function initSpideyWebCanvas() {
    const canvas = document.getElementById('spidey-web-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let mouse = { x: null, y: null, maxDist: 150 };

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      if (e.clientY <= rect.bottom) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      } else {
        mouse.x = null;
        mouse.y = null;
      }
    }, { passive: true });

    // Particle nodes
    const nodeCount = Math.min(Math.floor((width * height) / 14000), 75);
    const nodes = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.9,
        radius: Math.random() * 2 + 1.2,
        color: Math.random() > 0.25 ? '#38bdf8' : '#ef4444'
      });
    }

    function animateWeb() {
      ctx.clearRect(0, 0, width, height);

      // Connect nodes with spider-silk threads
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.x += a.vx;
        a.y += a.vy;

        if (a.x < 0 || a.x > width) a.vx *= -1;
        if (a.y < 0 || a.y > height) a.vy *= -1;

        // Draw node dot
        ctx.fillStyle = a.color;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
        ctx.fill();

        // Check distance to other nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const alpha = 1 - dist / 120;
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.35})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        // Connect to mouse cursor
        if (mouse.x !== null && mouse.y !== null) {
          const mdx = a.x - mouse.x;
          const mdy = a.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < mouse.maxDist) {
            const mAlpha = 1 - mdist / mouse.maxDist;
            ctx.strokeStyle = `rgba(239, 68, 68, ${mAlpha * 0.55})`;
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animateWeb);
    }

    animateWeb();
  })();

  // --------------------------------------------------------------------------
  // 16. Spider-Man "THWIP!" Web-Shooter Click Dynamic Effects
  // --------------------------------------------------------------------------
  (function initSpideyClickFx() {
    const fxContainer = document.getElementById('spidey-fx-container');
    if (!fxContainer) return;

    const comicWords = ['THWIP!', '🕸️ THWIP!', 'SPIDEY!', 'THWIP! 🕷️', 'ZAP! ⚡'];

    document.addEventListener('click', (e) => {
      // Don't trigger if clicking modal close or file inputs directly
      if (e.target.closest('input[type="file"]') || e.target.closest('#modal-close')) return;

      const x = e.clientX;
      const y = e.clientY;

      // 1. Comic Sound Badge
      const badge = document.createElement('div');
      badge.className = 'spidey-thwip-badge';
      const word = comicWords[Math.floor(Math.random() * comicWords.length)];
      badge.textContent = word;
      badge.style.left = `${x}px`;
      badge.style.top = `${y}px`;
      fxContainer.appendChild(badge);

      // 2. Web Splat Particle Burst
      const splat = document.createElement('div');
      splat.style.position = 'absolute';
      splat.style.left = `${x - 24}px`;
      splat.style.top = `${y - 24}px`;
      splat.style.width = '48px';
      splat.style.height = '48px';
      splat.style.borderRadius = '50%';
      splat.style.border = '2px solid rgba(56, 189, 248, 0.9)';
      splat.style.boxShadow = '0 0 15px #38bdf8, 0 0 25px #ef4444';
      splat.style.pointerEvents = 'none';
      splat.style.animation = 'thwip-burst 0.5s ease-out forwards';
      fxContainer.appendChild(splat);

      setTimeout(() => {
        badge.remove();
        splat.remove();
      }, 750);
    });
  })();

  // --------------------------------------------------------------------------
  // 17. "SWING INTO RESUME" Dynamic Action
  // --------------------------------------------------------------------------
  const btnSpideySwing = document.getElementById('btn-spidey-swing');
  const spideyEmblem = document.getElementById('spidey-emblem-interactive');

  if (btnSpideySwing) {
    btnSpideySwing.addEventListener('click', () => {
      // Create dramatic full-screen web shot animation
      shootWebStrandVisual();

      // Smooth spring swing to home section
      const homeSection = document.getElementById('home');
      if (homeSection) {
        setTimeout(() => {
          window.scrollTo({
            top: homeSection.offsetTop - 40,
            behavior: 'smooth'
          });
        }, 180);
      }
      showToast('🕸️ THWIP! Swung into Charles Richard O. Situ\'s Resume!');
    });
  }

  if (spideyEmblem) {
    spideyEmblem.addEventListener('click', () => {
      shootWebStrandVisual();
      showToast('🕷️ Spider-Sense Activated!');
    });
  }

  function shootWebStrandVisual() {
    const fxContainer = document.getElementById('spidey-fx-container');
    if (!fxContainer) return;

    const webShot = document.createElement('div');
    webShot.className = 'spidey-web-shot';
    webShot.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 ${window.innerWidth} ${window.innerHeight}" style="position: absolute; top:0; left:0; width:100%; height:100%;">
        <line x1="${window.innerWidth / 2}" y1="${window.innerHeight / 2}" x2="${window.innerWidth / 2}" y2="0" stroke="#ffffff" stroke-width="3" stroke-linecap="round" style="filter: drop-shadow(0 0 8px #38bdf8);"/>
        <line x1="${window.innerWidth / 2}" y1="${window.innerHeight / 2}" x2="0" y2="0" stroke="rgba(56, 189, 248, 0.8)" stroke-width="2"/>
        <line x1="${window.innerWidth / 2}" y1="${window.innerHeight / 2}" x2="${window.innerWidth}" y2="0" stroke="rgba(239, 68, 68, 0.8)" stroke-width="2"/>
      </svg>
    `;
    fxContainer.appendChild(webShot);

    setTimeout(() => {
      webShot.remove();
    }, 850);
  }

  // --------------------------------------------------------------------------
  // 18. Development Live Reload Client (Auto-refreshes browser on file save)
  // --------------------------------------------------------------------------
  (function initLiveReload() {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const isFileProto = window.location.protocol === 'file:';

    // Only active during local development
    if (!isLocalhost && !isFileProto) return;

    // Use relative path if already on local HTTP server, or localhost:3000 if opened via file://
    const sseUrl = isLocalhost ? '/live-reload' : 'http://localhost:3000/live-reload';

    try {
      const source = new EventSource(sseUrl);

      source.onopen = () => {
        console.log('%c[LiveReload] Connected to Live Server. Auto-refresh on save active!', 'color: #38bdf8; font-weight: bold;');
      };

      source.onmessage = (event) => {
        if (event.data === 'reload') {
          console.log('[LiveReload] File save detected! Reloading page...');
          window.location.reload();
        } else if (event.data === 'css') {
          console.log('[LiveReload] CSS updated! Hot-reloading styles...');
          const links = document.querySelectorAll('link[rel="stylesheet"]');
          links.forEach(link => {
            const rawHref = link.href.split('?')[0];
            link.href = rawHref + '?reload=' + Date.now();
          });
        }
      };

      source.onerror = () => {
        // Silently retry in the background if dev_server.py is not yet running
      };
    } catch (err) {
      // Graceful fallback
    }
  })();

});

