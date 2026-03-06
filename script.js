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

    // Automatically bloom the bouquet after a short delay
    setTimeout(() => {
        bouquet.classList.add("blooming");
    }, 500);

    envelopeBtn.addEventListener("click", () => {
        // Animate envelope opening (need to find the child envelope inside the button now)
        envelopeBtn.querySelector('.envelope').classList.add("opening");

        // Wait for flap animation then fade out welcome screen
        setTimeout(() => {
            welcomeScreen.style.opacity = "0";

            setTimeout(() => {
                welcomeScreen.classList.add("hidden");
                mainScreen.classList.remove("hidden");

                // Play background music at exactly 40 seconds
                bgMusic.currentTime = 40;
                bgMusic.play().catch(e => console.log("Audio play failed:", e));

                // Start generating floating bubbles
                createBubbles();
            }, 800); // Wait for screen fade
        }, 600); // Wait for flap animation
    });
});

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
