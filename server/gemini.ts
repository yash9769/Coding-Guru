import { GoogleGenAI } from "@google/genai";

const hasValidApiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "dummy_key" && process.env.GEMINI_API_KEY !== "your_gemini_api_key_here";

let ai: GoogleGenAI | null = null;
if (hasValidApiKey) {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
} else {
  console.warn("GEMINI_API_KEY not configured or is placeholder, using mock responses");
}

// Mock response generator
function generateMockCode(type: string, framework: string): string {
  const templates = {
    "Hero Section": `import React from 'react';

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-6" data-testid="hero-title">
          Welcome to Our Platform
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Build amazing web applications with our AI-powered tools
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            data-testid="cta-primary"
          >
            Get Started
          </button>
          <button 
            className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            data-testid="cta-secondary"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;`,
    "Navigation Bar": `import React, { useState } from 'react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-800" data-testid="nav-logo">Logo</h1>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-gray-900" data-testid="nav-home">Home</a>
            <a href="#" className="text-gray-600 hover:text-gray-900" data-testid="nav-about">About</a>
            <a href="#" className="text-gray-600 hover:text-gray-900" data-testid="nav-services">Services</a>
            <a href="#" className="text-gray-600 hover:text-gray-900" data-testid="nav-contact">Contact</a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;`,
    "Card Component": `import React from 'react';

interface CardProps {
  title: string;
  description: string;
  imageUrl?: string;
}

const Card: React.FC<CardProps> = ({ title, description, imageUrl }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden" data-testid="card">
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-48 object-cover"
          data-testid="card-image"
        />
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2" data-testid="card-title">{title}</h3>
        <p className="text-gray-600" data-testid="card-description">{description}</p>
      </div>
    </div>
  );
};

export default Card;`
  };

  return templates[type as keyof typeof templates] || templates["Hero Section"];
}

function generateMockWebsite(prompt: string, mode: 'flow' | 'webapp' = 'webapp') {
  if (mode === 'flow') {
    const title = "User Workflow";
    
    return {
      title,
      description: `AI-generated workflow based on your prompt`,
      components: [
        { type: "start", content: "Begin Process" },
        { type: "process", content: "User Input" },
        { type: "decision", content: "Validate Input?" },
        { type: "process", content: "Process Data" },
        { type: "end", content: "Complete" }
      ],
      htmlCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-gray-50 p-8">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold text-center mb-8">${title}</h1>
    <div class="flow-container bg-white p-8 rounded-lg shadow-lg">
      <div class="flow-step start">Start</div>
      <div class="flow-arrow">↓</div>
      <div class="flow-step process">Process Input</div>
      <div class="flow-arrow">↓</div>
      <div class="flow-step decision">Decision Point</div>
      <div class="flow-arrow">↓</div>
      <div class="flow-step end">End</div>
    </div>
  </div>
</body>
</html>`,
      cssCode: `/* Flowchart styles */
.flow-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.flow-step {
  padding: 1rem 2rem;
  border: 2px solid #3b82f6;
  border-radius: 0.5rem;
  background: white;
  text-align: center;
  font-weight: 600;
}

.flow-step.start, .flow-step.end {
  border-radius: 2rem;
  background: #dbeafe;
}

.flow-step.decision {
  transform: rotate(45deg);
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flow-arrow {
  font-size: 2rem;
  color: #3b82f6;
}`,
      jsCode: `// Flowchart JavaScript
const initializeFlow = () => {
  console.log('Flowchart initialized');
  
  const steps = document.querySelectorAll('.flow-step');
  steps.forEach((step, index) => {
    step.addEventListener('click', () => {
      console.log('Step clicked:', step.textContent);
    });
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFlow);
} else {
  initializeFlow();
}`
    };
  } else {
    // WebApp mode - Generate complete HTML web application
    const title = prompt.includes("portfolio") ? "Portfolio Website" : 
                  prompt.includes("e-commerce") ? "E-commerce Store" :
                  prompt.includes("blog") ? "Blog Platform" :
                  prompt.includes("dashboard") ? "Admin Dashboard" :
                  "Modern Web App";
    
    return {
      title,
      description: `AI-generated ${title.toLowerCase()} with interactive features`,
      components: [
        { type: "header", content: "Navigation Header" },
        { type: "hero", content: "Hero Section" },
        { type: "content", content: "Main Content" },
        { type: "footer", content: "Footer" }
      ],
      htmlCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="min-h-screen bg-gray-50 font-sans">
  <!-- Navigation Header -->
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <h1 class="text-2xl font-bold text-gray-900">${title}</h1>
        </div>
        <div class="hidden md:flex items-center space-x-8">
          <a href="#home" class="text-gray-700 hover:text-blue-600 transition-colors font-medium">Home</a>
          <a href="#about" class="text-gray-700 hover:text-blue-600 transition-colors font-medium">About</a>
          <a href="#services" class="text-gray-700 hover:text-blue-600 transition-colors font-medium">Services</a>
          <a href="#contact" class="text-gray-700 hover:text-blue-600 transition-colors font-medium">Contact</a>
          <button class="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Get Started
          </button>
        </div>
        <div class="md:hidden">
          <button id="mobile-menu-btn" class="text-gray-700 hover:text-blue-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  </header>

  <!-- Hero Section -->
  <section id="home" class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 class="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">Welcome to ${title}</h1>
      <p class="text-xl mb-8 max-w-2xl mx-auto opacity-90">
        This is your AI-generated web application based on: "${prompt}"
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105">
          Get Started
        </button>
        <button class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all">
          Learn More
        </button>
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section id="services" class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Amazing Features</h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">Discover what makes our AI-generated application special</p>
      </div>
      <div class="grid md:grid-cols-3 gap-8">
        <div class="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-1">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-3 text-gray-900">Lightning Fast</h3>
          <p class="text-gray-600">Built with modern web technologies for optimal performance and user experience.</p>
        </div>
        <div class="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-1">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-3 text-gray-900">User Friendly</h3>
          <p class="text-gray-600">Intuitive design and seamless user experience crafted with attention to detail.</p>
        </div>
        <div class="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-1">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-3 text-gray-900">AI-Powered</h3>
          <p class="text-gray-600">Generated by artificial intelligence to match your specific requirements perfectly.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Contact Section -->
  <section id="contact" class="py-20 bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
        <p class="text-lg text-gray-600">Ready to get started? We'd love to hear from you!</p>
      </div>
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <form id="contact-form" class="space-y-6">
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input type="text" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Your name">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="your@email.com">
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-32 resize-none" placeholder="Tell us about your project..."></textarea>
          </div>
          <button type="submit" class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105">
            Send Message
          </button>
        </form>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-gray-900 text-white py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid md:grid-cols-4 gap-8">
        <div class="md:col-span-2">
          <h3 class="text-2xl font-bold mb-4">${title}</h3>
          <p class="text-gray-400 mb-4">Built with AI to deliver exceptional web experiences.</p>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
        </div>
        <div>
          <h4 class="text-lg font-semibold mb-4">Quick Links</h4>
          <ul class="space-y-2">
            <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Home</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white transition-colors">About</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Services</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-lg font-semibold mb-4">Contact</h4>
          <ul class="space-y-2 text-gray-400">
            <li>info@${title.toLowerCase().replace(/\s+/g, '')}.com</li>
            <li>+1 (555) 123-4567</li>
            <li>123 AI Street</li>
            <li>Tech City, TC 12345</li>
          </ul>
        </div>
      </div>
      <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; 2024 ${title}. Built with AI. All rights reserved.</p>
      </div>
    </div>
  </footer>
</body>
</html>`,
      cssCode: `/* Custom styles for ${title} */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
}

.animate-fade-in {
  animation: fadeIn 1s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom button hover effects */
.btn-hover {
  transition: all 0.3s ease;
}

.btn-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Card animations */
.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

/* Mobile menu styles */
.mobile-menu {
  transform: translateX(100%);
  transition: transform 0.3s ease;
}

.mobile-menu.active {
  transform: translateX(0);
}

/* Form focus styles */
input:focus, textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}`,
      jsCode: `// JavaScript for ${title}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
  console.log('${title} initialized successfully!');
  
  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('active');
    });
  }
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Contact form handling
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(this);
      const name = this.querySelector('input[type="text"]').value;
      const email = this.querySelector('input[type="email"]').value;
      const message = this.querySelector('textarea').value;
      
      // Simple validation
      if (!name || !email || !message) {
        alert('Please fill in all fields.');
        return;
      }
      
      // Simulate form submission
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        alert('Thank you for your message! We\'ll get back to you soon.');
        this.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 2000);
    });
  }
  
  // Add scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe all cards and sections
  document.querySelectorAll('.card-hover, section').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
  });
  
  // Add button click effects
  document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function() {
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  });
});

// Utility functions
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Add floating action button for scroll to top
window.addEventListener('scroll', function() {
  const scrollBtn = document.getElementById('scroll-to-top');
  if (window.pageYOffset > 300) {
    if (scrollBtn) scrollBtn.style.display = 'block';
  } else {
    if (scrollBtn) scrollBtn.style.display = 'none';
  }
});`
    };
  }
}

export async function generateReactComponent(
  componentType: string,
  framework: string,
  stylePreferences: string
): Promise<string> {
  // Return mock response if no valid API key
  if (!hasValidApiKey) {
    console.log(`Generating mock ${componentType} component`);
    return generateMockCode(componentType, framework);
  }

  const prompt = `Generate a modern ${componentType} component using ${framework}. 

Style preferences: ${stylePreferences}

Requirements:
- Use TypeScript
- Include proper TypeScript types
- Use Tailwind CSS for styling
- Make it responsive and accessible
- Include proper JSX structure
- Add data-testid attributes for interactive elements
- Follow modern React best practices

Return only the component code, no explanations.`;

  try {
    const response = await ai!.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || generateMockCode(componentType, framework);
  } catch (error) {
    console.error("Error generating component:", error);
    console.log("Falling back to mock response");
    return generateMockCode(componentType, framework);
  }
}

export async function generateBackendCode(
  database: string,
  framework: string,
  features: {
    userAuth: boolean;
    crudOps: boolean;
    fileUpload: boolean;
    emailIntegration: boolean;
  }
): Promise<{
  routes: string;
  models: string;
  middleware: string;
}> {
  // Return mock response if no valid API key
  if (!hasValidApiKey) {
    console.log(`Generating mock ${framework} backend with ${database}`);
    return {
      routes: `// Generated ${framework} Routes with ${database}\nimport express from 'express';\nconst router = express.Router();\n\n// Health check\nrouter.get('/health', (req, res) => {\n  res.json({ status: 'OK', database: '${database}' });\n});\n\n${features.userAuth ? '// Authentication routes\nrouter.post("/auth/login", async (req, res) => {\n  res.json({ token: "mock-jwt-token", user: { id: 1, email: req.body.email } });\n});' : ''}\n\n${features.crudOps ? '// CRUD operations\nrouter.get("/users", async (req, res) => {\n  res.json([{ id: 1, name: "Demo User" }]);\n});' : ''}\n\nexport default router;`,
      models: `// ${database} Models\n${database === 'MongoDB' ? 
        'import mongoose from "mongoose";\n\nconst userSchema = new mongoose.Schema({\n  email: { type: String, required: true, unique: true },\n  password: { type: String, required: true },\n  createdAt: { type: Date, default: Date.now }\n});\n\nexport const User = mongoose.model("User", userSchema);' :
        'import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";\n\nexport const users = pgTable("users", {\n  id: serial("id").primaryKey(),\n  email: varchar("email", { length: 255 }).notNull().unique(),\n  password: varchar("password", { length: 255 }).notNull(),\n  createdAt: timestamp("created_at").defaultNow()\n});'
      }`,
      middleware: `// Middleware for ${framework}\nimport express from 'express';\nimport cors from 'cors';\n\n// CORS configuration\nexport const corsMiddleware = cors({\n  origin: process.env.FRONTEND_URL || 'http://localhost:3000',\n  credentials: true\n});\n\n// Request logging\nexport const loggerMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {\n  console.log(\`\${req.method} \${req.path} - \${new Date().toISOString()}\`);\n  next();\n};\n\n${features.userAuth ? '// Authentication middleware\nexport const authMiddleware = (req: any, res: express.Response, next: express.NextFunction) => {\n  const token = req.headers.authorization?.split(" ")[1];\n  if (!token) {\n    return res.status(401).json({ message: "Unauthorized" });\n  }\n  req.user = { id: 1, email: "demo@example.com" }; // Mock user\n  next();\n};' : ''}`
    };
  }

  const featuresText = Object.entries(features)
    .filter(([_, enabled]) => enabled)
    .map(([feature]) => feature)
    .join(", ");

  const routesPrompt = `Generate ${framework} API routes for a web application with ${database} database.

Features to include: ${featuresText}

Requirements:
- Use TypeScript
- Include proper error handling
- Add input validation
- Use modern async/await patterns
- Include proper HTTP status codes
- Add middleware for authentication where needed

Generate the routes file with all necessary endpoints.`;

  const modelsPrompt = `Generate ${database} database models/schemas for a web application.

Features: ${featuresText}

Requirements:
- Use TypeScript
- Include proper field types
- Add relationships between models
- Include timestamps
- Add validation rules where appropriate

Generate the models/schema file.`;

  const middlewarePrompt = `Generate middleware functions for a ${framework} application.

Features: ${featuresText}

Requirements:
- Use TypeScript
- Include authentication middleware
- Add error handling middleware
- Include request logging
- Add CORS configuration if needed

Generate the middleware file.`;

  try {
    const [routesResponse, modelsResponse, middlewareResponse] = await Promise.all([
      ai!.models.generateContent({
        model: "gemini-2.5-flash",
        contents: routesPrompt,
      }),
      ai!.models.generateContent({
        model: "gemini-2.5-flash",
        contents: modelsPrompt,
      }),
      ai!.models.generateContent({
        model: "gemini-2.5-flash",
        contents: middlewarePrompt,
      }),
    ]);

    return {
      routes: routesResponse.text || "// Error generating routes",
      models: modelsResponse.text || "// Error generating models",
      middleware: middlewareResponse.text || "// Error generating middleware",
    };
  } catch (error) {
    console.error("Error generating backend code:", error);
    console.log("Falling back to mock response");
    // Fallback to mock response
    return {
      routes: "// Mock routes due to API error",
      models: "// Mock models due to API error", 
      middleware: "// Mock middleware due to API error"
    };
  }
}

export async function buildFromPrompt(userPrompt: string, mode: 'flow' | 'webapp' = 'webapp'): Promise<{
  title: string;
  description: string;
  components: any[];
  htmlCode: string;
  cssCode: string;
  jsCode: string;
}> {
  // Return mock response if no valid API key
  if (!hasValidApiKey) {
    console.log(`Generating mock ${mode} from prompt: ${userPrompt}`);
    return generateMockWebsite(userPrompt, mode);
  }

  const prompt = mode === 'flow' 
    ? `You are an expert workflow designer. Based on this user request, generate a complete workflow/flowchart structure:

"${userPrompt}"

Please provide a JSON response with:
1. A suitable title for the workflow
2. A brief description
3. An array of flow components (start, process, decision, end nodes)
4. HTML structure representing the flowchart
5. CSS for styling the flow elements
6. JavaScript for any interactive features

Make the flowchart clear, logical, and professional. Include proper flow elements like:
- Start/End nodes (oval shapes)
- Process steps (rectangles)
- Decision points (diamonds)
- Connectors and arrows

Return ONLY valid JSON in this exact format:
{
  "title": "Workflow Title",
  "description": "Brief description",
  "components": [{"type": "start", "content": "..."}, {"type": "process", "content": "..."}, {"type": "decision", "content": "..."}, {"type": "end", "content": "..."}],
  "htmlCode": "<!DOCTYPE html>...",
  "cssCode": "/* CSS styles */",
  "jsCode": "// JavaScript code"
}`
    : `You are an expert web developer. Based on this user request, generate a complete web application:

"${userPrompt}"

Please provide a JSON response with:
1. A suitable title for the web application
2. A brief description
3. An array of web components that should be included (header, hero, content sections, footer, etc.)
4. Complete HTML code for a fully interactive web application
5. Complete CSS code using Tailwind CSS classes and custom styles
6. JavaScript code for interactive features and functionality

Generate a COMPLETE, INTERACTIVE WEB APPLICATION with:
- Modern, responsive design using Tailwind CSS
- Interactive features (forms, buttons, navigation, etc.)
- Professional styling and layout
- Functional JavaScript for user interactions
- Mobile-responsive design
- Proper semantic HTML structure
- Smooth animations and transitions
- Working contact forms, navigation menus, and other interactive elements

IMPORTANT: Generate a complete, standalone HTML website that can be viewed in a browser immediately. Include all necessary styling and JavaScript inline or via CDN.

Return ONLY valid JSON in this exact format:
{
  "title": "Web App Title",
  "description": "Brief description",
  "components": [{"type": "header", "content": "Navigation header"}, {"type": "hero", "content": "Hero section"}, {"type": "content", "content": "Main content sections"}, {"type": "footer", "content": "Footer"}],
  "htmlCode": "<!DOCTYPE html>...",
  "cssCode": "/* Complete CSS styles */",
  "jsCode": "// Complete JavaScript functionality"
}`;

  try {
    if (!ai) {
      throw new Error('AI client not initialized');
    }
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
      },
      contents: prompt,
    });

    const result = JSON.parse(response.text || '{}');
    
    return {
      title: result.title || "Generated Project",
      description: result.description || "Generated using AI",
      components: result.components || [],
      htmlCode: result.htmlCode || "<!DOCTYPE html><html><head><title>Generated Site</title></head><body><h1>Generated Content</h1></body></html>",
      cssCode: result.cssCode || "/* Generated styles */",
      jsCode: result.jsCode || "// Generated JavaScript",
    };
  } catch (error) {
    console.error("Error building from prompt:", error);
    console.log("Falling back to mock response");
    return generateMockWebsite(userPrompt, mode);
  }
}

export async function optimizeCode(code: string, type: 'component' | 'backend'): Promise<string> {
  const prompt = `Analyze and optimize the following ${type} code:

${code}

Please provide optimized version with:
- Better performance
- Improved readability
- Modern best practices
- Proper error handling
- Security improvements (if applicable)

Return only the optimized code, no explanations.`;

  try {
    if (!ai) {
      throw new Error('AI client not initialized');
    }
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
    });

    return response.text || code; // Return original if optimization fails
  } catch (error) {
    console.error("Error optimizing code:", error);
    return code; // Return original code if optimization fails
  }
}