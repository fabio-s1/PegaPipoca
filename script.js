// --- Referências aos Elementos do DOM ---
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.getElementById('results-container');
const initialMessage = document.getElementById('initial-message');

// --- Configuração da API ---
// A variável API_KEY é acessada a partir do arquivo config.js
const API_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

/**
 * Função principal para buscar filmes na API.
 * @param {string} query - O termo de busca digitado pelo usuário.
 */
const searchMovies = async (query) => {
    // Esconde a mensagem inicial e limpa resultados anteriores
    if (initialMessage) {
        initialMessage.classList.add('hidden');
    }
    resultsContainer.innerHTML = '<p class="text-slate-500 col-span-full text-center">Carregando...</p>';

    const url = `${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=pt-BR`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Erro ao buscar filmes:', error);
        resultsContainer.innerHTML = '<p class="text-red-500 col-span-full text-center">Não foi possível buscar os filmes. Tente novamente mais tarde.</p>';
    }
};

/**
 * Exibe os filmes na tela, criando os cards dinamicamente.
 * @param {Array} movies - Um array de objetos de filmes retornados pela API.
 */
const displayMovies = (movies) => {
    // Limpa o container de resultados
    resultsContainer.innerHTML = '';

    if (movies.length === 0) {
        resultsContainer.innerHTML = '<p class="text-slate-500 col-span-full text-center">Nenhum filme encontrado para esta busca.</p>';
        return;
    }

    movies.forEach(movie => {
        // Ignora filmes sem poster
        if (!movie.poster_path) {
            return;
        }

        const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
        const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

        const movieCard = document.createElement('div');
        movieCard.className = 'bg-slate-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300';

        movieCard.innerHTML = `
            <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="Pôster do filme ${movie.title}" class="w-full h-auto object-cover">
            <div class="p-4">
                <h3 class="font-bold text-lg text-white">${movie.title}</h3>
                <p class="text-slate-400 text-sm mt-1">${releaseYear}</p>
                <div class="flex items-center mt-2">
                    <span class="text-amber-400">★</span>
                    <span class="text-white ml-2 font-semibold">${rating}</span>
                </div>
            </div>
        `;

        resultsContainer.appendChild(movieCard);
    });
};

// --- Event Listeners ---

// Listener para o clique no botão de busca
searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        searchMovies(query);
    }
});

// Listener para a tecla "Enter" no campo de busca
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Impede o comportamento padrão do formulário
        searchButton.click();
    }
});
