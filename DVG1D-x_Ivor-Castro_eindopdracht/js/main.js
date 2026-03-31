document.addEventListener("DOMContentLoaded", function () {

  
  let heroTitel = document.querySelector("#hero-titel");
  let heroTekst = document.querySelector("#hero-tekst");

  let teksten = [
    {
      titel: "Laat je hoofd vertragen",
      tekst: "Kies een rustgevend geluid en een visuele sfeer. Mix meerdere geluiden samen en maak je eigen ontspannende omgeving."
    },
    {
      titel: "Adem in, adem uit",
      tekst: "Sluit je ogen, kies een geluid en laat de stress van je dag langzaam wegglijden."
    },
    {
      titel: "Jouw moment van rust",
      tekst: "Geen notificaties, geen haast. Alleen jij, een goed geluid en een rustige visual."
    },
    {
      titel: "Even pauzeren mag",
      tekst: "Neem de tijd om te vertragen. Kies een sfeer die bij jou past en laat je gedachten tot rust komen."
    },
    {
      titel: "Vind je innerlijke stilte",
      tekst: "Mix geluiden uit de natuur en kies een visual die je hoofd leegmaakt. Jouw zen-moment begint hier."
    }
  ];

  let willekeurig = teksten[Math.floor(Math.random() * teksten.length)];
  heroTitel.textContent = willekeurig.titel;
  heroTekst.textContent = willekeurig.tekst;

  
  let soundBtns = document.querySelectorAll(".sound-btn");
  let soundSliders = document.querySelectorAll(".sound-volume");
  let visualBtns = document.querySelectorAll(".visual-btn");
  let timerBtns = document.querySelectorAll(".timer-btn");

  let soundText = document.querySelector("#sound-status");
  let visualText = document.querySelector("#visual-text");
  let spaceBox = document.querySelector("#space-canvas-box");
  let waveCanvas = document.querySelector("#wave-canvas-box");
  let galaxyCanvas = document.querySelector("#galaxy-canvas-box");
  let lavaCanvas = document.querySelector("#lava-canvas-box");

  let mainVolume = document.querySelector("#volume-slider");
  let mainVolumeText = document.querySelector("#volume-text");

  let stopBtn = document.querySelector("#stop-btn");
  let randomBtn = document.querySelector("#random-btn");

  let timerText = document.querySelector("#timer-text");

  let noteInput = document.querySelector("#note-input");
  let charCount = document.querySelector("#char-count");
  let moodText = document.querySelector("#mood-text");

  let ademCircle = document.querySelector("#breathing-circle");
  let ademText = document.querySelector("#breathing-text");
  let startAdemBtn = document.querySelector("#start-breathing-btn");
  let stopAdemBtn = document.querySelector("#stop-breathing-btn");

  
  let regen = document.querySelector("#rain");
  let zee = document.querySelector("#ocean");
  let vogels = document.querySelector("#birds");
  let vuur = document.querySelector("#fire");
  let wind = document.querySelector("#wind");

  
  let countdown;
  let tijdOver = 30;
  let ademInterval;
  let scene, camera, renderer, sterren;
  let spaceGestart = false;
  let waveGestart = false;
  let waveAnimFrame;
  let galaxyGestart = false;
  let lavaGestart = false;

  
  function pakGeluid(naam) {
    if (naam === "rain") return regen;
    if (naam === "ocean") return zee;
    if (naam === "birds") return vogels;
    if (naam === "fire") return vuur;
    if (naam === "wind") return wind;
  }

  
  function pakSlider(naam) {
    for (let i = 0; i < soundSliders.length; i++) {
      if (soundSliders[i].dataset.sound === naam) {
        return soundSliders[i];
      }
    }
  }

  
  function updateGeluidTekst() {
    let actief = [];

    if (!regen.paused) actief.push("regen");
    if (!zee.paused) actief.push("zee");
    if (!vogels.paused) actief.push("vogels");
    if (!vuur.paused) actief.push("vuur");
    if (!wind.paused) actief.push("wind");

    if (actief.length === 0) {
      soundText.textContent = "Geluiden: niets afgespeeld";
    } else {
      soundText.textContent = "Actieve geluiden: " + actief.join(", ");
    }
  }

  
  function updateVolume() {
    let master = mainVolume.value / 100;

    regen.volume = master * (pakSlider("rain").value / 100);
    zee.volume = master * (pakSlider("ocean").value / 100);
    vogels.volume = master * (pakSlider("birds").value / 100);
    vuur.volume = master * (pakSlider("fire").value / 100);
    wind.volume = master * (pakSlider("wind").value / 100);
  }

  
  function stopAlles() {
    let lijst = [regen, zee, vogels, vuur, wind];
    for (let i = 0; i < lijst.length; i++) {
      lijst[i].pause();
      lijst[i].currentTime = 0;
    }

    for (let i = 0; i < soundBtns.length; i++) {
      soundBtns[i].classList.remove("active");
    }

    updateGeluidTekst();
  }

  
  function toggleGeluid(naam, knop) {
    let geluid = pakGeluid(naam);
    let slider = pakSlider(naam);
    let master = mainVolume.value / 100;
    let extra = slider.value / 100;

    if (geluid.paused) {
      geluid.volume = master * extra;
      geluid.play();
      knop.classList.add("active");
    } else {
      geluid.pause();
      geluid.currentTime = 0;
      knop.classList.remove("active");
    }

    updateGeluidTekst();
  }

  
  for (let i = 0; i < soundBtns.length; i++) {
    soundBtns[i].addEventListener("click", function () {
      let naam = soundBtns[i].dataset.sound;
      toggleGeluid(naam, soundBtns[i]);
    });
  }

  
  for (let i = 0; i < soundSliders.length; i++) {
    soundSliders[i].addEventListener("input", updateVolume);
  }

  
  function verbergAlleVisuals() {
    spaceBox.style.display = "none";
    waveCanvas.style.display = "none";
    galaxyCanvas.style.display = "none";
    lavaCanvas.style.display = "none";
  }

  function laatLavaZien() {
    verbergAlleVisuals();
    lavaCanvas.style.display = "block";
    visualText.textContent = "Visual: Lava Lamp";
    if (!lavaGestart) {
      startLava();
      lavaGestart = true;
    }
  }

  function startLava() {
    let ctx = lavaCanvas.getContext("2d");

    function resize() {
      lavaCanvas.width = lavaCanvas.offsetWidth;
      lavaCanvas.height = lavaCanvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    let bellen = [];
    let aantalBellen = 18;

    let kleuren = [
      "rgba(255, 100, 80, 0.75)",
      "rgba(255, 160, 50, 0.7)",
      "rgba(220, 60, 150, 0.7)",
      "rgba(255, 80, 120, 0.65)",
      "rgba(180, 60, 200, 0.7)",
      "rgba(255, 120, 60, 0.65)"
    ];

    for (let i = 0; i < aantalBellen; i++) {
      bellen.push({
        x: Math.random() * lavaCanvas.width,
        y: Math.random() * lavaCanvas.height,
        straal: 20 + Math.random() * 50,
        snelheidY: 0.2 + Math.random() * 0.5,
        snelheidX: (Math.random() - 0.5) * 0.4,
        kleur: kleuren[Math.floor(Math.random() * kleuren.length)],
        fase: Math.random() * Math.PI * 2
      });
    }

    let t = 0;

    function teken() {
      let w = lavaCanvas.width;
      let h = lavaCanvas.height;

      let achtergrond = ctx.createLinearGradient(0, 0, 0, h);
      achtergrond.addColorStop(0, "#1a0030");
      achtergrond.addColorStop(0.5, "#3d0020");
      achtergrond.addColorStop(1, "#1a0010");
      ctx.fillStyle = achtergrond;
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < bellen.length; i++) {
        let b = bellen[i];

        b.y -= b.snelheidY;
        b.x += Math.sin(t * 0.5 + b.fase) * 0.6;

        if (b.y + b.straal < 0) {
          b.y = h + b.straal;
          b.x = Math.random() * w;
        }

        let pulsStraal = b.straal + Math.sin(t * 0.8 + b.fase) * 6;

        let gloed = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, pulsStraal);
        gloed.addColorStop(0, b.kleur.replace("0.7", "0.95").replace("0.75", "0.95").replace("0.65", "0.9"));
        gloed.addColorStop(0.6, b.kleur);
        gloed.addColorStop(1, b.kleur.replace("0.7", "0").replace("0.75", "0").replace("0.65", "0"));

        ctx.beginPath();
        ctx.arc(b.x, b.y, pulsStraal, 0, Math.PI * 2);
        ctx.fillStyle = gloed;
        ctx.fill();
      }

      t += 0.02;
      requestAnimationFrame(teken);
    }

    teken();
  }

  function laatGalaxyZien() {
    verbergAlleVisuals();
    galaxyCanvas.style.display = "block";
    visualText.textContent = "Visual: Galaxy";
    if (!galaxyGestart) {
      startGalaxy();
      galaxyGestart = true;
    }
  }

  function startGalaxy() {
    let galaxyScene = new THREE.Scene();

    galaxyCanvas.width = galaxyCanvas.offsetWidth;
    galaxyCanvas.height = galaxyCanvas.offsetHeight;

    let galaxyCamera = new THREE.PerspectiveCamera(75, galaxyCanvas.width / galaxyCanvas.height, 0.1, 100);
    galaxyCamera.position.set(3, 3, 3);
    galaxyScene.add(galaxyCamera);

    let galaxyRenderer = new THREE.WebGLRenderer({ canvas: galaxyCanvas });
    galaxyRenderer.setSize(galaxyCanvas.width, galaxyCanvas.height);
    galaxyRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    let parameters = {};
    parameters.count = 80000;
    parameters.size = 0.01;
    parameters.radius = 2.15;
    parameters.branches = 3;
    parameters.spin = 3;
    parameters.randomness = 5;
    parameters.randomnessPower = 4;
    parameters.insideColor = "#ff6030";
    parameters.outsideColor = "#0949f0";

    let geom = new THREE.BufferGeometry();
    let positions = new Float32Array(parameters.count * 3);
    let colors = new Float32Array(parameters.count * 3);
    let colorInside = new THREE.Color(parameters.insideColor);
    let colorOutside = new THREE.Color(parameters.outsideColor);

    for (let i = 0; i < parameters.count; i++) {
      let i3 = i * 3;
      let radius = Math.pow(Math.random() * parameters.randomness, Math.random() * parameters.radius);
      let spinAngle = radius * parameters.spin;
      let branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2;
      let negPos = [1, -1];
      let randomX = Math.pow(Math.random(), parameters.randomnessPower) * negPos[Math.floor(Math.random() * 2)];
      let randomY = Math.pow(Math.random(), parameters.randomnessPower) * negPos[Math.floor(Math.random() * 2)];
      let randomZ = Math.pow(Math.random(), parameters.randomnessPower) * negPos[Math.floor(Math.random() * 2)];

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      let mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, Math.random() * radius / parameters.radius);
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    let mat = new THREE.PointsMaterial({
      size: parameters.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });

    let points = new THREE.Points(geom, mat);
    galaxyScene.add(points);

    let clock = new THREE.Clock();

    function tick() {
      let elapsedTime = clock.getElapsedTime();
      galaxyCamera.position.x = Math.cos(elapsedTime * 0.05) * 4;
      galaxyCamera.position.z = Math.sin(elapsedTime * 0.05) * 4;
      galaxyCamera.lookAt(0, 0, 0);
      galaxyRenderer.render(galaxyScene, galaxyCamera);
      requestAnimationFrame(tick);
    }

    tick();

    window.addEventListener("resize", function () {
      galaxyCanvas.width = galaxyCanvas.offsetWidth;
      galaxyCanvas.height = galaxyCanvas.offsetHeight;
      galaxyCamera.aspect = galaxyCanvas.width / galaxyCanvas.height;
      galaxyCamera.updateProjectionMatrix();
      galaxyRenderer.setSize(galaxyCanvas.width, galaxyCanvas.height);
    });
  }

  function laatWaveZien() {
    verbergAlleVisuals();
    waveCanvas.style.display = "block";
    visualText.textContent = "Visual: Aurora Wave";
    if (!waveGestart) {
      startWave();
      waveGestart = true;
    }
  }

  function startWave() {
    let ctx = waveCanvas.getContext("2d");

    function resize() {
      waveCanvas.width = waveCanvas.offsetWidth;
      waveCanvas.height = waveCanvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    let t = 0;

    function noise(x, y, z) {
      let n = Math.sin(x * 1.3 + z) * Math.cos(y * 0.9 + z * 0.7) * 0.5 +
              Math.sin(x * 0.7 + z * 1.1) * Math.cos(y * 1.5 + z * 0.3) * 0.5;
      return n;
    }

    function teken() {
      let w = waveCanvas.width;
      let h = waveCanvas.height;

      ctx.fillStyle = "rgba(10, 10, 30, 0.15)";
      ctx.fillRect(0, 0, w, h);

      let golven = [
        { kleur: "rgba(80, 200, 255, 0.35)", offset: 0 },
        { kleur: "rgba(120, 80, 255, 0.3)", offset: 1.5 },
        { kleur: "rgba(0, 255, 180, 0.25)", offset: 3 }
      ];

      for (let g = 0; g < golven.length; g++) {
        let golf = golven[g];
        ctx.beginPath();
        ctx.moveTo(0, h);

        for (let x = 0; x <= w; x += 4) {
          let nx = x / w * 3;
          let ny = t * 0.4 + golf.offset;
          let y = h * 0.5 + noise(nx, ny, t * 0.2) * h * 0.25;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fillStyle = golf.kleur;
        ctx.fill();
      }

      t += 0.015;
      waveAnimFrame = requestAnimationFrame(teken);
    }

    teken();
  }

  function laatRuimteZien() {
    verbergAlleVisuals();
    spaceBox.style.display = "block";
    visualText.textContent = "Visual: Ruimte deeltjes";
    if (!spaceGestart) {
      startRuimte();
      spaceGestart = true;
    }
  }

  
  for (let i = 0; i < visualBtns.length; i++) {
    visualBtns[i].addEventListener("click", function () {
      let type = visualBtns[i].dataset.type;

      if (type === "lava") {
        laatLavaZien();
      } else if (type === "galaxy") {
        laatGalaxyZien();
      } else if (type === "wave") {
        laatWaveZien();
      } else {
        laatRuimteZien();
      }
    });
  }

  
  mainVolume.addEventListener("input", function () {
    mainVolumeText.textContent = "Volume: " + mainVolume.value + "%";
    updateVolume();
  });

  
  stopBtn.addEventListener("click", function () {
    stopAlles();
    clearInterval(countdown);
    timerText.textContent = "00:30";
  });

  
  randomBtn.addEventListener("click", function () {
    
    stopAlles();

    
    let geluidsKeuzes = ["rain", "ocean", "birds", "fire", "wind"];
    let randomGeluid = geluidsKeuzes[Math.floor(Math.random() * geluidsKeuzes.length)];

    
    let randomVis = Math.floor(Math.random() * 4);
    if (randomVis === 0) laatLavaZien();
    if (randomVis === 1) laatWaveZien();
    if (randomVis === 2) laatGalaxyZien();
    if (randomVis === 3) laatRuimteZien();

    
    for (let i = 0; i < soundBtns.length; i++) {
      if (soundBtns[i].dataset.sound === randomGeluid) {
        toggleGeluid(randomGeluid, soundBtns[i]);
      }
    }
  });

 
  function toonTijd() {
    let min = Math.floor(tijdOver / 60);
    let sec = tijdOver % 60;
    if (sec < 10) sec = "0" + sec;
    if (min < 10) min = "0" + min;
    timerText.textContent = min + ":" + sec;
  }

  function startTimer(secs) {
    clearInterval(countdown);
    tijdOver = secs;
    toonTijd();

    countdown = setInterval(function () {
      tijdOver--;
      toonTijd();

      if (tijdOver <= 0) {
        clearInterval(countdown);
        stopAlles();
        timerText.textContent = "Klaar!";
      }
    }, 1000);
  }

  for (let i = 0; i < timerBtns.length; i++) {
    timerBtns[i].addEventListener("click", function () {
      let secs = Number(timerBtns[i].dataset.time);
      startTimer(secs);
    });
  }

  
  noteInput.addEventListener("input", function () {
    let tekst = noteInput.value;
    charCount.textContent = tekst.length + " karakters";

    if (tekst.length === 0) {
      moodText.textContent = "Stemming: neutraal";
      moodText.style.color = "white";
    } else if (tekst.length < 30) {
      moodText.textContent = "Stemming: rustig";
      moodText.style.color = "lightblue";
    } else {
      moodText.textContent = "Stemming: diep ontspannen";
      moodText.style.color = "lightgreen";
    }
  });

  
  function startAdemhaling() {
    clearInterval(ademInterval);
    let stap = 0;

    function ademCycle() {
      if (stap === 0) {
        ademText.textContent = "Adem in";
        ademCircle.classList.remove("shrink");
        ademCircle.classList.add("grow");
      } else if (stap === 1) {
        ademText.textContent = "Vasthouden";
      } else if (stap === 2) {
        ademText.textContent = "Adem uit";
        ademCircle.classList.remove("grow");
        ademCircle.classList.add("shrink");
      }

      stap++;
      if (stap > 2) stap = 0;
    }

    ademCycle();
    ademInterval = setInterval(ademCycle, 4000);
  }

  function stopAdemhaling() {
    clearInterval(ademInterval);
    ademText.textContent = "Klik op start";
    ademCircle.classList.remove("grow");
    ademCircle.classList.remove("shrink");
  }

  startAdemBtn.addEventListener("click", startAdemhaling);
  stopAdemBtn.addEventListener("click", stopAdemhaling);

  
  function startRuimte() {
    scene = new THREE.Scene();

    let w = spaceBox.clientWidth;
    let h = spaceBox.clientHeight;

    camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    spaceBox.appendChild(renderer.domElement);

    let geom = new THREE.BufferGeometry();
    let sterrenAantal = 10000;
    let pos = new Float32Array(sterrenAantal * 3);

    for (let i = 0; i < pos.length; i++) {
      pos[i] = (Math.random() - 0.5) * 2000;
    }

    geom.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    let mat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5, transparent: true });
    sterren = new THREE.Points(geom, mat);
    scene.add(sterren);
    camera.position.z = 800;

    function animatie() {
      requestAnimationFrame(animatie);
      sterren.rotation.y += 0.0005;
      sterren.rotation.x += 0.0002;

      let p = sterren.geometry.attributes.position.array;
      for (let i = 0; i < p.length; i += 3) {
        p[i + 1] -= 0.05;
        if (p[i + 1] < -1000) p[i + 1] = 1000;
      }

      sterren.geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    }

    window.addEventListener("resize", function () {
      let nw = spaceBox.clientWidth;
      let nh = spaceBox.clientHeight;
      renderer.setSize(nw, nh);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
    });

    animatie();
  }
});
