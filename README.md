<div align="center">

# 📚 Scribd Downloader

### 🚀 Download any document from Scribd as PDF — for free!

<br/>

[![GitHub stars](https://img.shields.io/github/stars/ThanhNguyxn/scribd-downloader?style=for-the-badge&logo=github&color=yellow)](https://github.com/ThanhNguyxn/scribd-downloader/stargazers)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge&logo=opensourceinitiative&logoColor=white)](LICENSE)
[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-Ready-00485B?style=for-the-badge&logo=tampermonkey&logoColor=white)](https://www.tampermonkey.net/)

<br/>

<img src="https://img.shields.io/badge/Chrome-Supported-4285F4?style=flat-square&logo=googlechrome&logoColor=white"/>
<img src="https://img.shields.io/badge/Firefox-Supported-FF7139?style=flat-square&logo=firefox&logoColor=white"/>
<img src="https://img.shields.io/badge/Edge-Supported-0078D7?style=flat-square&logo=microsoftedge&logoColor=white"/>

---

**✨ One-click download • 🎯 Auto-scroll all pages • 🧹 Clean PDF output**

</div>

<br/>

## 🎬 Quick Start

### 1️⃣ Install Tampermonkey

| Browser | Link |
|:-------:|:----:|
| <img src="https://img.shields.io/badge/Chrome-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white"/> | [Install](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) |
| <img src="https://img.shields.io/badge/Firefox-FF7139?style=for-the-badge&logo=firefox&logoColor=white"/> | [Install](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/) |
| <img src="https://img.shields.io/badge/Edge-0078D7?style=for-the-badge&logo=microsoftedge&logoColor=white"/> | [Install](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd) |

### 2️⃣ Install Script

Click 👉 [**`userscript.js`**](userscript.js) → Tampermonkey will prompt → Click **Install**

### 3️⃣ Download!

1. 🌐 Open any Scribd document
2. 📥 Click the **Download PDF** button (bottom-right)
3. ⏳ Wait for all pages to load
4. 🖨️ Save as PDF in print dialog

<br/>

## 🖨️ Print Settings

> 💡 For best results, use these settings:

| Setting | Value |
|:--------|:------|
| Destination | `Save as PDF` |
| Margins | `None` |
| Background graphics | `✅ On` |

<br/>

## 📂 Files

```
📦 scribd-downloader
 ┣ 📜 userscript.js               ← Install this!
 ┣ 🐍 scribd-downloader.py        ← Python alternative
 ┗ 📋 requirements.txt
```

<br/>

## 🐍 Python Alternative

> For developers who prefer Python or need more control

### Requirements

| Package | Install |
|:--------|:--------|
| ![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=flat-square&logo=python&logoColor=white) | [Download](https://www.python.org/downloads/) |
| ![Chrome](https://img.shields.io/badge/Chrome-Browser-4285F4?style=flat-square&logo=googlechrome&logoColor=white) | [Download](https://www.google.com/chrome/) |
| ![Selenium](https://img.shields.io/badge/Selenium-43B02A?style=flat-square&logo=selenium&logoColor=white) | `pip install selenium` |

### Quick Start

```bash
# Clone
git clone https://github.com/ThanhNguyxn/scribd-downloader.git
cd scribd-downloader

# Install dependencies
pip install -r requirements.txt

# Run
python scribd-downloader.py
```

### Usage

```
Input link Scribd: https://www.scribd.com/document/123456789/Document-Name
```

The script will:
1. 🔗 Convert URL to embed format
2. 🌐 Open Chrome with DevTools
3. 📜 Auto-scroll all pages
4. 🧹 Remove toolbars
5. 🖨️ Open print dialog

<br/>

## ⚠️ Disclaimer

> This tool is for **personal & educational use only**.  
> Please respect copyright and Scribd's terms of service.

<br/>

---

<div align="center">

### ⭐ Star this repo if it helped you!

<br/>

[![Made with ❤️](https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge)](https://github.com/ThanhNguyxn)
[![GitHub](https://img.shields.io/badge/ThanhNguyxn-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ThanhNguyxn)

</div>
