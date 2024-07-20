function attachClickListener() {
    document.getElementById('touchstone').addEventListener('click', () => {
        const svg = document.getElementById('touchstone');
        const newSvg = svg.cloneNode(true);
        svg.parentNode.replaceChild(newSvg, svg);
        attachClickListener();  // Re-attach the event listener to the new SVG
    });
}

attachClickListener();  // Initial attachment of the event listener