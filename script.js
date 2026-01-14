// Theme Logic
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check Local Storage
if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark');
  themeToggle.checked = true;
}

// Toggle Event
themeToggle.addEventListener('change', () => {
  if (themeToggle.checked) {
    body.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    body.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
});

// Tab Logic
function switchTab(tabId) {
  // Hide all pages
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('active'));

  // Show target page
  const target = document.getElementById(tabId);
  if (target) {
    target.classList.add('active');
    window.scrollTo(0, 0);
  }

  // Update Nav Icons
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => item.classList.remove('active'));

  // Find active nav item based on click or tabId map
  // Simple loop to match index if structured correctly, 
  // or we can add IDs to nav items.
  // For now, let's just highlight based on text matching purely for this demo?
  // Better: Add ID-based highlighting.

  // Map tabId to Index for simplicity in this small app
  const map = {
    'content-home': 0,
    'content-batches': 1,
    'content-routine': 2,
    'content-downloads': 3,
    'content-join': 4
  };

  if (navItems[map[tabId]]) {
    navItems[map[tabId]].classList.add('active');
  } else if (tabId === 'content-about') {
    // About doesn't have a direct nav item, maybe keep 'Home' active or none?
    // Let's keep none active for sub-pages or Home.
    navItems[0].classList.add('active'); // Fallback to home
  }
}

// WhatsApp Logic
function sendWA() {
  const name = document.getElementById('sName').value.trim();
  const g = document.getElementById('gName').value.trim();
  const p = document.getElementById('phone').value.trim();
  const b = document.getElementById('batch').value;
  const s = document.getElementById('subs').value;

  if (!name || !p) {
    alert("Please enter Student Name and Contact Number");
    return;
  }

  const msg =
    `*ADMISSION REQUEST*
         👤 Student: ${name}
         🏠 Guardian: ${g || "-"}
         📱 Contact: ${p}
         📚 Batch: ${b}
         📝 Subjects: ${s}`;

  window.open(
    "https://wa.me/916001539070?text=" + encodeURIComponent(msg),
    "_blank"
  );
}
