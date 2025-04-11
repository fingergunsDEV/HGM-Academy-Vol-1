document.addEventListener('DOMContentLoaded', () => {
  // Theme switcher functionality
  const themeBtns = document.querySelectorAll('.theme-btn');
  
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('preferred-theme', theme);
    
    themeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === theme);
    });
  }
  
  // Initialize theme
  const savedTheme = localStorage.getItem('preferred-theme') || 'light';
  setTheme(savedTheme);
  
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setTheme(btn.dataset.theme);
    });
  });

  const pages = document.querySelectorAll('.page');
  const tabs = document.querySelectorAll('.tab');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  let currentPageIndex = 0;
  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  let isAnimating = false;
  
  function showPage(index, direction = 'next') {
    if (isAnimating) return;
    isAnimating = true;
    
    const currentPage = pages[currentPageIndex];
    const targetPage = pages[index];
    
    pages.forEach(page => {
      page.classList.remove('active', 'next', 'prev', 'turning');
      page.style.transform = '';
      page.style.transition = '';
    });
    
    if (direction === 'next') {
      currentPage.classList.add('turning');
      targetPage.classList.add('next');
      targetPage.style.zIndex = '2';
      
      // Add perspective animation
      currentPage.style.transformOrigin = 'left';
      targetPage.style.transformOrigin = 'left';
    } else {
      currentPage.classList.add('prev');
      targetPage.classList.add('turning');
      currentPage.style.zIndex = '2';
      
      // Add perspective animation
      currentPage.style.transformOrigin = 'right';
      targetPage.style.transformOrigin = 'right';
    }
    
    requestAnimationFrame(() => {
      // After animation completes
      setTimeout(() => {
        pages.forEach(page => {
          page.classList.remove('turning', 'next', 'prev');
          page.style.zIndex = '';
          page.style.transform = '';
          page.style.transition = '';
        });
        targetPage.classList.add('active');
        isAnimating = false;
      }, 800);
    });
    
    tabs.forEach(tab => tab.classList.remove('active'));
    tabs[index].classList.add('active');
    
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === pages.length - 1;
    
    currentPageIndex = index;
  }
  
  function handleDragStart(e) {
    if (isAnimating) return;
    
    isDragging = true;
    startX = e.type === 'mousedown' ? e.pageX : e.touches[0].pageX;
    currentX = startX;
    
    const currentPage = pages[currentPageIndex];
    currentPage.style.transition = 'none';
    
    document.addEventListener('mousemove', handleDragMove, { passive: true });
    document.addEventListener('touchmove', handleDragMove, { passive: true });
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchend', handleDragEnd);
  }
  
  function handleDragMove(e) {
    if (!isDragging) return;
    
    const x = e.type === 'mousemove' ? e.pageX : e.touches[0].pageX;
    const diff = x - startX;
    currentX = x;
    
    const currentPage = pages[currentPageIndex];
    const nextPage = pages[currentPageIndex + 1];
    const prevPage = pages[currentPageIndex - 1];
    
    const maxRotation = 180;
    const progress = Math.min(Math.abs(diff) / window.innerWidth, 1);
    const rotation = Math.min(Math.max((diff / window.innerWidth) * maxRotation, -maxRotation), maxRotation);
    
    requestAnimationFrame(() => {
      if (diff < 0 && nextPage) {
        currentPage.style.transform = `rotateY(${rotation}deg) translateZ(${50 * progress}px)`;
        nextPage.classList.add('next');
        nextPage.style.transform = `translateX(${100 * (1 - progress)}%) translateZ(${50 * progress}px)`;
      } else if (diff > 0 && prevPage) {
        currentPage.style.transform = `translateX(${diff}px) translateZ(${50 * progress}px)`;
        prevPage.classList.add('prev');
        prevPage.style.transform = `rotateY(${-180 + (progress * 180)}deg) translateZ(${50 * progress}px)`;
      }
    });
  }
  
  function handleDragEnd() {
    if (!isDragging) return;
    
    const diff = currentX - startX;
    const threshold = window.innerWidth * 0.2;
    
    pages.forEach(page => {
      page.style.transition = '';
    });
    
    if (diff < -threshold && currentPageIndex < pages.length - 1) {
      showPage(currentPageIndex + 1, 'next');
    } else if (diff > threshold && currentPageIndex > 0) {
      showPage(currentPageIndex - 1, 'prev');
    } else {
      showPage(currentPageIndex);
    }
    
    isDragging = false;
    
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('touchmove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
    document.removeEventListener('touchend', handleDragEnd);
  }
  
  // Event listeners
  pages.forEach(page => {
    page.addEventListener('mousedown', handleDragStart);
    page.addEventListener('touchstart', handleDragStart);
  });
  
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      const direction = index > currentPageIndex ? 'next' : 'prev';
      showPage(index, direction);
    });
  });
  
  prevBtn.addEventListener('click', () => {
    if (currentPageIndex > 0) {
      showPage(currentPageIndex - 1, 'prev');
    }
  });
  
  nextBtn.addEventListener('click', () => {
    if (currentPageIndex < pages.length - 1) {
      showPage(currentPageIndex + 1, 'next');
    }
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentPageIndex > 0) {
      showPage(currentPageIndex - 1, 'prev');
    } else if (e.key === 'ArrowRight' && currentPageIndex < pages.length - 1) {
      showPage(currentPageIndex + 1, 'next');
    }
  });
  
  // Menu functionality
  const menuButton = document.getElementById('menuButton');
  const menuPanel = document.getElementById('menuPanel');
  const menuOverlay = document.getElementById('menuOverlay');
  const menuClose = document.getElementById('menuClose');
  const menuLinks = document.querySelectorAll('.menu-link');
  
  function toggleMenu() {
    menuPanel.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    document.body.style.overflow = menuPanel.classList.contains('active') ? 'hidden' : '';
  }
  
  menuButton.addEventListener('click', toggleMenu);
  menuClose.addEventListener('click', toggleMenu);
  menuOverlay.addEventListener('click', toggleMenu);
  
  menuLinks.forEach((link, index) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      menuLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      toggleMenu();
      showPage(index, index > currentPageIndex ? 'next' : 'prev');
    });
  });
  
  // Update active menu link when page changes
  function updateActiveMenuLink(index) {
    menuLinks.forEach((link, i) => {
      link.classList.toggle('active', i === index);
    });
  }
  
  // Modify showPage function to update menu
  const originalShowPage = showPage;
  showPage = function(index, direction) {
    originalShowPage(index, direction);
    updateActiveMenuLink(index);
  };
  
  // Initialize first page
  showPage(0);
});
