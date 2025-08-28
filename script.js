// --- SELEKSI ELEMEN DOM ---
const movieGrid = document.getElementById('movie-grid');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const loader = document.getElementById('loader');
const modalContainer = document.getElementById('details-modal');
const loadMoreBtn = document.getElementById('load-more-btn');
const favoritesLink = document.getElementById('favorites-link');
const logoLink = document.getElementById('logo-link');
const gridTitle = document.getElementById('grid-title');

// --- KONFIGURASI API ---
// PENTING: Ganti string di bawah ini dengan API Key kamu!
const API_KEY = '0d432ec950a07effcc4cd24e220cede7';
const API_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// --- MANAJEMEN STATE APLIKASI ---
let currentPage = 1;
let currentSearchTerm = '';
let isLoading = false;
let favoriteMovies = []; // Array untuk menyimpan ID film favorit
const FAVORITES_STORAGE_KEY = 'favoriteMovies';
let currentView = 'popular'; // Melacak tampilan: 'popular', 'search', atau 'favorites'

// --- FUNGSI-FUNGSI UNTUK SISTEM FAVORIT ---

// Memuat ID film favorit dari Local Storage saat aplikasi dimulai
function loadFavorites() {
    const favorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    favoriteMovies = favorites ? JSON.parse(favorites) : [];
}

// Menyimpan array ID film favorit ke Local Storage
function saveFavorites() {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteMovies));
}

// Mengecek apakah sebuah film ada di dalam daftar favorit
function isMovieFavorite(movieId) {
    return favoriteMovies.includes(movieId);
}

// Menambah atau menghapus film dari daftar favorit
function toggleFavorite(movieId, buttonElement) {
    const movieIdAsNumber = Number(movieId); // Pastikan tipenya number
    if (isMovieFavorite(movieIdAsNumber)) {
        favoriteMovies = favoriteMovies.filter(id => id !== movieIdAsNumber);
        buttonElement.classList.remove('favorited');
    } else {
        favoriteMovies.push(movieIdAsNumber);
        buttonElement.classList.add('favorited');
    }
    saveFavorites();
}

// Mengambil data detail semua film favorit dan menampilkannya
async function fetchAndDisplayFavorites() {
    showLoading();
    gridTitle.textContent = 'My Favorite Movies';
    movieGrid.innerHTML = '';
    hideLoadMoreButton();

    if (favoriteMovies.length === 0) {
        movieGrid.innerHTML = '<p class="error-message">You have no favorite movies yet.</p>';
        hideLoading();
        return;
    }

    // Mengambil data semua film favorit secara paralel untuk efisiensi
    const moviePromises = favoriteMovies.map(id => 
        fetch(`${API_URL}/movie/${id}?api_key=${API_KEY}`).then(res => res.json())
    );

    try {
        const movies = await Promise.all(moviePromises);
        displayMovies(movies, true);
    } catch (error) {
        console.error('Error fetching favorite movies:', error);
        movieGrid.innerHTML = '<p class="error-message">Could not fetch your favorites.</p>';
    } finally {
        hideLoading();
    }
}


// --- FUNGSI-FUNGSI API & TAMPILAN ---

function showLoading() { isLoading = true; loader.classList.add('visible'); }
function hideLoading() { isLoading = false; loader.classList.remove('visible'); }
function showLoadMoreButton() { loadMoreBtn.classList.add('visible'); }
function hideLoadMoreButton() { loadMoreBtn.classList.remove('visible'); }

// Fungsi terpusat untuk mengambil data film dari URL yang diberikan
async function fetchMovies(url, isNewSearch = false) {
    if (isLoading) return;
    showLoading();
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network error');
        const data = await response.json();
        displayMovies(data.results, isNewSearch);
        if (data.page < data.total_pages) {
            showLoadMoreButton();
        } else {
            hideLoadMoreButton();
        }
    } catch (error) {
        console.error('Error fetching movies:', error);
        movieGrid.innerHTML = '<p class="error-message">Could not fetch movies.</p>';
    } finally {
        hideLoading();
    }
}

// Mengambil film populer
async function fetchPopularMovies(page = 1) {
    currentSearchTerm = '';
    currentView = 'popular';
    gridTitle.textContent = 'Popular Movies';
    const url = `${API_URL}/movie/popular?api_key=${API_KEY}&page=${page}`;
    fetchMovies(url, page === 1);
}

// Mencari film
async function searchMovies(query, page = 1) {
    currentSearchTerm = query;
    currentView = 'search';
    gridTitle.textContent = `Search Results for: "${query}"`;
    const url = `${API_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`;
    fetchMovies(url, page === 1);
}

// Mengambil detail satu film
async function fetchMovieDetails(movieId) {
    showLoading();
    try {
        const response = await fetch(`${API_URL}/movie/${movieId}?api_key=${API_KEY}`);
        if (!response.ok) throw new Error('Network error');
        const movie = await response.json();
        showMovieDetails(movie);
    } catch (error) {
        console.error('Error fetching movie details:', error);
    } finally {
        hideLoading();
    }
}

// Menampilkan banyak film di grid
function displayMovies(movies, isNewSearch = false) {
    if (isNewSearch) movieGrid.innerHTML = '';
    if (movies.length === 0 && isNewSearch) {
        movieGrid.innerHTML = '<p class="error-message">No movies found.</p>';
        hideLoadMoreButton();
        return;
    }
    movies.forEach(movie => {
        if (!movie.poster_path) return;
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.dataset.movieId = movie.id;

        const isFavorited = isMovieFavorite(movie.id);

        movieCard.innerHTML = `
            <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" title="Add to favorites">
                <i class="fas fa-bookmark"></i>
            </button>
            <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <div class="rating">
                    <i class="fas fa-star"></i>
                    <span>${movie.vote_average.toFixed(1)}</span>
                </div>
            </div>
        `;
        movieGrid.appendChild(movieCard);
    });
}

// Menampilkan detail film di modal
function showMovieDetails(movie) {
    const modalContent = modalContainer.querySelector('.modal-content');
    modalContent.innerHTML = `
        <button class="modal-close-btn">&times;</button>
        <div class="modal-poster"><img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}"></div>
        <div class="modal-text-content">
            <h2>${movie.title}</h2>
            <p>${movie.overview || 'No synopsis available.'}</p>
            <div class="modal-details">
                <span><strong>Release:</strong> ${movie.release_date}</span>
                <span><strong>Rating:</strong> ${movie.vote_average.toFixed(1)} / 10</span>
            </div>
        </div>
    `;
    modalContainer.classList.add('visible');
}

// --- EVENT LISTENERS ---

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    currentPage = 1;
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        searchMovies(searchTerm, currentPage);
    } else {
        fetchPopularMovies(currentPage);
    }
});

loadMoreBtn.addEventListener('click', () => {
    currentPage++;
    if (currentView === 'search') {
        searchMovies(currentSearchTerm, currentPage);
    } else if (currentView === 'popular') {
        fetchPopularMovies(currentPage);
    }
});

movieGrid.addEventListener('click', (e) => {
    const favoriteBtn = e.target.closest('.favorite-btn');
    if (favoriteBtn) {
        const card = favoriteBtn.closest('.movie-card');
        const movieId = card.dataset.movieId;
        toggleFavorite(movieId, favoriteBtn);
        // Jika sedang di halaman favorit, refresh tampilan setelah menghapus
        if (currentView === 'favorites') {
            fetchAndDisplayFavorites();
        }
        return;
    }
    
    const card = e.target.closest('.movie-card');
    if (card) {
        fetchMovieDetails(card.dataset.movieId);
    }
});

modalContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-close-btn') || e.target.id === 'details-modal') {
        modalContainer.classList.remove('visible');
    }
});

favoritesLink.addEventListener('click', (e) => {
    e.preventDefault();
    currentView = 'favorites';
    currentPage = 1;
    fetchAndDisplayFavorites();
});

logoLink.addEventListener('click', (e) => {
    e.preventDefault();
    currentPage = 1;
    fetchPopularMovies(currentPage);
});

// --- INISIALISASI APLIKASI ---
function initialize() {
    loadFavorites();
    fetchPopularMovies(currentPage);
}

initialize();
