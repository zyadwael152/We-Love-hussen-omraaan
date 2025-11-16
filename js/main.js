document.addEventListener('DOMContentLoaded', () => {
    renderMockData();
    setupSearchListener();
    loadValidLocations();
});

let validLocations = {
    cities: [],
    countries: []
};

/**
 * @function loadValidLocations
 */
async function loadValidLocations(){
    try{
        const response = await fetch('data/cities-countries.json');
        if (!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        validLocations = await response.json();
        console.log('Valid locations loaded:', validLocations);
    } 
    catch (error){
        console.error('Failed to load valid locations:', error);
    }
}

/**
@function renderMockData 
*/

async function renderMockData(){

    const gridContainer = document.getElementById('destination-grid');

    if (!gridContainer){
        console.error("Error: Could not find element with id 'destination-grid'");
        return; 
    }

    try{
        const response = await fetch('data/mock.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const destinations = await response.json();

        gridContainer.innerHTML = ''; 

        destinations.forEach(dest => {
            const card = document.createElement('div');
            card.className = 'card';

            const cardContent = `
                <img src="${dest.img}" alt="${dest.name}">
                <div class="body">
                    <h3>${dest.name}</h3>
                    <p>${dest.desc}</p>
                </div>
            `;
            card.innerHTML = cardContent;
            gridContainer.appendChild(card);
        });

    } 
    catch (error){
        console.error('Failed to fetch mock data:', error);
        gridContainer.innerHTML = '<p style="color: red; text-align: center;">Error loading destinations. Please try again later.</p>';
    }
}

/**
 * @function setupSearchListener
 */
function setupSearchListener() {
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    
    if (!searchBtn || !searchInput){
        console.error("Error: Could not find search button or input element");
        return;
    }
    
    // Add click event to search button
    searchBtn.addEventListener('click', handleSearch);
    
    // Add enter key support
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
}

/**
 * @function handleSearch
 */
async function handleSearch(){
    const searchInput = document.getElementById('search-input');
    const keyword = searchInput.value.trim();
    
    if (!keyword){
        alert('Please enter a search keyword');
        return;
    }
    
    if (!/^[a-zA-Z\s\-]+$/.test(keyword)){
        alert('Please enter a valid city or country name');
        return;
    }
    
    const normalizedKeyword = keyword.toLowerCase().trim();
    
    const isValidLocation = validLocations.cities.some(city => 
        city.toLowerCase() === normalizedKeyword
    ) || validLocations.countries.some(country => 
        country.toLowerCase() === normalizedKeyword
    );
    
    if (!isValidLocation){
        alert("This isn't a city or a country");
        searchInput.value = '';
        return;
    }
    
    const gridContainer = document.getElementById('destination-grid');
    gridContainer.innerHTML = '<p style="text-align: center; font-size: 18px; color: #666; padding: 40px;">Searching…</p>';
    
    try{
        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(keyword)}&client_id=${UNSPLASH_KEY}&per_page=6`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        const photos = data.results;
        
        gridContainer.innerHTML = '';
        
        if (photos.length === 0){
            gridContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No images found. Try another search!</p>';
            return;
        }
        
        photos.slice(0, 6).forEach(photo =>{
            const card = document.createElement('div');
            card.className = 'card';
            
            const cardContent = `
                <img src="${photo.urls.small}" alt="${keyword}">
                <div class="body">
                    <h3>${keyword}</h3>
                    <p>Placeholder text to be replaced by Wiki</p>
                </div>
            `;
            card.innerHTML = cardContent;
            gridContainer.appendChild(card);
        });
    } 
    catch (error){
        console.error('Failed to fetch Unsplash data:', error);
        gridContainer.innerHTML = '<p style="color: red; text-align: center; padding: 40px;">Error searching images. Please try again later.</p>';
    }
}