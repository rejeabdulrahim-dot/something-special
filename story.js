/* Chapter One is independent of the locked opening and its animation timers. */
(() => {
    const section = document.getElementById("ourStory");
    const roadmap = section.querySelector(".story-roadmap");
    const svg = section.querySelector(".story-path");
    const paths = [...svg.querySelectorAll("path")];
    const progress = svg.querySelector(".road-progress");
    const mobile = matchMedia("(max-width: 760px)");
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    let pathLength = 0;
    let roadSamples = [];
    let frame = 0;

    function updateProgress() {
        frame = 0;
        if (!pathLength) return;
        if (reducedMotion.matches) {
            progress.style.strokeDashoffset = "0";
            return;
        }
        const bounds = roadmap.getBoundingClientRect();
        const targetY = innerHeight * .72 - bounds.top;
        // Convert the viewport's vertical position into actual distance along the curve.
        // Height alone underestimates progress around the larger bends.
        let drawnLength = 0;
        if (targetY >= roadSamples[roadSamples.length - 1].y) drawnLength = pathLength;
        else if (targetY > 0) {
            let low = 0;
            let high = roadSamples.length - 1;
            while (high - low > 1) {
                const middle = Math.floor((low + high) / 2);
                if (roadSamples[middle].y < targetY) low = middle;
                else high = middle;
            }
            const a = roadSamples[low];
            const b = roadSamples[high];
            const fraction = (targetY - a.y) / (b.y - a.y || 1);
            drawnLength = a.length + (b.length - a.length) * fraction;
        }
        progress.style.strokeDashoffset = String(pathLength - drawnLength);
    }

    function requestProgress() {
        if (!frame) frame = requestAnimationFrame(updateProgress);
    }

    function drawRoad() {
        const bounds = roadmap.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;
        const stops = [...roadmap.querySelectorAll(".story-stop")];
        const points = [{ x: mobile.matches ? 32 : bounds.width / 2, y: 0 }];

        // Measure the actual content: no fixed heights, nth-stop offsets or SVG rescaling.
        stops.forEach((stop, index) => {
            const marker = stop.querySelector(".story-marker");
            if (mobile.matches) {
                const text = stop.querySelector(".story-text");
                marker.style.left = `${index % 2 ? 38 : 18}px`;
                marker.style.top = `${text.offsetTop + 48}px`;
                marker.style.bottom = "auto";
            } else {
                const bend = Math.min(bounds.width * .075, 60);
                const strength = stop.classList.contains("story-stop--rough") ? 1.2 : 1;
                marker.style.left = `${stop.clientWidth / 2 + (index % 2 ? -bend : bend) * strength}px`;
                marker.style.top = `${stop.clientHeight / 2}px`;
                marker.style.bottom = "auto";
            }
            // Layout offsets exclude the reveal's temporary visual translation.
            points.push({ x: stop.offsetLeft + parseFloat(marker.style.left), y: stop.offsetTop + parseFloat(marker.style.top) });
        });
        const ending = roadmap.querySelector(".road-ending");
        const dot = ending.querySelector(".ending-dot");
        points.push({ x: ending.offsetLeft + dot.offsetLeft + dot.offsetWidth / 2, y: ending.offsetTop + dot.offsetTop + dot.offsetHeight / 2 });

        let d = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            const a = points[i - 1];
            const b = points[i];
            const distance = b.y - a.y;
            // Vertical tangents place each marker at a turn, with a larger rough-stage bend.
            d += ` C ${a.x} ${a.y + distance * .5}, ${b.x} ${b.y - distance * .5}, ${b.x} ${b.y}`;
        }
        svg.setAttribute("viewBox", `0 0 ${bounds.width} ${bounds.height}`);
        paths.forEach(path => path.setAttribute("d", d));
        pathLength = progress.getTotalLength();
        progress.style.strokeDasharray = String(pathLength);
        const sampleCount = Math.ceil(pathLength / 12);
        roadSamples = Array.from({ length: sampleCount + 1 }, (_, index) => {
            const length = pathLength * index / sampleCount;
            return { y: progress.getPointAtLength(length).y, length };
        });
        updateProgress();
    }

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: .08 });
        section.classList.add("reveals-enabled");
        section.querySelectorAll(".story-reveal").forEach(element => {
            observer.observe(element);
            // Keyboard navigation must never land on a visually hidden memory.
            element.addEventListener("focusin", () => element.classList.add("is-visible"));
        });
    }

    if ("ResizeObserver" in window) new ResizeObserver(drawRoad).observe(roadmap);
    window.addEventListener("resize", drawRoad);
    window.addEventListener("scroll", requestProgress, { passive: true });
    reducedMotion.addEventListener("change", updateProgress);
    section.querySelectorAll("img").forEach(image => image.addEventListener("load", drawRoad));
    document.fonts.ready.then(drawRoad);
    drawRoad();

    const dialog = document.getElementById("birthdayMemory");
    const opener = document.getElementById("birthdayMemoryOpen");
    const video = dialog.querySelector("video");
    const status = dialog.querySelector(".memory-status");
    let previousOverflow;

    opener.addEventListener("click", () => {
        previousOverflow = document.body.style.overflow;
        status.textContent = "";
        dialog.showModal();
        document.body.style.overflow = "hidden";
        // The web copy is attached only after interaction; the master is never requested.
        if (!video.getAttribute("src")) video.src = video.dataset.src;
        // The photo click is the intentional playback gesture, including on mobile.
        video.play().catch(() => {
            if (dialog.open && !video.error) status.textContent = "Press play to begin this memory.";
        });
    });

    dialog.querySelector(".memory-close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("cancel", () => video.pause());
    dialog.addEventListener("close", () => {
        video.pause();
        document.body.style.overflow = previousOverflow;
        opener.focus({ preventScroll: true });
    });
    video.addEventListener("play", () => {
        // A late media response must not start audio after the dialog was closed.
        if (!dialog.open) video.pause();
        else status.textContent = "";
    });
    video.addEventListener("error", () => {
        status.replaceChildren(document.createTextNode("This memory couldn't load. "));
        const link = document.createElement("a");
        link.href = video.dataset.src;
        link.textContent = "Open the birthday video";
        status.append(link);
    });
})();
