// imageList removed as bubbles now use hearts

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

        // Wait slightly for flap animation then fade out welcome screen
        setTimeout(() => {
            welcomeScreen.classList.add("hidden");
            mainScreen.classList.remove("hidden");

            // Start generating floating bubbles and petals
            createBubbles();
            createPetals();

            // Start typewriter effect for the letter
            startTypewriter();

            // Initialize interactions for the back side
            setupMeetMeInteractions();

            // Play background music
            try {
                bgMusic.currentTime = 40;
                let playPromise = bgMusic.play();
                if (playPromise !== undefined) {
                    playPromise.catch(e => console.log("Audio play failed:", e));
                }
            } catch (e) {
                console.log("Audio exception:", e);
            }
        }, 300); // reduced from 800ms waiting for flap
    });

    // NOTE: setupMeetMeInteractions is called inside the envelope click handler
    // after the main screen loads. DO NOT call it here again or event listeners
    // will be duplicated and conflict.
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

                        // Show the heart guide after a short delay
                        setTimeout(() => {
                            const heartGuide = document.getElementById("heart-guide");
                            if (heartGuide) {
                                heartGuide.classList.remove("hidden");
                                heartGuide.style.animation = "fadeInUp 0.8s ease-out forwards";
                            }
                        }, 1000);
                    });
                }, 500); // Wait half a second before typing wish
            });
        }, 300); // Wait before typing body
    });
}

function setupMeetMeInteractions() {
    const flipTrigger = document.getElementById("heart-flip-trigger");
    const container = document.querySelector(".letter-container");
    const btnDecline = document.getElementById("btn-decline");
    const btnAgree = document.getElementById("btn-agree");
    const interactionArea = document.getElementById("back-interaction-area");
    const btnFlipBack = document.getElementById("btn-flip-back");

    let declineCount = 0;

    // Flip-back button on the back side
    if (btnFlipBack) {
        btnFlipBack.addEventListener("click", (e) => {
            e.stopPropagation();
            container.classList.remove("flipped");
        });
    }

    if (flipTrigger) {
        // Toggle flip, but only when the signature is shown (typewriter finished)
        flipTrigger.addEventListener("click", (e) => {
            e.stopPropagation();
            const signature = document.querySelector(".signature");
            if (signature && signature.classList.contains("show")) {
                container.classList.toggle("flipped");
            }
        });
    }



    const handleAgree = () => {
        const overlay = document.createElement("div");
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8); display: flex; justify-content: center;
            align-items: center; z-index: 3000; backdrop-filter: blur(10px);
        `;

        const modal = document.createElement("div");
        modal.style.cssText = `
            background: white; padding: 40px; border-radius: 30px;
            text-align: center; max-width: 85%; box-shadow: 0 20px 50px rgba(0,0,0,0.4);
            animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border: 5px solid #ff7eb3;
        `;

        modal.innerHTML = `
            <div style="font-size: 60px; margin-bottom: 20px;">💖🌸</div>
            <h2 style="color: #ff4757; font-family: 'Dancing Script', cursive; font-size: 2.5rem; margin-bottom: 20px;">Ôi bé đồng ý rồi nha!</h2>
            <p style="font-size: 1.2rem; color: #444; line-height: 1.8; margin-bottom: 30px;">
                Cảm ơn người thương của anh nhiều thiệt nhiều! 🥰<br>
                Thứ 7 này đi chơi với anh nha ❤️<br>
                Thương bé nhất trên đời luôn! ❤️
            </p>
            <button class="btn-primary" id="btn-modal-close" style="padding: 15px 40px; font-size: 1.2rem;">Hẹn gặp bé nhé! 🌹</button>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        document.getElementById("btn-modal-close").onclick = () => {
            overlay.remove();
            // Flip back to the letter front after closing
            const c = document.querySelector(".letter-container");
            if (c) c.classList.remove("flipped");
        };
    };

    if (btnDecline) {
        btnDecline.addEventListener("click", (e) => {
            e.stopPropagation();
            declineCount++;

            if (declineCount <= 3) {
                // Get bounds of the interaction area specifically
                const areaRect = interactionArea.getBoundingClientRect();
                const btnWidth = btnDecline.offsetWidth;
                const btnHeight = btnDecline.offsetHeight;

                // Move within the back side container instead of absolute body
                // Using relative positioning relative to interactionArea
                btnDecline.style.position = "absolute";

                const maxX = areaRect.width - btnWidth;
                const maxY = areaRect.height - btnHeight + 50; // allow a bit of vertical range

                const randomX = Math.random() * maxX;
                const randomY = (Math.random() * maxY) - 50; // allow moving up slightly

                btnDecline.style.left = `${randomX}px`;
                btnDecline.style.top = `${randomY}px`;
                btnDecline.style.transition = "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)";

                // Add a cute shake or frustration animation to the button
                btnDecline.animate([
                    { transform: 'translateX(0)' },
                    { transform: 'translateX(-5px)' },
                    { transform: 'translateX(5px)' },
                    { transform: 'translateX(0)' }
                ], { duration: 200, iterations: 2 });
            }

            if (declineCount >= 3) {
                // On 3rd click show intent, on 4th it becomes Agree
                if (declineCount === 3) {
                    btnDecline.innerText = "Ơ kìa...";
                } else {
                    btnDecline.innerText = "Thôi Đồng ý đi mà ❤️";
                    btnDecline.classList.remove("btn-secondary");
                    btnDecline.classList.add("btn-primary");
                    btnDecline.style.position = "static";
                    btnDecline.style.transform = "scale(1.2)";
                    btnDecline.onclick = handleAgree;
                }
            }
        });
    }

    if (btnAgree) {
        btnAgree.addEventListener("click", (e) => {
            e.stopPropagation();
            handleAgree();
        });
    }
}

// Global audio for pop sound
const popSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3"); // Cute pop sound

function showPhotoViewer(imgSrc) {
    const photoViewer = document.getElementById("photo-viewer");
    const viewerImg = document.getElementById("viewer-img");
    const closeViewer = document.getElementById("close-viewer");

    if (photoViewer && viewerImg) {
        viewerImg.src = imgSrc;
        photoViewer.classList.remove("hidden");

        // Play pop sound
        popSound.currentTime = 0;
        popSound.play().catch(e => console.log("Sound error:", e));

        // Support both click and touch for mobile close
        const closeViewer = document.getElementById("close-viewer");
        const doClose = (e) => { e.stopPropagation(); photoViewer.classList.add("hidden"); };
        const doCloseOverlay = (e) => { if (e.target === photoViewer) photoViewer.classList.add("hidden"); };
        closeViewer.onclick = doClose;
        closeViewer.ontouchend = doClose;
        photoViewer.onclick = doCloseOverlay;
        photoViewer.ontouchend = doCloseOverlay;
    }
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

    // Set heart symbol
    bubble.innerHTML = "❤️";
    bubble.style.display = "flex";
    bubble.style.justifyContent = "center";
    bubble.style.alignItems = "center";
    bubble.style.fontSize = "2rem";
    bubble.style.color = "#ff4757";
    bubble.style.textShadow = "0 0 10px rgba(255, 71, 87, 0.5)";


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

}

