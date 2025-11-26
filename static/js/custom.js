// Lightweight MathJax loader for inline LaTeX
(function () {
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    s.async = true;
    document.head.appendChild(s);
})();


// (function () {
//     const BASE_HEIGHT = 170; // for .images-row (fixed height)
//     const BASE_WIDTH = 170; // for .images-row-by-width (fixed width)
//
//     // Existing: row scaled by total width computed at BASE_HEIGHT
//     function scaleRowByHeight(row) {
//         row.style.transform = '';
//         row.style.height = '';
//
//         const imgs = Array.from(row.querySelectorAll('img'));
//         if (!imgs.length) return;
//
//         const pending = imgs.filter(img => !img.complete || img.naturalWidth === 0);
//         if (pending.length) {
//             pending.forEach(img => img.addEventListener('load', () => scaleRowByHeight(row), {once: true}));
//             return;
//         }
//
//         const rowStyles = getComputedStyle(row);
//         const gap = parseFloat(rowStyles.columnGap || rowStyles.gap || '0');
//
//         let totalWidth = 0;
//         let maxBorderY = 0;
//         imgs.forEach(img => {
//             const cs = getComputedStyle(img);
//             const bw = parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
//             const bh = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
//             const ratio = img.naturalWidth / img.naturalHeight || 1;
//             const imgWidthAtBase = BASE_HEIGHT * ratio + bw;
//             totalWidth += imgWidthAtBase;
//             if (bh > maxBorderY) maxBorderY = bh;
//         });
//
//         if (imgs.length > 1) totalWidth += gap * (imgs.length - 1);
//
//         const available = row.clientWidth;
//         const scale = Math.min(1, available / totalWidth);
//
//         row.style.transform = `scale(${scale})`;
//         const next = row.nextElementSibling;
//         if (next && next.classList.contains('prompt-row')) {
//             next.style.setProperty('--prompt-scale', scale);
//
//             // Reserve space so the next image row can’t overlap upward
//             const currentScale = scale || 1;
//             const base = next.dataset.baseHeight
//                 ? parseFloat(next.dataset.baseHeight)
//                 : (next.scrollHeight / currentScale);
//             if (!next.dataset.baseHeight) next.dataset.baseHeight = String(base);
//             next.style.minHeight = `${base * currentScale}px`;
//         }
//     }
//
//     // New: row scaled by total width computed at BASE_WIDTH (good for vertical images)
//     function scaleRowByWidth(row) {
//         row.style.transform = '';
//         row.style.height = '';
//
//         const imgs = Array.from(row.querySelectorAll('img'));
//         if (!imgs.length) return;
//
//         const pending = imgs.filter(img => !img.complete || img.naturalWidth === 0);
//         if (pending.length) {
//             pending.forEach(img => img.addEventListener('load', () => scaleRowByWidth(row), {once: true}));
//             return;
//         }
//
//         const rowStyles = getComputedStyle(row);
//         const gap = parseFloat(rowStyles.columnGap || rowStyles.gap || '0');
//
//         // Total row width at BASE_WIDTH is just sum of widths + borders + gaps
//         let totalWidth = 0;
//         let maxHeightAtBase = 0;
//         imgs.forEach(img => {
//             const cs = getComputedStyle(img);
//             const bw = parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
//             const bh = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
//             const ratio = (img.naturalHeight / img.naturalWidth) || 1; // h/w
//             totalWidth += (BASE_WIDTH + bw);
//             const imgHeightAtBase = (BASE_WIDTH * ratio) + bh;
//             if (imgHeightAtBase > maxHeightAtBase) maxHeightAtBase = imgHeightAtBase;
//         });
//
//         if (imgs.length > 1) totalWidth += gap * (imgs.length - 1);
//
//         const available = row.clientWidth;
//         const scale = Math.min(1, available / totalWidth);
//
//         row.style.transform = `scale(${scale})`;
//         const next = row.nextElementSibling;
//         if (next && next.classList.contains('prompt-row')) {
//             next.style.setProperty('--prompt-scale', scale);
//
//             // Reserve space so the next image row can’t overlap upward
//             const currentScale = scale || 1;
//             const base = next.dataset.baseHeight
//                 ? parseFloat(next.dataset.baseHeight)
//                 : (next.scrollHeight / currentScale);
//             if (!next.dataset.baseHeight) next.dataset.baseHeight = String(base);
//             next.style.minHeight = `${base * currentScale}px`;
//         }
//     }
//
//     function scaleAll() {
//         document.querySelectorAll('.images-row').forEach(scaleRowByHeight);
//         document.querySelectorAll('.images-row-by-width').forEach(scaleRowByWidth);
//     }
//
//     window.addEventListener('load', scaleAll);
//     window.addEventListener('resize', () => requestAnimationFrame(scaleAll));
//
//     const ro = new ResizeObserver(scaleAll);
//     document.querySelectorAll('.images-row, .images-row-by-width')
//         .forEach(el => ro.observe(el.parentElement || el));
// })();

(function () {
    const BASE_HEIGHT = 170; // for .images-row (fixed height)
    const BASE_WIDTH = 170; // for .images-row-by-width (fixed width)

    // Existing: row scaled by total width computed at BASE_HEIGHT
    function scaleRowByHeight(row) {
        row.style.transform = '';
        row.style.height = '';

        const imgs = Array.from(row.querySelectorAll('img'));
        if (!imgs.length) return;

        const pending = imgs.filter(img => !img.complete || img.naturalWidth === 0);
        if (pending.length) {
            pending.forEach(img => img.addEventListener('load', () => scaleRowByHeight(row), {once: true}));
            return;
        }

        const rowStyles = getComputedStyle(row);
        const gap = parseFloat(rowStyles.columnGap || rowStyles.gap || '0');

        let totalWidth = 0;
        let maxBorderY = 0;
        imgs.forEach(img => {
            const cs = getComputedStyle(img);
            const bw = parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
            const bh = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
            const ratio = img.naturalWidth / img.naturalHeight || 1;
            const imgWidthAtBase = BASE_HEIGHT * ratio + bw;
            totalWidth += imgWidthAtBase;
            if (bh > maxBorderY) maxBorderY = bh;
        });

        if (imgs.length > 1) totalWidth += gap * (imgs.length - 1);

        const available = row.clientWidth;
        const scale = Math.min(1, available / totalWidth);

        row.style.transform = `scale(${scale})`;
        row.style.height = `${(BASE_HEIGHT + maxBorderY) * scale}px`;
    }

    // New: row scaled by total width computed at BASE_WIDTH (good for vertical images)
    function scaleRowByWidth(row) {
        row.style.transform = '';
        row.style.height = '';

        const imgs = Array.from(row.querySelectorAll('img'));
        if (!imgs.length) return;

        const pending = imgs.filter(img => !img.complete || img.naturalWidth === 0);
        if (pending.length) {
            pending.forEach(img => img.addEventListener('load', () => scaleRowByWidth(row), {once: true}));
            return;
        }

        const rowStyles = getComputedStyle(row);
        const gap = parseFloat(rowStyles.columnGap || rowStyles.gap || '0');

        // Total row width at BASE_WIDTH is just sum of widths + borders + gaps
        let totalWidth = 0;
        let maxHeightAtBase = 0;
        imgs.forEach(img => {
            const cs = getComputedStyle(img);
            const bw = parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
            const bh = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
            const ratio = (img.naturalHeight / img.naturalWidth) || 1; // h/w
            totalWidth += (BASE_WIDTH + bw);
            const imgHeightAtBase = (BASE_WIDTH * ratio) + bh;
            if (imgHeightAtBase > maxHeightAtBase) maxHeightAtBase = imgHeightAtBase;
        });

        if (imgs.length > 1) totalWidth += gap * (imgs.length - 1);

        const available = row.clientWidth;
        const scale = Math.min(1, available / totalWidth);

        row.style.transform = `scale(${scale})`;
        row.style.height = `${maxHeightAtBase * scale}px`; // reserve vertical space
    }

    function scaleAll() {
        document.querySelectorAll('.images-row').forEach(scaleRowByHeight);
        document.querySelectorAll('.images-row-by-width').forEach(scaleRowByWidth);
    }

    window.addEventListener('load', scaleAll);
    window.addEventListener('resize', () => requestAnimationFrame(scaleAll));

    const ro = new ResizeObserver(scaleAll);
    document.querySelectorAll('.images-row, .images-row-by-width')
        .forEach(el => ro.observe(el.parentElement || el));
})();