// Lightweight MathJax loader for inline LaTeX
(function () {
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    s.async = true;
    document.head.appendChild(s);
})();


(function () {
    const BASE_HEIGHT = 150; // for .images-row (fixed height)
    const BASE_WIDTH = 150; // for .images-row-by-width (fixed width)

    // Existing: row scaled by total width computed at BASE_HEIGHT
    function scaleRowByHeight(row) {
        // Don't scale hidden rows
        if (row.classList.contains('is-hidden')) {
            row.style.transform = '';
            row.style.height = '';
            return;
        }

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

        // If we don't have a width yet, don't force scale(0)
        if (!available) {
            row.style.transform = '';
            row.style.height = '';
            return;
        }

        const scale = Math.min(1, available / totalWidth);

        row.style.transform = `scale(${scale})`;
        row.style.height = `${(BASE_HEIGHT + maxBorderY) * scale}px`;
    }

    // New: row scaled by total width computed at BASE_WIDTH (good for vertical images)
    function scaleRowByWidth(row) {
        // Skip hidden rows (they shouldn't be scaled)
        if (row.classList.contains('is-hidden')) {
            row.style.transform = '';
            row.style.height = '';
            return;
        }

        // Reset before measuring
        row.style.transform = '';
        row.style.height = '';

        const imgs = Array.from(row.querySelectorAll('img'));
        if (!imgs.length) return;

        // Wait until all images have loaded
        const pending = imgs.filter(img => !img.complete || img.naturalWidth === 0);
        if (pending.length) {
            pending.forEach(img =>
                img.addEventListener('load', () => scaleRowByWidth(row), {once: true})
            );
            return;
        }

        const rowStyles = getComputedStyle(row);
        const gap = parseFloat(rowStyles.columnGap || rowStyles.gap || '0');

        let totalWidth = 0;
        let maxHeightAtBase = 0;

        imgs.forEach(img => {
            const cs = getComputedStyle(img);

            const bw = parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
            const bh = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
            const ratio = (img.naturalHeight / img.naturalWidth) || 1;

            // BASE_WIDTH allocation per image
            totalWidth += (BASE_WIDTH + bw);

            const imgHeightAtBase = (BASE_WIDTH * ratio) + bh;
            if (imgHeightAtBase > maxHeightAtBase) {
                maxHeightAtBase = imgHeightAtBase;
            }
        });

        if (imgs.length > 1) totalWidth += gap * (imgs.length - 1);

        const available = row.clientWidth;

        // If no width is available, DON'T scale to 0
        if (!available || available <= 0) {
            row.style.transform = '';
            row.style.height = '';
            return;
        }

        const scale = Math.min(1, available / totalWidth);

        row.style.transform = `scale(${scale})`;
        row.style.height = `${maxHeightAtBase * scale}px`;
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

    // 👇 expose so other scripts (toggles) can use them
    window.scaleRowByHeight = scaleRowByHeight;
    window.scaleRowByWidth = scaleRowByWidth;
})();