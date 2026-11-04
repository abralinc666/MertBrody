/**
 * LovelyCam - Privacy & Content Protection Module
 * Implements safeguards against content theft and unauthorized interactions.
 */

(function() {
    'use strict';

    const CONFIG = {
        disableRightClick: true,
        disableImageDrag: true,
        disableShortcuts: true,
        enableBlurProtection: true
    };

    document.addEventListener('DOMContentLoaded', () => {
        initPrivacyProtection();
    });

    function initPrivacyProtection() {
        // 1. Disable Right Click (Content Protection)
        if (CONFIG.disableRightClick) {
            document.addEventListener('contextmenu', (e) => {
                // Allow interactions with inputs
                if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || e.target.isContentEditable) {
                    return;
                }
                
                e.preventDefault();
                return false;
            }, false);
        }

        // 2. Disable Image Dragging
        if (CONFIG.disableImageDrag) {
            document.addEventListener('dragstart', (e) => {
                const target = e.target;
                if (target.tagName === 'IMG' || 
                    (target.style && target.style.backgroundImage) ||
                    target.classList.contains('protect-drag')) {
                    e.preventDefault();
                    return false;
                }
            }, false);
        }

        // 3. Disable Save/Print Shortcuts
        if (CONFIG.disableShortcuts) {
            document.addEventListener('keydown', (e) => {
                // Ctrl+S (Save), Ctrl+P (Print), Ctrl+U (View Source)
                if ((e.ctrlKey || e.metaKey) && ['s', 'p', 'u'].includes(e.key.toLowerCase())) {
                    e.preventDefault();
                    return false;
                }
                
                // F12 (DevTools) - Optional, often annoying for devs but requested in audits
                // if (e.key === 'F12') {
                //     e.preventDefault();
                // }
            });
        }
        
        // 4. Blur Sensitive Content Logic
        // Add click listener to toggle blur on sensitive elements
        if (CONFIG.enableBlurProtection) {
            document.body.addEventListener('click', (e) => {
                // Check if clicked element or parent has 'sensitive-blur' class
                const sensitiveEl = e.target.closest('.sensitive-blur');
                if (sensitiveEl) {
                    sensitiveEl.classList.toggle('reveal');
                }
            });
        }

        console.log('🛡️ LovelyCam Privacy Module Active');
    }

})();
