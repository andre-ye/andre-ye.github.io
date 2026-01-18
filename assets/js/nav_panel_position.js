// Position navigation panels directly below the quote box
(function() {
    function positionNavPanels() {
        const quoteBox = document.querySelector('.fixed-quote-box');
        if (!quoteBox) return;

        // Get the bottom position of the quote box
        const quoteRect = quoteBox.getBoundingClientRect();
        const quoteBottom = quoteBox.offsetTop + quoteBox.offsetHeight;

        // Add some spacing (20px gap)
        const navTop = quoteBottom + 20;

        // Find all nav panels that should be positioned below the quote box
        const navPanels = document.querySelectorAll('.nav-panel, .quotes-nav-panel, .articles-nav-panel, .history-nav-panel');

        navPanels.forEach(panel => {
            panel.style.top = navTop + 'px';
        });
    }

    // Run on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', positionNavPanels);
    } else {
        positionNavPanels();
    }

    // Also run after a short delay to account for dynamic content loading (quotes)
    setTimeout(positionNavPanels, 500);
    setTimeout(positionNavPanels, 1000);

    // Run on window resize
    window.addEventListener('resize', positionNavPanels);

    // Expose function globally so other scripts can call it after updating quote content
    window.positionNavPanels = positionNavPanels;
})();
