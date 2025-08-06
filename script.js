// Smooth Scroll for navigation links
document.querySelectorAll('nav ul li a').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Toggle navbar menu on small screens
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('nav ul');

menuToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  menuToggle.classList.toggle('open');
});

// Scroll-triggered animations
const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');

const animateOnScroll = () => {
  const triggerBottom = window.innerHeight * 0.85;

  elementsToAnimate.forEach(el => {
    const boxTop = el.getBoundingClientRect().top;

    if (boxTop < triggerBottom) {
      el.classList.add('show');
    } else {
      el.classList.remove('show');
    }
  });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Hero section background video fallback handling (optional)
const heroVideo = document.getElementById('heroVideo');
if (heroVideo) {
  heroVideo.addEventListener('error', () => {
    const fallbackImage = document.createElement('div');
    fallbackImage.className = 'fallback-hero';
    document.querySelector('.hero').appendChild(fallbackImage);
    heroVideo.style.display = 'none';
  });
}
