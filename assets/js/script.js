// Configuration
const config = {
    cardCount: 15,
    maxSpeed: 0.5,
    rotationSpeed: 0.05,
    spaceScale: 5,
    scrollSmoothness: 0.08,
    images: [
        "assets/cards/card1.GIF",
        "assets/cards/card2.PNG",
        "assets/cards/card3.PNG",
        "assets/cards/card4.PNG",
        "assets/cards/card5.GIF",
        "assets/cards/card6.PNG",
        "assets/cards/card7.PNG",
        "assets/cards/card8.PNG",
        "assets/cards/card9.PNG",
        "assets/cards/card10.PNG",
        "assets/cards/card11.PNG",
        "assets/cards/card12.PNG",
        "assets/cards/card13.GIF"
    ]
};

// State
let scrollY = 0;
let targetScrollY = 0;
let cards = [];
let lastTime = 0;

// DOM Elements
const cardContainer = document.getElementById('cardContainer');
const scrollIndicator = document.getElementById('scrollIndicator');

// Avoid overlapping / close cards
function isTooClose(newX, newY, existingCards, minDistance = 150) {
    return existingCards.some(card => {
        const dx = newX - parseFloat(card.dataset.x);
        const dy = newY - parseFloat(card.dataset.y);
        return Math.sqrt(dx * dx + dy * dy) < minDistance;
    });
}

// Create cards
function createCards() {
    const virtualHeight = window.innerHeight * config.spaceScale;
    
    
    for (let i = 0; i < config.cardCount; i++) {
        const card = document.createElement('div');
        card.className = 'floating-card';
        
        const img = document.createElement('img');
        img.src = config.images[i % config.images.length];
        img.alt = `Floating Card ${i+1}`;
        card.appendChild(img);
        
        let posX, posY;
        let attempts = 0;
        do {
            posX = Math.random() * window.innerWidth;
            posY = Math.random() * virtualHeight;
            attempts++;
        } while (isTooClose(posX, posY, cards) && attempts < 50);

        // Random initial position in 3D space
        const z = (Math.random() - 0.5) * 500;
        const yRot = Math.random() * 0;
        const xRot = Math.random() * 360;
        const zRot = Math.random() * 360;   

        card.style.transform = `
            translate3d(${posX}px, ${posY}px, ${z}px)
            rotateX(${xRot}deg)
            rotateY(${yRot}deg)
            rotateZ(${zRot}deg)
        `;

        // Movement parameters
        card.dataset.x = posX;
        card.dataset.y = posY;
        card.dataset.z = z;
        card.dataset.yRot = yRot;
        card.dataset.xRot = xRot;
        card.dataset.zRot = zRot;
        card.dataset.xSpeed = (Math.random() - 0.5) * config.maxSpeed;
        card.dataset.ySpeed = (Math.random() - 0.5) * config.maxSpeed * 0.02;
        card.dataset.zSpeed = (Math.random() - 0.5) * config.maxSpeed * 0.01;
        card.dataset.rotSpeed = (Math.random() - 0.5) * config.rotationSpeed;
        
        cardContainer.appendChild(card);
        cards.push(card);
    }
}

// Animation loop
function animate(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    
    // Smooth scroll with damping
    scrollY += (targetScrollY - scrollY) * config.scrollSmoothness;
   
    // Update card positions
    cards.forEach(card => {
        let x = parseFloat(card.dataset.x);
        let y = parseFloat(card.dataset.y);
        let renderY = y - scrollY * 0.08;
        let z = parseFloat(card.dataset.z);
        let yRot = parseFloat(card.dataset.yRot);
        let xRot = parseFloat(card.dataset.xRot);
        let zRot = parseFloat(card.dataset.zRot);

        const xSpeed = parseFloat(card.dataset.xSpeed);
        const ySpeed = parseFloat(card.dataset.ySpeed);
        const zSpeed = parseFloat(card.dataset.zSpeed);
        const rotSpeed = parseFloat(card.dataset.rotSpeed);
        
        // Update position (independent of scroll)
        x += xSpeed;
        y += ySpeed;
        z += zSpeed;
        
        // Update rotation
        yRot += rotSpeed * 0;
        xRot += rotSpeed * 35;
        zRot += rotSpeed * 10;
        
        // Boundary checks with wrapping
        //if (x < -300) x = window.innerWidth + 300;
        //if (x > window.innerWidth + 300) x = -300;
        //if (y < -400) y = window.innerHeight * config.spaceScale + 400;
        //if (y > window.innerHeight * config.spaceScale + 400) y = -400;
        //if (z < -600) z = 600;
        //if (z > 600) z = -600;
        
        // Apply transformations
        card.style.transform = `
            translate3d(${x}px, ${renderY}px, ${z}px)
            rotateY(${yRot}deg)
        `;
        
        // Update data attributes
        card.dataset.x = x;
        card.dataset.y = y; // Store actual y position
        card.dataset.z = z;
        card.dataset.yRot = yRot;
        card.dataset.xRot = xRot;
        card.dataset.zRot = zRot;
        
        // Depth effect
        const scale = 1 - Math.min(Math.abs(z) / 1000, 0.3);
        card.style.opacity = scale;
    });
    
    requestAnimationFrame(animate);
}

// Event listeners
window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY;
}, { passive: true });

// Initialize
window.addEventListener('load', () => {
    createCards();
    requestAnimationFrame(animate);
});

// Handle resize
window.addEventListener('resize', () => {
    cards.forEach(card => {
        // Keep cards within bounds
        const currentX = parseFloat(card.dataset.x);
        card.dataset.x = Math.max(-300, Math.min(currentX, window.innerWidth + 300));
    });
});


  