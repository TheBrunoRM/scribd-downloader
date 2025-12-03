// ==UserScript==
// @name         Scribd Downloader
// @namespace    https://github.com/ThanhNguyxn/scribd-downloader
// @version      2.0.0
// @description  📚 Download documents from Scribd for free as PDF
// @author       ThanhNguyxn
// @match        https://www.scribd.com/*
// @icon         https://www.scribd.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_openInTab
// @run-at       document-idle
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // ==================== CONFIG ====================
    const BUTTON_DELAY = 2000;

    // ==================== STYLES ====================
    const styles = `
        #sd-floating-btn {
            position: fixed !important;
            bottom: 30px !important;
            right: 30px !important;
            z-index: 2147483647 !important;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            color: white !important;
            border: none !important;
            padding: 16px 28px !important;
            border-radius: 50px !important;
            font-size: 15px !important;
            font-weight: 700 !important;
            cursor: pointer !important;
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5) !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
            transition: all 0.3s ease !important;
            text-decoration: none !important;
        }

        #sd-floating-btn:hover {
            transform: translateY(-4px) scale(1.02) !important;
            box-shadow: 0 12px 35px rgba(102, 126, 234, 0.6) !important;
        }

        #sd-floating-btn:active {
            transform: translateY(-2px) scale(1) !important;
        }

        #sd-popup {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: rgba(0,0,0,0.8) !important;
            z-index: 2147483647 !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease !important;
        }

        #sd-popup.show {
            opacity: 1 !important;
            visibility: visible !important;
        }

        #sd-popup-content {
            background: white !important;
            padding: 35px !important;
            border-radius: 20px !important;
            max-width: 480px !important;
            width: 90% !important;
            text-align: center !important;
            box-shadow: 0 25px 80px rgba(0,0,0,0.4) !important;
            transform: scale(0.9);
            transition: transform 0.3s ease !important;
        }

        #sd-popup.show #sd-popup-content {
            transform: scale(1) !important;
        }

        #sd-popup h2 {
            margin: 0 0 25px 0 !important;
            color: #333 !important;
            font-size: 24px !important;
            font-weight: 700 !important;
        }

        #sd-url-display {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%) !important;
            color: #00d9ff !important;
            padding: 18px !important;
            border-radius: 12px !important;
            font-family: 'Monaco', 'Consolas', monospace !important;
            font-size: 13px !important;
            word-break: break-all !important;
            margin: 20px 0 !important;
            text-align: left !important;
            border: 2px solid #667eea !important;
            user-select: all !important;
            cursor: text !important;
        }

        .sd-btn {
            padding: 14px 28px !important;
            border: none !important;
            border-radius: 12px !important;
            font-size: 15px !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
            margin: 5px !important;
        }

        .sd-btn-copy {
            background: linear-gradient(135deg, #00b09b 0%, #96c93d 100%) !important;
            color: white !important;
        }

        .sd-btn-open {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            color: white !important;
        }

        .sd-btn-close {
            background: #e0e0e0 !important;
            color: #333 !important;
        }

        .sd-btn:hover {
            transform: scale(1.05) !important;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2) !important;
        }

        .sd-step {
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
            padding: 12px 0 !important;
            border-bottom: 1px solid #eee !important;
            text-align: left !important;
            color: #444 !important;
            font-size: 14px !important;
        }

        .sd-step:last-child {
            border-bottom: none !important;
        }

        .sd-step-num {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            color: white !important;
            min-width: 28px !important;
            height: 28px !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-weight: bold !important;
            font-size: 13px !important;
        }

        .sd-info {
            background: #fff3cd !important;
            border-left: 4px solid #ffc107 !important;
            padding: 12px 15px !important;
            margin: 15px 0 !important;
            border-radius: 0 8px 8px 0 !important;
            text-align: left !important;
            font-size: 13px !important;
            color: #856404 !important;
        }

        .sd-btn-group {
            display: flex !important;
            gap: 10px !important;
            justify-content: center !important;
            flex-wrap: wrap !important;
            margin-top: 20px !important;
        }

        /* For embed page - different button */
        #sd-download-btn {
            position: fixed !important;
            bottom: 30px !important;
            right: 30px !important;
            z-index: 2147483647 !important;
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%) !important;
            color: white !important;
            border: none !important;
            padding: 18px 32px !important;
            border-radius: 50px !important;
            font-size: 16px !important;
            font-weight: 700 !important;
            cursor: pointer !important;
            box-shadow: 0 8px 25px rgba(17, 153, 142, 0.5) !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
            transition: all 0.3s ease !important;
        }

        #sd-download-btn:hover {
            transform: translateY(-4px) scale(1.02) !important;
            box-shadow: 0 12px 35px rgba(17, 153, 142, 0.6) !important;
        }

        #sd-progress-popup {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: rgba(0,0,0,0.85) !important;
            z-index: 2147483647 !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
        }

        #sd-progress-content {
            background: white !important;
            padding: 40px !important;
            border-radius: 20px !important;
            text-align: center !important;
            min-width: 350px !important;
        }

        #sd-progress-bar {
            width: 100% !important;
            height: 12px !important;
            background: #e0e0e0 !important;
            border-radius: 10px !important;
            overflow: hidden !important;
            margin: 25px 0 !important;
        }

        #sd-progress-fill {
            height: 100% !important;
            background: linear-gradient(90deg, #667eea, #764ba2) !important;
            width: 0% !important;
            transition: width 0.3s ease !important;
            border-radius: 10px !important;
        }

        #sd-progress-text {
            color: #666 !important;
            font-size: 16px !important;
            margin-bottom: 10px !important;
        }
    `;

    // Inject styles
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    // ==================== UTILITIES ====================

    function getDocId() {
        const url = window.location.href;
        const match = url.match(/(?:document|doc|embeds|read)\/(\d+)/);
        return match ? match[1] : null;
    }

    function isEmbed() {
        return window.location.href.includes('/embeds/');
    }

    function getEmbedUrl(id) {
        return `https://www.scribd.com/embeds/${id}/content`;
    }

    function copyText(text) {
        try {
            if (typeof GM_setClipboard === 'function') {
                GM_setClipboard(text, 'text');
                return true;
            }
        } catch(e) {}
        
        try {
            navigator.clipboard.writeText(text);
            return true;
        } catch(e) {}

        try {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            ta.remove();
            return true;
        } catch(e) {}

        return false;
    }

    function sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    // ==================== MAIN PAGE FUNCTIONS ====================

    function showMainButton() {
        if (document.getElementById('sd-floating-btn')) return;
        
        const docId = getDocId();
        if (!docId) return;

        const btn = document.createElement('button');
        btn.id = 'sd-floating-btn';
        btn.innerHTML = '📥 Get PDF';
        btn.onclick = showPopup;
        document.body.appendChild(btn);
    }

    function showPopup() {
        const docId = getDocId();
        if (!docId) return alert('Cannot find document ID!');

        const embedUrl = getEmbedUrl(docId);

        // Remove existing popup
        const existing = document.getElementById('sd-popup');
        if (existing) existing.remove();

        const popup = document.createElement('div');
        popup.id = 'sd-popup';
        popup.innerHTML = `
            <div id="sd-popup-content">
                <h2>📚 Scribd Downloader</h2>
                
                <div class="sd-info">
                    ⚡ <strong>Quick tip:</strong> Use Incognito mode to bypass login
                </div>

                <div class="sd-step">
                    <span class="sd-step-num">1</span>
                    <span>Copy the URL below</span>
                </div>
                <div class="sd-step">
                    <span class="sd-step-num">2</span>
                    <span>Open <strong>Incognito window</strong> (Ctrl+Shift+N)</span>
                </div>
                <div class="sd-step">
                    <span class="sd-step-num">3</span>
                    <span>Paste URL → Click the green button</span>
                </div>

                <div id="sd-url-display">${embedUrl}</div>

                <div class="sd-btn-group">
                    <button class="sd-btn sd-btn-copy" id="sd-copy-btn">📋 Copy URL</button>
                    <button class="sd-btn sd-btn-open" id="sd-open-btn">🚀 Open in New Tab</button>
                    <button class="sd-btn sd-btn-close" id="sd-close-btn">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(popup);
        
        // Show with animation
        requestAnimationFrame(() => {
            popup.classList.add('show');
        });

        // Event handlers
        document.getElementById('sd-copy-btn').onclick = function() {
            copyText(embedUrl);
            this.innerHTML = '✅ Copied!';
            this.style.background = 'linear-gradient(135deg, #28a745 0%, #218838 100%)';
            setTimeout(() => {
                this.innerHTML = '📋 Copy URL';
                this.style.background = '';
            }, 2000);
        };

        document.getElementById('sd-open-btn').onclick = function() {
            window.open(embedUrl, '_blank');
        };

        document.getElementById('sd-close-btn').onclick = function() {
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 300);
        };

        // Close on background click
        popup.onclick = function(e) {
            if (e.target === popup) {
                popup.classList.remove('show');
                setTimeout(() => popup.remove(), 300);
            }
        };
    }

    // ==================== EMBED PAGE FUNCTIONS ====================

    function showEmbedButton() {
        if (document.getElementById('sd-download-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'sd-download-btn';
        btn.innerHTML = '⬇️ Download PDF Now';
        btn.onclick = startDownload;
        document.body.appendChild(btn);
    }

    async function startDownload() {
        const btn = document.getElementById('sd-download-btn');
        btn.style.display = 'none';

        // Create progress popup
        const progress = document.createElement('div');
        progress.id = 'sd-progress-popup';
        progress.innerHTML = `
            <div id="sd-progress-content">
                <h2>📚 Preparing PDF...</h2>
                <div id="sd-progress-text">Loading pages...</div>
                <div id="sd-progress-bar">
                    <div id="sd-progress-fill"></div>
                </div>
            </div>
        `;
        document.body.appendChild(progress);

        const fill = document.getElementById('sd-progress-fill');
        const text = document.getElementById('sd-progress-text');

        try {
            // Step 1: Scroll all pages
            text.textContent = '📄 Loading all pages...';
            const pages = document.querySelectorAll("[class*='page']");
            
            if (pages.length > 0) {
                for (let i = 0; i < pages.length; i++) {
                    pages[i].scrollIntoView({ behavior: 'auto', block: 'center' });
                    await sleep(400);
                    const pct = Math.round(((i + 1) / pages.length) * 50);
                    fill.style.width = pct + '%';
                    text.textContent = `📄 Loading page ${i + 1}/${pages.length}...`;
                }
            } else {
                // Fallback scroll
                const h = document.documentElement.scrollHeight;
                for (let i = 0; i <= 20; i++) {
                    window.scrollTo(0, (h / 20) * i);
                    await sleep(200);
                    fill.style.width = (i * 2.5) + '%';
                }
            }

            // Step 2: Remove junk
            fill.style.width = '60%';
            text.textContent = '🧹 Cleaning up...';
            await sleep(300);

            const junk = [
                '.toolbar_top', '.toolbar_bottom', '.promo_div',
                '[class*="blur"]', '[class*="paywall"]', '[class*="overlay"]',
                '[class*="upsell"]', '[class*="signup"]', '.ReactModalPortal'
            ];
            junk.forEach(sel => {
                try {
                    document.querySelectorAll(sel).forEach(el => el.remove());
                } catch(e) {}
            });

            // Step 3: Fix visibility
            fill.style.width = '80%';
            text.textContent = '✨ Optimizing...';
            await sleep(300);

            document.querySelectorAll('*').forEach(el => {
                try {
                    const s = getComputedStyle(el);
                    if (s.filter?.includes('blur')) el.style.filter = 'none';
                    if (parseFloat(s.opacity) < 1) el.style.opacity = '1';
                } catch(e) {}
            });

            // Step 4: Print
            fill.style.width = '100%';
            text.textContent = '✅ Ready! Opening print dialog...';
            await sleep(500);

            progress.remove();
            window.print();

            // Show button again
            btn.style.display = 'flex';
            btn.innerHTML = '✅ Done! Click to print again';

        } catch (err) {
            console.error('Download error:', err);
            progress.remove();
            btn.style.display = 'flex';
            btn.innerHTML = '❌ Error - Try again';
        }
    }

    // ==================== INIT ====================

    function init() {
        // Check if we're on Scribd
        if (!window.location.hostname.includes('scribd.com')) return;

        setTimeout(() => {
            if (isEmbed()) {
                showEmbedButton();
            } else if (getDocId()) {
                showMainButton();
            }
        }, BUTTON_DELAY);
    }

    // Run
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
