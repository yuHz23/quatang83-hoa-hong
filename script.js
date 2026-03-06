const imageList = [
    "08aef0a4-70a5-4aab-8653-77a95c2ce6a8.jpg",
    "0db28a88-f5b1-4867-ae2c-818d771f44c1.jpg",
    "267a78fb-47bd-4b52-af24-efc202da07d6.jpg",
    "486fc3a7-2feb-42b6-b9aa-2b66ffe4b4f6.jpg",
    "4fd2b28f-fa6c-45c9-9ec5-422e61c8b78b.jpg",
    "5dde6872-64d4-4a17-9571-5947d80f7cc4.jpg",
    "6160ecd8-17b6-4653-b122-521d94f472b7.jpg",
    "62116772-59e1-4fd8-b780-3efbbe09c5b2.jpg",
    "9e857cd7-5fd7-4053-b353-23b92f05d15a.jpg",
    "d4124338-7768-442a-a762-4119ebddae40.jpg",
    "e2af688f-997f-49e6-882a-457655a4d923.jpg"
];
let bubblesContainer = null;

document.addEventListener("DOMContentLoaded", () => {
    const welcomeScreen = document.getElementById("welcome-screen");
    const mainScreen = document.getElementById("main-screen");
    const bgMusic = document.getElementById("bg-music");
    bubblesContainer = document.getElementById("bubbles-container");

    const envelopeBtn = document.getElementById("envelope-button");
    const bouquet = document.getElementById("bouquet");

    // Initialize welcome screen sparkles and falling hearts
    createWelcomeEffects();

    // Automatically bloom the bouquet after a short delay
    setTimeout(() => {
        bouquet.classList.add("blooming");
    }, 500);

    envelopeBtn.addEventListener("click", () => {
        // Animate envelope opening (need to find the child envelope inside the button now)
        envelopeBtn.querySelector('.envelope').classList.add("opening");

        // Wait for flap animation then fade out welcome screen
        setTimeout(() => {
            welcomeScreen.classList.add("hidden");
            mainScreen.classList.remove("hidden");

            // Play background music at exactly 40 seconds
            bgMusic.currentTime = 40;
            bgMusic.play().catch(e => console.log("Audio play failed:", e));

            // Start generating floating bubbles and petals
            createBubbles();
            createPetals();

            // Start typewriter effect for the letter
            startTypewriter();
        }, 800); // Wait for screen fade
    }, 600); // Wait for flap animation
});

function createPetals() {
    const petalsContainer = document.getElementById("petals-container");
    if (!petalsContainer) return;

    // Create 30 falling petals
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const petal = document.createElement("div");
            petal.classList.add("petal");

            // Randomize size, position, and duration
            const size = Math.random() * 10 + 10; // 10px to 20px
            petal.style.width = `${size}px`;
            petal.style.height = `${size}px`;

            petal.style.left = `${Math.random() * 100}vw`;

            const duration = Math.random() * 8 + 6; // 6s to 14s
            petal.style.animationDuration = `${duration}s`;

            // Randomize starting delay
            petal.style.animationDelay = `${Math.random() * 5}s`;

            petalsContainer.appendChild(petal);

            // Remove and recreate petal when it falls down
            setTimeout(() => {
                petal.remove();
                createSinglePetal(petalsContainer);
            }, (duration + 5) * 1000);
        }, i * 300);
    }
}

function createSinglePetal(container) {
    if (!container) return;
    const petal = document.createElement("div");
    petal.classList.add("petal");

    const size = Math.random() * 10 + 10;
    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;
    petal.style.left = `${Math.random() * 100}vw`;

    const duration = Math.random() * 8 + 6;
    petal.style.animationDuration = `${duration}s`;

    container.appendChild(petal);

    setTimeout(() => {
        petal.remove();
        createSinglePetal(container);
    }, duration * 1000);
}

function startTypewriter() {
    const speed = 40; // typing speed in ms

    // Source texts
    const textH2 = document.getElementById("text-h2").innerHTML;
    const textP1 = document.getElementById("text-p1").innerHTML;
    const textP2 = document.getElementById("text-p2").innerHTML;

    // Destination elements
    const destH2 = document.getElementById("typewriter-h2");
    const destP1 = document.getElementById("typewriter-p1");
    const destP2 = document.getElementById("typewriter-p2");

    function typeWriter(text, element, callback) {
        element.innerHTML = '<span class="typed-text"></span><span class="pen"></span>';
        const textSpan = element.querySelector('.typed-text');
        const penSpan = element.querySelector('.pen');

        let i = 0;
        function type() {
            if (i < text.length) {
                // If it's an HTML entity or break, we should ideally handle it, but plain text works well
                textSpan.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                penSpan.remove(); // Remove the pen so it moves to the next section
                if (callback) callback();
            }
        }
        type();
    }

    // Sequence the typing
    typeWriter(textH2, destH2, () => {
        setTimeout(() => {
            typeWriter(textP1, destP1, () => {
                setTimeout(() => {
                    typeWriter(textP2, destP2, () => {
                        // Finally show signature
                        const signature = document.querySelector(".signature");
                        if (signature) signature.classList.add("show");
                    });
                }, 500); // Wait half a second before typing wish
            });
        }, 300); // Wait before typing body
    });
}

function createBubbles() {
    // Number of bubbles to show
    const maxBubbles = 15;

    for (let i = 0; i < maxBubbles; i++) {
        setTimeout(createSingleBubble, i * 800); // Stagger bubble creation
    }
}

function createSingleBubble() {
    if (!bubblesContainer) return;

    const bubble = document.createElement("div");
    bubble.classList.add("bubble");

    // Randomize image
    const img = document.createElement("img");
    const randomImg = imageList[Math.floor(Math.random() * imageList.length)];
    img.src = "assets/" + randomImg;
    bubble.appendChild(img);

    // Randomize size between 60px and 120px
    const size = Math.floor(Math.random() * 60) + 60;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;

    // Randomize horizontal position (left)
    const leftPos = Math.random() * 90; // 0 to 90%
    bubble.style.left = `${leftPos}%`;

    // Randomize float duration between 10s and 25s for slow, romantic feel
    const duration = Math.random() * 15 + 10;
    bubble.style.animationDuration = `${duration}s`;

    // Randomize animation delay so they don't all start at exactly the same time again
    const delay = Math.random() * 5;
    bubble.style.animationDelay = `${delay}s`;

    bubblesContainer.appendChild(bubble);

    // Remove bubble when animation ends to prevent DOM overload
    setTimeout(() => {
        bubble.remove();
        // Create a new one to keep the loop going if needed
        createSingleBubble();
    }, (duration + delay) * 1000);
}

function createWelcomeEffects() {
    const sparklesContainer = document.getElementById("sparkles-container");
    const heartsContainer = document.getElementById("welcome-hearts-container");

    // Create 40 sparkles
    if (sparklesContainer) {
        for (let i = 0; i < 40; i++) {
            const sparkle = document.createElement("div");
            sparkle.classList.add("sparkle");
            sparkle.style.left = `${Math.random() * 100}%`;
            sparkle.style.top = `${Math.random() * 100}%`;
            sparkle.style.animationDuration = `${Math.random() * 3 + 1.5}s`;
            sparkle.style.animationDelay = `${Math.random() * 2}s`;
            sparklesContainer.appendChild(sparkle);
        }
    }

    // Create falling hearts
    if (heartsContainer) {
        let gyroTilt = 0;

        // Listen to gyroscope
        if (window.DeviceOrientationEvent) {
            window.addEventListener("deviceorientation", (event) => {
                if (event.gamma !== null) {
                    // limit tilt to reasonable bounds (-45 to 45)
                    let tilt = event.gamma;
                    if (tilt > 45) tilt = 45;
                    if (tilt < -45) tilt = -45;

                    // Smoothly update global tilt var to apply to hearts
                    gyroTilt = tilt * 1.5; // multiplier for stronger effect
                    heartsContainer.style.transform = `translateX(${gyroTilt}px)`;
                }
            });
        }

        // Generate hearts loop
        function spawnWelcomeHeart() {
            const welcomeScreen = document.getElementById("welcome-screen");
            if (!welcomeScreen || welcomeScreen.classList.contains("hidden")) return; // Stop if screen went away

            const heart = document.createElement("div");
            heart.classList.add("welcome-heart");
            heart.innerHTML = "❤";
            heart.style.left = `${Math.random() * 100}%`;

            const duration = Math.random() * 5 + 4; // 4s to 9s fall
            heart.style.animationDuration = `${duration}s`;

            // Randomize size
            const size = Math.random() * 0.8 + 0.6; // 0.6 to 1.4 rem
            heart.style.fontSize = `${size}rem`;

            // Randomize animation delay a bit
            heart.style.animationDelay = `${Math.random() * 2}s`;

            heartsContainer.appendChild(heart);

            // Remove when done
            setTimeout(() => {
                if (heart.parentNode === heartsContainer) {
                    heart.remove();
                }
            }, (duration + 2) * 1000);

            // Queue next heart
            setTimeout(spawnWelcomeHeart, Math.random() * 300 + 200);
        }

        // Start spawning initial batch
        for (let i = 0; i < 8; i++) {
            setTimeout(spawnWelcomeHeart, i * 400);
        }
    }
}

