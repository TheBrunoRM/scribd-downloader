// ==UserScript==
// @name         Scribd Downloader
// @namespace    https://github.com/ThanhNguyxn/scribd-downloader
// @version      1.0.0
// @description  📚 Download documents from Scribd for free as PDF
// @author       ThanhNguyxn
// @match        https://www.scribd.com/document/*
// @match        https://www.scribd.com/doc/*
// @match        https://www.scribd.com/embeds/*/content
// @icon         https://www.scribd.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_openInTab
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // ==================== STYLES ====================
    GM_addStyle(`
        #scribd-dl-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 99999;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 15px 25px;
            border-radius: 50px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        #scribd-dl-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }

        #scribd-dl-btn:active {
            transform: translateY(-1px);
        }

        #scribd-dl-btn.loading {
            opacity: 0.7;
            cursor: wait;
        }

        #scribd-dl-btn .icon {
            margin-right: 8px;
        }

        #scribd-dl-status {
            position: fixed;
            bottom: 80px;
            right: 20px;
            z-index: 99999;
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 12px 20px;
            border-radius: 10px;
            font-size: 14px;
            max-width: 300px;
            display: none;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            backdrop-filter: blur(10px);
        }

        #scribd-dl-status.show {
            display: block;
            animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(20px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        #scribd-dl-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 999999;
            display: none;
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(5px);
        }

        #scribd-dl-modal.show {
            display: flex;
        }

        .modal-content {
            background: white;
            padding: 30px;
            border-radius: 20px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .modal-content h2 {
            margin: 0 0 20px 0;
            color: #333;
            font-size: 24px;
        }

        .modal-content p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 20px;
        }

        .modal-content .btn-group {
            display: flex;
            gap: 10px;
            justify-content: center;
            flex-wrap: wrap;
        }

        .modal-content button {
            padding: 12px 24px;
            border: none;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .modal-content .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .modal-content .btn-secondary {
            background: #f0f0f0;
            color: #333;
        }

        .modal-content button:hover {
            transform: scale(1.05);
        }

        .progress-bar {
            width: 100%;
            height: 8px;
            background: #e0e0e0;
            border-radius: 10px;
            overflow: hidden;
            margin: 20px 0;
        }

        .progress-bar .progress {
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            width: 0%;
            transition: width 0.3s ease;
            border-radius: 10px;
        }
    `);

    // ==================== UTILITIES ====================

    function getDocumentId() {
        const url = window.location.href;
        // Match: /document/123456/ or /doc/123456/ or /embeds/123456/
        const match = url.match(/(?:document|doc|embeds)\/(\d+)/);
        return match ? match[1] : null;
    }

    function isEmbedPage() {
        return window.location.href.includes('/embeds/');
    }

    function getEmbedUrl(docId) {
        return `https://www.scribd.com/embeds/${docId}/content`;
    }

    function showStatus(message, duration = 3000) {
        let status = document.getElementById('scribd-dl-status');
        if (!status) {
            status = document.createElement('div');
            status.id = 'scribd-dl-status';
            document.body.appendChild(status);
        }
        status.textContent = message;
        status.classList.add('show');

        if (duration > 0) {
            setTimeout(() => {
                status.classList.remove('show');
            }, duration);
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ==================== MAIN FUNCTIONS ====================

    async function scrollAllPages(progressCallback) {
        const pages = document.querySelectorAll("[class*='page']");
        const totalPages = pages.length;

        for (let i = 0; i < pages.length; i++) {
            pages[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
            await sleep(400);
            if (progressCallback) {
                progressCallback(Math.round(((i + 1) / totalPages) * 50));
            }
        }
    }

    function removeToolbars() {
        const selectorsToRemove = [
            '.toolbar_top',
            '.toolbar_bottom',
            '.promo_div',
            '.blurred_page',
            '[class*="blur"]',
            '[class*="paywall"]',
            '[class*="overlay"]',
            '.auto_mobile_first',
            '.mobile_banner'
        ];

        let removed = 0;
        selectorsToRemove.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.remove();
                removed++;
            });
        });

        // Clean document_scroller class
        const scrollers = document.querySelectorAll('.document_scroller');
        scrollers.forEach(el => {
            el.removeAttribute('class');
        });

        return removed;
    }

    function cleanupForPrint() {
        // Remove blur effects
        document.querySelectorAll('*').forEach(el => {
            const style = window.getComputedStyle(el);
            if (style.filter && style.filter.includes('blur')) {
                el.style.filter = 'none';
            }
        });

        // Make all pages visible
        document.querySelectorAll("[class*='page']").forEach(page => {
            page.style.visibility = 'visible';
            page.style.opacity = '1';
        });
    }

    function triggerPrint() {
        window.print();
    }

    // ==================== UI COMPONENTS ====================

    function createDownloadButton() {
        const btn = document.createElement('button');
        btn.id = 'scribd-dl-btn';
        btn.innerHTML = '<span class="icon">📥</span>Download PDF';
        btn.onclick = handleDownloadClick;
        document.body.appendChild(btn);
    }

    function createModal() {
        const modal = document.createElement('div');
        modal.id = 'scribd-dl-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>📚 Scribd Downloader</h2>
                <p id="modal-message">Preparing document...</p>
                <div class="progress-bar">
                    <div class="progress" id="download-progress"></div>
                </div>
                <div class="btn-group" id="modal-buttons" style="display: none;">
                    <button class="btn-primary" id="btn-print">🖨️ Print/Save PDF</button>
                    <button class="btn-secondary" id="btn-close">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('btn-close').onclick = () => {
            modal.classList.remove('show');
        };

        document.getElementById('btn-print').onclick = () => {
            modal.classList.remove('show');
            setTimeout(triggerPrint, 300);
        };

        return modal;
    }

    function showModal(message, showButtons = false, progress = 0) {
        let modal = document.getElementById('scribd-dl-modal');
        if (!modal) {
            modal = createModal();
        }

        document.getElementById('modal-message').textContent = message;
        document.getElementById('download-progress').style.width = progress + '%';
        document.getElementById('modal-buttons').style.display = showButtons ? 'flex' : 'none';
        modal.classList.add('show');
    }

    function updateProgress(percent) {
        const progressEl = document.getElementById('download-progress');
        if (progressEl) {
            progressEl.style.width = percent + '%';
        }
    }

    // ==================== HANDLERS ====================

    async function handleDownloadClick() {
        const btn = document.getElementById('scribd-dl-btn');
        const docId = getDocumentId();

        if (!docId) {
            showStatus('❌ Document ID not found!');
            return;
        }

        if (!isEmbedPage()) {
            // Redirect to embed page
            showStatus('🔄 Redirecting to embed page...', 0);
            const embedUrl = getEmbedUrl(docId);
            window.location.href = embedUrl;
            return;
        }

        // We're on embed page, start download process
        btn.classList.add('loading');
        btn.innerHTML = '<span class="icon">⏳</span>Processing...';

        try {
            showModal('🔄 Loading all pages...', false, 0);

            // Step 1: Scroll through all pages
            await scrollAllPages((progress) => {
                updateProgress(progress);
                showModal(`📄 Loading pages... (${progress}%)`, false, progress);
            });

            // Step 2: Remove toolbars
            showModal('🧹 Cleaning up interface...', false, 60);
            await sleep(500);
            const removed = removeToolbars();

            // Step 3: Cleanup for print
            showModal('✨ Optimizing for print...', false, 80);
            await sleep(500);
            cleanupForPrint();

            // Step 4: Ready to print
            showModal('✅ Ready! Click the button below to save PDF', true, 100);

            btn.classList.remove('loading');
            btn.innerHTML = '<span class="icon">✅</span>Ready!';

        } catch (error) {
            console.error('Scribd Downloader Error:', error);
            showModal('❌ An error occurred: ' + error.message, false, 0);
            btn.classList.remove('loading');
            btn.innerHTML = '<span class="icon">📥</span>Download PDF';
        }
    }

    // ==================== INITIALIZATION ====================

    function init() {
        // Wait for page to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(createDownloadButton, 1000);
            });
        } else {
            setTimeout(createDownloadButton, 1000);
        }
    }

    init();

})();
