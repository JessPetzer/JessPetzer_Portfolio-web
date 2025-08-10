document.addEventListener('DOMContentLoaded', function () {
  // === TYPEWRITER EFFECT ===
  const words = ["Authentic.", "Intentional.", "Intuitive.", "Human-centric."];
  let i = 0, j = 0, isDeleting = false;
  const speed = 150;
  const target = document.getElementById("typewriter");

  function type() {
    const currentWord = words[i];
    if (!isDeleting) {
      target.textContent = currentWord.substring(0, j + 1);
      j++;
      if (j === currentWord.length) {
        isDeleting = true;
        return setTimeout(type, 1400);
      }
    } else {
      target.textContent = currentWord.substring(0, j - 1);
      j--;
      if (j === 0) {
        isDeleting = false;
        i = (i + 1) % words.length;
        return setTimeout(type, 800);
      }
    }
    setTimeout(type, isDeleting ? speed / 2 : speed);
  }

  if (target) type();

  // === LINE OBSERVER ===
  const line = document.querySelector('.animated-lineHome');
  if (line) {
    const lineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 1 });
    lineObserver.observe(line);
  }

 // === CONTACT FORM POPUP ===
const form = document.querySelector('.contact-form');
const popup = document.getElementById('thankYouPopup');
const closeBtn = document.getElementById('closePopupBtn');

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(form);
    fetch(form.action, {
      method: form.method,
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
    .then(response => {
      if (response.ok) {
        popup.style.display = 'flex';
        popup.classList.remove('fade-in'); // Reset if already shown
        void popup.offsetWidth; // Force reflow
        popup.classList.add('fade-in');
        form.reset();
      } else {
        alert('Oops! There was a problem submitting your form.');
      }
    })
    .catch(() => alert('Oops! There was a problem submitting your form.'));
  });
}

if (closeBtn) {
  closeBtn.addEventListener('click', () => {
    popup.style.display = 'none';
    popup.classList.remove('fade-in');
  });
}


  // === HEADING OBSERVER ===
  const headingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('animate-in');
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.heading-section h1, .heading-section h2').forEach(el => {
    headingObserver.observe(el);
  });

  // === FADE IN LINES ON SCROLL ===
  function splitIntoLines(paragraph) {
    const words = paragraph.textContent.split(' ');
    const tempSpan = document.createElement('span');
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.position = 'absolute';
    tempSpan.style.whiteSpace = 'nowrap';
    document.body.appendChild(tempSpan);

    const lines = [];
    let line = '', lastTop = null;
    paragraph.innerHTML = '';

    words.forEach(word => {
      const testSpan = document.createElement('span');
      testSpan.textContent = line ? line + ' ' + word : word;
      paragraph.appendChild(testSpan);
      const top = testSpan.getBoundingClientRect().top;

      if (lastTop === null) {
        lastTop = top;
      }

      if (top !== lastTop && line) {
        lines.push(line.trim());
        line = word;
        lastTop = top;
      } else {
        line += ' ' + word;
      }

      paragraph.removeChild(testSpan);
    });

    if (line) lines.push(line.trim());
    document.body.removeChild(tempSpan);
    return lines;
  }

  function prepareLineAnimations() {
    const paragraphs = document.querySelectorAll('.about_me-headings p', '#misc_animation p', '#misc_webDesign p', '#misc_photography p', '#misc_graphicDesign p');
    paragraphs.forEach(paragraph => {
      const lines = splitIntoLines(paragraph);
      paragraph.innerHTML = '';
      lines.forEach((lineText, index) => {
        const span = document.createElement('span');
        span.className = 'line-wrapper';
        span.style.transitionDelay = `${index * 200}ms`;
        span.textContent = lineText;
        paragraph.appendChild(span);
      });
    });

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.line-wrapper').forEach(line => {
            line.classList.add('visible');
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    paragraphs.forEach(p => observer.observe(p));
  }

  prepareLineAnimations();

  // === CAROUSELS ===
  function setupCarousel(trackSelector, options = {}) {
    const track = document.querySelector(trackSelector);
    if (!track) return;

    const slides = Array.from(track.children);
    const firstClone = slides[0].cloneNode(true);
    track.appendChild(firstClone);

    const totalSlides = track.children.length;
    let index = 0;
    let intervalId = null;
    const {
      duration = 4500,
      transition = 'transform 2.2s ease-in-out',
      shiftPercent = 25,
      playVideo = false
    } = options;

    function updateSlideContent() {
      const slides = Array.from(track.children);
      slides.forEach((slide, i) => {
        const video = slide.querySelector('.my-video');
        if (video) {
          video.pause();
          video.muted = true;
          video.currentTime = 0;
          if (i === index) {
            video.addEventListener('seeked', function handleSeek() {
              video.removeEventListener('seeked', handleSeek);
              video.play();
            });
          }
        }
      });
    }

    function moveToNextSlide() {
      index++;
      track.style.transition = transition;
      track.style.transform = `translateX(-${index * shiftPercent}%)`;
    }

    track.addEventListener('transitionend', () => {
      if (index === totalSlides - 1) {
        track.style.transition = 'none';
        track.style.transform = 'translateX(0%)';
        index = 0;
        void track.offsetWidth; // trigger reflow
      }
      if (playVideo) updateSlideContent();
    });

    function startCarousel() {
      if (!intervalId) {
        intervalId = setInterval(moveToNextSlide, duration);
      }
    }

    function stopCarousel() {
      clearInterval(intervalId);
      intervalId = null;
    }

    document.addEventListener('visibilitychange', () => {
      document.hidden ? stopCarousel() : startCarousel();
    });

    if (playVideo) {
      window.addEventListener('load', updateSlideContent);
    }

    startCarousel();
  }

  setupCarousel('.carousel-track', { shiftPercent: 25 });
  setupCarousel('.carousel-trackWebDesign', { shiftPercent: 100, transition: 'transform 1.8s ease-in-out' });
  setupCarousel('.carousel-trackAnimation', { shiftPercent: 25, playVideo: true });

  // === MATCH HEIGHTS ===
  function matchAnimationHeights() {
    const leftCol = document.querySelector('.mainHeadings_animation');
    const rightCol = document.querySelector('#hero-imageAnimation');
    if (leftCol && rightCol) {
      rightCol.style.height = leftCol.offsetHeight + 'px';
    }
  }

  window.addEventListener('load', matchAnimationHeights);
  window.addEventListener('resize', matchAnimationHeights);


  // === IMAGE OVERLAY ===

  const allImageSets = {
  graphicDesign: {
    "BRAND & CONTENT": [
      "images/graphicDesign/brand_and_content_design/cans.jpg",
      "images/graphicDesign/brand_and_content_design/agency_logo.png",
      "images/graphicDesign/brand_and_content_design/double-spread_page.png",
      "images/graphicDesign/brand_and_content_design/spoofedFacebookAd.png",
      "images/graphicDesign/brand_and_content_design/socialMedia_postTwo.png",
      "images/graphicDesign/brand_and_content_design/business_card-mockup.png",
      "images/graphicDesign/brand_and_content_design/theGroomRoom_instagramPosts.png",
      "images/graphicDesign/brand_and_content_design/ferretIndustries_mockUp.png"
    ],
    "ILLUSTRATIONS": [
      "images/graphicDesign/illustration/girlWithThePearlEarrign_original.jpg",
      "images/graphicDesign/illustration/avatar.png",
      "images/graphicDesign/illustration/Client_stickerDesign.png",
      "images/graphicDesign/illustration/sardines.png",
      "images/graphicDesign/illustration/Reimagined_Mall.png",
      "images/graphicDesign/illustration/ferret.png",
      "images/graphicDesign/illustration/term_Conceptualisations.jpg",
      "images/graphicDesign/illustration/Zodiac_Rabbit_poster.png",
      "images/graphicDesign/illustration/stylizedSneaker_graphic.png",
      "images/graphicDesign/illustration/Room_redesign.png"
    ]
  },
  photography: {
    "SUBJECT": [
      "images/photography/Subjects/blackAndWhite_scenicPortrait.png",
      "images/photography/Subjects/dark_lightPainitng_portrait.png",
      "images/photography/Subjects/doubleExposure_portrait.png",
      "images/photography/Subjects/floral_handTattoo.JPG",
      "images/photography/Subjects/matching_wristTattoos.JPG",
      "images/photography/Subjects/moodLighting_portrait.png",
      "images/photography/Subjects/multicolour_lightPainting_portrait.JPG",
      "images/photography/Subjects/Bee_neckTattoo.jpg",
      "images/photography/Subjects/paparazzi.JPG",
      "images/photography/Subjects/lowKeyLighting_doublePortrait-blackAndWhite.JPG",
      "images/photography/Subjects/unicorn_backTattoo.JPG"
    ],
    "FOOD": [
      "images/photography/Flatlays/bubbles.jpg",
      "images/photography/Flatlays/BuddhaBowl.jpg",
      "images/photography/Flatlays/Creative_hotAirBalloon-themedFood.JPG",
      "images/photography/Flatlays/Grapefruits_Flatlay.jpg"
    ],
    "OUTDOOR": [
      "images/photography/Outdoor/beach.JPG",
      "images/photography/Outdoor/bee.png",
      "images/photography/Outdoor/bike.JPG",
      "images/photography/Outdoor/blackAndWhite_sunRays.jpg",
      "images/photography/Outdoor/brownRose.jpg",
      "images/photography/Outdoor/hikingTrail.JPG",
      "images/photography/Outdoor/ostrich.JPG",
      "images/photography/Outdoor/parrot.png",
      "images/photography/Outdoor/photography-moth.png",
      "images/photography/Outdoor/protea_coloured.JPG",
      "images/photography/Outdoor/robot_sign.jpg",
      "images/photography/Outdoor/tracks.jpg"
    ]
  },
  webDesign: {
    "UI / UX DESIGN": [
      "images/webDesign/prototypes/dogParlor_website.png",
      "images/webDesign/prototypes/hotelWebsite_mockUp.png",
      "images/webDesign/prototypes/FoodLoversMarket_landingPage.png"
    ],
    "CONCEPTUALISATION & WIREFRAMING": [
      "images/webDesign/wireframing/YocoIdeation_one.png",
      "images/webDesign/wireframing/YocoIdeation_two.png",
      "images/webDesign/wireframing/YocoIdeation_three.png",
      "images/webDesign/wireframing/YocoIdeation_four.png",
      "images/webDesign/wireframing/YocoIdeation_five.png",
      "images/webDesign/wireframing/YocoIdeation_six.png",
      "images/webDesign/wireframing/YocoIdeation_seven.png",
      "images/webDesign/wireframing/YocoIdeation_eight.png",
      "images/webDesign/wireframing/LofiPrototypeOne.jpg",
      "images/webDesign/wireframing/wireframeTwo.jpg",
      "images/webDesign/wireframing/LofiPrototypeFive.jpg",
      "images/webDesign/wireframing/wireframeThree.jpg",
      "images/webDesign/wireframing/LofiPrototypeTwo.jpg",
      "images/webDesign/wireframing/LofiPrototypeSix.jpg",
      "images/webDesign/wireframing/LofiPrototypeSeven.jpg"
    ]
  },
  animation: {
    "VIDEO SEQUENCES": [
      "images/animation/video_sequences/SeedFund_YoutubeVideo.mp4",
      "images/animation/video_sequences/Copic_stopMotion_Animation.mp4"
    ],
    "GIFS": [
      "images/animation/GIFS/Teary_Eye_Animation.gif",
      "images/animation/GIFS/Photography_Robertsons_Spice_Storyboards.gif",
      "images/animation/GIFS/girl_with_the_pearl_earring.mp4"
    ],
    "STORYBOARDING": [
      "images/animation/storyboarding/starStoryboard_one.png",
      "images/animation/storyboarding/starStoryboard_two.png",
      "images/animation/storyboarding/Unseen_storyBoard_one.png",
      "images/animation/storyboarding/Unseen_storyBoard_two.png",
      "images/animation/storyboarding/Unseen_storyBoard_three.png",
      "images/animation/storyboarding/photographyStoryboarding.jpg"
    ]
  }
};

function preloadImagesForCategory(category) {
  const sets = allImageSets[category];
  if (!sets) return;

  Object.values(sets).flat().forEach(src => {
    const img = new Image();
    img.src = src;  // Browser will start loading/caching this image
  });
}

// Preload images for all categories you want or on page load:
document.addEventListener('DOMContentLoaded', () => {
  preloadImagesForCategory('graphicDesign');
  preloadImagesForCategory('photography');
  preloadImagesForCategory('webDesign');
  preloadImagesForCategory('animation');
});

document.querySelectorAll('.carouselButtons').forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.category;
      const setLabel = button.dataset.set?.trim().toUpperCase();
      const imageSet = allImageSets[category]?.[setLabel] || [];

      const overlay = document.getElementById(`overlayGallery_${category}`);
      const container = document.getElementById(`overlayImagesContainer_${category}`);
      const backBtn = overlay?.querySelector('#backToMain');

      if (!overlay || !container) return;


      // Clear and populate images
      container.innerHTML = '';
      imageSet.forEach(src => {
      const wrapper = document.createElement('div');
      wrapper.className = 'image-wrapper';

    if (src.endsWith('.mp4')) {
      const video = document.createElement('video');
      video.src = src;
      video.controls = true;
      video.autoplay = false;
      video.muted = true;
      video.playsInline = true;
      video.loop = false;
      video.style.width = '100%';
      video.style.height = 'auto';

      // On play, unmute and pause others
      video.addEventListener('play', () => {
        video.muted = false;
        document.querySelectorAll('#overlayGallery_animation video').forEach(v => {
          if (v !== video) v.pause();
        });
    });

    wrapper.appendChild(video);
    container.appendChild(wrapper);

    // Fade-in video wrapper immediately
    requestAnimationFrame(() => {
      wrapper.classList.add('fade-in');
    });

  } else {
    const img = document.createElement('img');
    img.src = src;
    img.alt = setLabel;

    // Fade in only after image is fully loaded
    img.onload = () => {
      requestAnimationFrame(() => {
        wrapper.classList.add('fade-in');
      });
    };

      wrapper.appendChild(img);
      container.appendChild(wrapper);
    }
  });
      // Remove previous column-class, if any
      container.classList.remove('one-column', 'two-columns', 'three-columns');

      // If current set is 'FOOD', apply 2-column layout
      if (setLabel === "VIDEO SEQUENCES") {
      container.classList.add('one-column');
    } else if (setLabel === "GIFS") {
      container.classList.add('two-columns');
    } else if (setLabel === "STORYBOARDING") {
      container.classList.add('three-columns');
    } else if (setLabel === "FOOD" || setLabel === "UI / UX DESIGN") {
      container.classList.add('two-columns');
    }

      overlay.classList.remove('hidden');
      document.body.style.overflow = 'hidden';

        // Remove any old event to avoid multiple listeners
      backBtn?.replaceWith(backBtn.cloneNode(true));
      overlay.querySelector('#backToMain')?.addEventListener('click', () => {
        
        overlay.classList.add('hidden');
        document.body.style.overflow = '';
      });
    });
  });

   // === VIDEO LOAD ===
  
window.addEventListener('load', () => {
  const firstSlide = document.querySelector('.carousel-item_animation');
  const video = firstSlide?.querySelector('video');

  if (video) {
    // Force the browser to show the poster
    video.load();
    video.currentTime = 0.01;

    // Delay autoplay to allow the poster to be painted
    setTimeout(() => {
      video.play().catch((err) => {
        console.warn("Autoplay failed", err);
      });
    }, 200); // Slight delay allows poster to render
  }
});

track.addEventListener('transitionend', () => {
  if (index === totalSlides - 1) {
    track.style.transition = 'none';
    track.style.transform = 'translateX(0%)';
    index = 0;
    void track.offsetWidth; // trigger reflow

   if (playVideo) {
  setTimeout(updateSlideContent, 100); // slight delay before restarting
}
  }
});


});


