// about.js - Feature modal functionality

document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('feature-modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const closeBtn = document.querySelector('.close');
  const feBoxes = document.querySelectorAll('#about-page .fe-box');

  // Click handlers for each feature box
  feBoxes.forEach((box, index) => {
    box.addEventListener('click', () => {
      const imgSrc = box.querySelector('img').getAttribute('data-modal-img') || box.querySelector('img').src;
      const title = box.querySelector('h6').textContent;
      const desc = box.querySelector('.box-desc') ? box.querySelector('.box-desc').textContent : 'Learn more about our ' + title.toLowerCase() + ' services.';
      
      modalImg.src = imgSrc;
      modalTitle.textContent = title;
      modalDesc.textContent = desc;
      modal.style.display = 'block';
    });
  });

  // Close modal
  closeBtn.onclick = () => modal.style.display = 'none';
  window.onclick = (event) => {
    if (event.target === modal) modal.style.display = 'none';
  };
});

// Team section slider (if added later)
function initTeamSlider() {
  // Placeholder for future slider
}

