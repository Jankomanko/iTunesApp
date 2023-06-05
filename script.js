"use strict";
const searchBar = document.getElementById('searchBar');
const loader = document.getElementById('loader');
const resultsBody = document.getElementById('resultsBody');

let timeoutId;

// refresh kod podataka i loader
searchBar.addEventListener('input', () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(fetchResults, 200); // svakih 200ms updatea rezultate
});

window.addEventListener('load', hideLoader); 

function fetchResults() {
    const searchTerm = searchBar.value.trim();
    if (searchTerm === '') {
        clearResults();
        return;
    }
    showLoader();

    //  API request na iTunes search
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&entity=song`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            hideLoader();
            displayResults(data.results);
        })
        .catch(error => {
            hideLoader();
            console.error('Error:', error);
        });
}

function clearResults() {
    resultsBody.innerHTML = '';
}

function showLoader() {
    loader.style.display = 'block';
}

function hideLoader() {
    loader.style.display = 'none';
}

function displayResults(results) {
    clearResults();

    if (results.length === 0) {
        const noResultsRow = document.createElement('tr');
        const noResultsCell = document.createElement('td');
        noResultsCell.textContent = 'Nema rezultata.';
        noResultsCell.colSpan = 2;
        noResultsRow.appendChild(noResultsCell);
        resultsBody.appendChild(noResultsRow);
        return;
    }

    results.forEach(result => {
        const row = document.createElement('tr');
        const songCell = document.createElement('td');
        const artistCell = document.createElement('td');

        songCell.textContent = result.trackName || '-';
        artistCell.textContent = result.artistName || '-';

        row.appendChild(songCell);
        row.appendChild(artistCell);
        resultsBody.appendChild(row);
    });
}