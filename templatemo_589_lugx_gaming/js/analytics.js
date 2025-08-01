// analytics.js - Configured for http://app.iit.cloud
class LugxTracker {
  constructor() {
    this.sessionId = this.generateId();
    this.currentPage = window.location.pathname;
    this.analyticsEndpoint = '/api/track'; // Using relative path for same-domain
    this.init();
  }

  generateId() {
    return 'lugx-' + Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
  }

  init() {
    this.trackPageLoad();
    this.setupEventListeners();
  }

  trackPageLoad() {
    this.sendData({
      event_type: 'page_load',
      page_url: this.currentPage,
      referrer: document.referrer,
      load_time: performance.timing.loadEventEnd - performance.timing.navigationStart,
      domain: window.location.hostname
    });
  }

  setupEventListeners() {
    // Game interactions - modified for better UX
    document.querySelectorAll('[data-game]').forEach(el => {
      el.addEventListener('click', (e) => {
        this.trackGameAction(el);
        // Only prevent default for non-link elements
        if (el.tagName !== 'A') e.preventDefault();
      });
    });

    // Navigation clicks - tracks before navigation
    document.querySelectorAll('a[href^="http"]').forEach(link => {
      link.addEventListener('click', (e) => {
        if (link.href.includes('app.iit.cloud')) {
          this.trackNavigation(link);
        } else {
          // Track outbound links
          this.sendData({
            event_type: 'outbound_click',
            destination: link.href,
            link_text: link.innerText.trim()
          });
          // Open in new tab to allow tracking to complete
          e.preventDefault();
          setTimeout(() => window.open(link.href, '_blank'), 150);
        }
      });
    });

    // Form submissions - tracks before submit
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', (e) => {
        this.trackFormSubmit(form);
        // Allow form to submit normally
      });
    });
  }

  trackGameAction(element) {
    this.sendData({
      event_type: 'game_interaction',
      game_id: element.dataset.game,
      action: element.dataset.action || 'play',
      element_id: element.id || null
    });
  }

  trackNavigation(link) {
    this.sendData({
      event_type: 'navigation',
      destination: link.href,
      link_text: link.innerText.trim().substring(0, 100) // Limit length
    });
  }

  trackFormSubmit(form) {
    this.sendData({
      event_type: 'form_submit',
      form_id: form.id || 'unknown',
      form_type: form.dataset.type || 'general',
      form_fields: Array.from(form.elements)
        .filter(el => el.name)
        .map(el => el.name)
    });
  }

  sendData(payload) {
    const data = {
      ...payload,
      session_id: this.sessionId,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      screen_resolution: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language,
      page_title: document.title.substring(0, 200)
    };

    // Try fetch first, fallback to sendBeacon
    try {
      fetch(this.analyticsEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        keepalive: true
      }).catch(() => {
        navigator.sendBeacon(this.analyticsEndpoint, JSON.stringify(data));
      });
    } catch (e) {
      navigator.sendBeacon(this.analyticsEndpoint, JSON.stringify(data));
    }
  }
}

// Initialize with protection against errors
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    try {
      new LugxTracker();
    } catch (e) {
      console.error('Analytics init error:', e);
    }
  });
}
