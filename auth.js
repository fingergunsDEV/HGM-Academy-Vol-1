class Auth {
  constructor() {
    this.isAuthenticated = false;
    this.user = null;
    this.checkAuth();
    this.setupEventListeners();
  }

  checkAuth() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.isAuthenticated = true;
      this.updateUI();
    }
  }

  setupEventListeners() {
    const authForm = document.getElementById('authForm');
    const switchToSignup = document.getElementById('switchToSignup');
    
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleAuth();
    });

    switchToSignup.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleAuthMode();
    });
  }

  handleAuth() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const isSignup = document.querySelector('.auth-box').classList.contains('signup-mode');

    if (isSignup) {
      this.handleSignup(email, password);
    } else {
      this.handleSignin(email, password);
    }
  }

  handleSignin(email, password) {
    // For demo purposes, accept any valid email format
    if (this.validateEmail(email) && password.length >= 6) {
      this.user = {
        email: email,
        name: email.split('@')[0], // Use email username as display name
        picture: this.generateAvatar(email)
      };
      
      this.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(this.user));
      this.updateUI();
    } else {
      this.showError('Invalid email or password');
    }
  }

  handleSignup(email, password) {
    if (this.validateEmail(email) && password.length >= 6) {
      this.user = {
        email: email,
        name: email.split('@')[0],
        picture: this.generateAvatar(email)
      };
      
      this.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(this.user));
      this.updateUI();
    } else {
      this.showError('Please enter a valid email and password (min 6 characters)');
    }
  }

  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  generateAvatar(email) {
    // Create SVG avatar with proper XML declaration and encoding
    const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6'];
    const hash = email.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    const color = colors[hash % colors.length];
    const initials = email.split('@')[0].substring(0, 2).toUpperCase();
    
    const svgString = `<?xml version="1.0" encoding="UTF-8"?>
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="20" fill="${color}"/>
        <text 
          x="20" 
          y="24" 
          fill="white" 
          text-anchor="middle" 
          font-family="Arial, sans-serif" 
          font-size="16"
          font-weight="bold"
        >${initials}</text>
      </svg>`;

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
  }

  toggleAuthMode() {
    const authBox = document.querySelector('.auth-box');
    const switchText = document.querySelector('.switch-text');
    const switchLink = document.getElementById('switchToSignup');
    const submitBtn = document.querySelector('.signin-btn');
    const title = document.querySelector('.auth-box h2');

    authBox.classList.toggle('signup-mode');
    
    if (authBox.classList.contains('signup-mode')) {
      title.textContent = 'Create Account';
      submitBtn.innerHTML = '<i class="material-icons">person_add</i> Sign Up';
      switchText.innerHTML = 'Already have an account? <a href="#" id="switchToSignup">Sign in</a>';
    } else {
      title.textContent = 'Welcome Back';
      submitBtn.innerHTML = '<i class="material-icons">login</i> Sign In';
      switchText.innerHTML = 'Don\'t have an account? <a href="#" id="switchToSignup">Sign up</a>';
    }

    // Reattach event listener to new link
    document.getElementById('switchToSignup').addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleAuthMode();
    });
  }

  showError(message) {
    let errorDiv = document.querySelector('.error-message');
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      document.querySelector('.auth-form').insertBefore(errorDiv, document.querySelector('.signin-btn'));
    }
    errorDiv.textContent = message;
    errorDiv.classList.add('visible');
    
    setTimeout(() => {
      errorDiv.classList.remove('visible');
    }, 3000);
  }

  signOut() {
    this.isAuthenticated = false;
    this.user = null;
    localStorage.removeItem('user');
    this.updateUI();
  }

  updateUI() {
    const authContainer = document.getElementById('authContainer');
    const mainContent = document.getElementById('mainContent');
    const menuPanel = document.getElementById('menuPanel');
    
    if (this.isAuthenticated) {
      // Remove existing profile if present
      const existingProfile = menuPanel.querySelector('.user-profile');
      if (existingProfile) existingProfile.remove();

      // Add updated profile HTML
      const userProfileHtml = `
        <div class="user-profile">
          <img src="${this.user.picture}" alt="${this.user.name}" class="user-avatar">
          <div class="user-info">
            <span class="user-name">${this.user.name}</span>
            <button class="sign-out-btn" onclick="auth.signOut()">
              <i class="material-icons">logout</i>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      `;
      
      menuPanel.querySelector('.menu-header').insertAdjacentHTML('afterend', userProfileHtml);
      
      authContainer.style.display = 'none';
      mainContent.style.display = 'block';
      setTimeout(() => mainContent.classList.add('authenticated'), 100);
    } else {
      const userProfile = menuPanel.querySelector('.user-profile');
      if (userProfile) userProfile.remove();
      
      authContainer.style.display = 'flex';
      mainContent.classList.remove('authenticated');
      setTimeout(() => mainContent.style.display = 'none', 300);
    }
  }
}

// Initialize auth
const auth = new Auth();
