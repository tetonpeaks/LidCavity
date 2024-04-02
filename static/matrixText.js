const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Characters to display
const characters = '01';
const fontSize = 16;
const columns = canvas.width / fontSize;

// Create an array to store the dropping characters
const drops = [];
for (let i = 0; i < columns; i++) {
  drops[i] = 1; // Initialize each drop position
}

function draw() {
  // Set a semi-transparent background to create a trailing effect
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#0F0'; // Change color if needed
  ctx.font = `${fontSize}px monospace`;

  // Loop through each column to draw characters
  for (let i = 0; i < drops.length; i++) {
    const text = characters[Math.floor(Math.random() * characters.length)];

    // Draw the character at this column
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    // Move the character down
    drops[i]++;

    // Reset drop position if it goes out of the screen
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
      drops[i] = 0;
    }
  }
}

function animateMatrix() {
  requestAnimationFrame(animateMatrix);
  draw();
}

animateMatrix();
