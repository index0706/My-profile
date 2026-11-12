# Personal Digital Resume - Charles Richard O. Situ
**Information Technology Student | STI College Marikina**

A modern, responsive, and professional personal digital resume website built with clean **HTML5**, **CSS3**, and **Vanilla JavaScript**. Designed with an IT-themed dark navy, black, white, and light blue aesthetic.

---

## 📁 Project Structure

```text
WebSite Firstbuild/
│
├── index.html          # Main HTML5 structure and content
├── style.css           # Styling, themes (Dark/Light mode), responsive media queries
├── script.js           # Interactive functionality (Theme toggle, Mobile menu, Modal, etc.)
├── README.md           # Instructions for customization and deployment
└── assets/
    ├── resume.pdf      # Charles Richard O. Situ's downloadable resume PDF
    ├── profile.jpg     # (Placeholder) Your professional profile picture
    ├── cert-java.jpg   # (Placeholder) Java Fundamentals certificate
    ├── cert-sap.jpg    # (Placeholder) SAP certificate
    ├── cert-ethical-hacking.jpg   # (Placeholder) Ethical Hacking certificate
    └── cert-cybersecurity.jpg     # (Placeholder) Cybersecurity certificate
```

---

## 🚀 How to Run the Website (With Automatic Live Reload)

### Method 1: One-Click Live Reload (Recommended!)
We created an automatic Live Reload server specifically for your workflow:
1. Double-click the file [**`start_live_preview.bat`**](file:///c:/Users/My%20PC/Documents/WebSite%20Firstbuild/start_live_preview.bat) in this folder.
   - Or open PowerShell / Terminal and run:
     ```powershell
     python dev_server.py
     ```
2. Your browser will automatically open to `http://localhost:3000`.
3. **Live Auto-Refresh is active!**
   - Whenever you edit `index.html`, `style.css`, or `script.js` and press **Ctrl + S** (Save), the browser will **instantly reload automatically** without you needing to press F5 or refresh manually!
   - CSS changes are hot-reloaded instantly without even losing your scroll position.

---

### Method 2: VS Code "Live Server" Extension
If you are using Visual Studio Code:
1. Install the recommended **Live Server** extension (by *Ritwick Dey*).
2. Right-click `index.html` and click **"Open with Live Server"** (or click "Go Live" at the bottom right status bar).
3. Any save in VS Code will automatically refresh the page.

---

### Method 3: Direct File View
Simply double-click `index.html` to open it as a local file (`file:///...`). If `dev_server.py` is running in the background, live-reload will work here as well.

---

## 🎨 How to Personalize & Upload Your Files

### Option A: Direct In-Browser Upload & Automatic Download (Easiest!)
You don't even need to move files between folders manually:
1. **Profile Photo**: Click **"Upload Photo"** or click on your profile picture directly on the website to choose a picture from your computer or phone.
   - It will immediately appear on the site.
   - It is permanently saved in your browser's persistent storage (`localStorage`).
   - It automatically triggers a download of `Charles_Richard_Situ_Profile.jpg` to your downloads folder!
2. **Certificates**: On each of the 4 Certificate cards (or inside the **View Certificate** modal), click **"Upload"**:
   - Choose your certificate image file.
   - The card and preview modal update immediately.
   - It is saved in the websystem and automatically downloaded as a standardized file (e.g. `Java_Fundamentals_Certification.png`).
3. **Automatic Certificate Download**:
   - Click **"Download"** on any certificate card or in the preview modal.
   - If you uploaded your certificate image, it downloads that image directly.
   - If you haven't uploaded an image yet, the websystem automatically draws and downloads an authentic, high-resolution official **Certificate of Achievement** with your name (**Charles Richard O. Situ**) and **STI College Marikina** branding!

---

### Option B: Manual File Placement
You can also directly drop your files into the `assets/` folder:
- **Profile Photo**: `assets/profile.jpg`
- **Resume PDF**: `assets/resume.pdf` *(starter placeholder PDF provided)*
- **Certificates**:
  - `assets/cert-java.jpg` — Java Fundamentals Certification
  - `assets/cert-sap.jpg` — SAP Certification
  - `assets/cert-ethical-hacking.jpg` — Ethical Hacking Certification
  - `assets/cert-cybersecurity.jpg` — Introduction to Cybersecurity Certification

---

## ✨ Features Included

- **Dark / Light Mode**: Instant toggle with theme memory stored in `localStorage`.
- **Responsive Navigation**: Desktop sticky header + animated mobile drawer menu.
- **Scroll Spy**: Highlights active navigation links as you scroll through sections.
- **Interactive Certificate Modal**: Popup preview with keyboard accessibility (Escape key support).
- **One-Click Clipboard Copy**: Click "Copy" on Email or Phone to copy contact details with toast notifications.
- **Direct Mailto & Tel Links**: Contact buttons ready for recruiters to email or call directly.
- **Smooth Animations**: Subtle scroll-reveal effects and floating "Back to Top" button.
- **Zero Framework Bloat**: 100% lightweight Vanilla JS and CSS3 without heavy external libraries.

---

## 🌐 Free Hosting / Deployment

To share this digital resume with employers and recruiters:
1. **GitHub Pages**:
   - Push this folder to a GitHub repository named `charlessitu-resume` or `<your-username>.github.io`.
   - In GitHub Settings > Pages, select the `main` branch. Your site will be live at `https://<your-username>.github.io`.
2. **Netlify or Vercel**:
   - Drag and drop this folder directly into the Netlify dashboard for an instant live URL.
