document.addEventListener('DOMContentLoaded', () => {
    loadDestinationDetails();
});

/**
 * @function getDestinationFromURL
 * Extracts the destination name from the URL query parameter
 * @returns {string|null} - Destination name or null if not found
 */
function getDestinationFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('destination');
}

/**
 * @function loadDestinationDetails
 * Main function to load and display destination details on the page
 */
async function loadDestinationDetails() {
    const destination = getDestinationFromURL();
    
    if (!destination) {
        showError('No destination specified. Please go back to the home page.');
        return;
    }
    
    console.log('Loading details for:', destination);
    
    // Update page title
    updatePageTitle(destination);
    
    try {
        // Fetch data in parallel for better performance
        const [images, description] = await Promise.all([
            fetchUnsplashImages(destination),
            fetchWikipediaDescription(destination)
        ]);
        
        // Update the page with fetched data
        updateGallery(images, destination);
        updateDescription(description, destination);
        
    } catch (error) {
        console.error('Error loading destination details:', error);
        showError('Failed to load destination details. Please try again.');
    }
}

/**
 * @function updatePageTitle
 * Updates the page title and h1 element with destination name
 * @param {string} destination - Name of the destination
 */
function updatePageTitle(destination) {
    const titleElement = document.querySelector('.details-title');
    if (titleElement) {
        titleElement.textContent = destination;
    }
    document.title = `${destination} - WeGo`;
}

/**
 * @function fetchUnsplashImages
 * Fetches images from Unsplash API for the destination
 * @param {string} destination - Name of the destination
 * @returns {Promise<Array>} - Array of image URLs
 */
async function fetchUnsplashImages(destination) {
    try {
        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(destination)}&client_id=${UNSPLASH_KEY}&per_page=3`
        );
        
        if (response.status === 429) {
            console.warn('Unsplash API rate limit reached');
            return [];
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.results.map(photo => photo.urls.regular);
        
    } catch (error) {
        console.error('Error fetching Unsplash images:', error);
        return [];
    }
}

/**
 * @function fetchWikipediaDescription
 * Fetches description from Wikipedia API
 * @param {string} destination - Name of the destination
 * @returns {Promise<Object>} - Object with extract and full description
 */
async function fetchWikipediaDescription(destination) {
    try {
        const response = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(destination)}`
        );
        
        if (!response.ok) {
            console.warn(`Wikipedia fetch failed for "${destination}": ${response.status}`);
            return null;
        }
        
        const data = await response.json();
        return {
            extract: data.extract || 'No description available.',
            fullText: data.extract_html || data.extract || 'No description available.'
        };
        
    } catch (error) {
        console.error('Error fetching Wikipedia description:', error);
        return null;
    }
}

/**
 * @function updateGallery
 * Updates the gallery grid with fetched images
 * @param {Array} images - Array of image URLs
 * @param {string} destination - Name of the destination (for alt text)
 */
function updateGallery(images, destination) {
    const galleryGrid = document.querySelector('.gallery-grid');
    
    if (!galleryGrid) {
        console.error('Gallery grid not found');
        return;
    }
    
    // Clear existing images
    galleryGrid.innerHTML = '';
    
    // Use default images if none fetched
    const defaultImages = [
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1471619445258-5c9c9b13c34a?auto=format&fit=crop&w=400&q=60',
        'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=400&q=60'
    ];
    
    const imagesToUse = images.length >= 3 ? images : defaultImages;
    
    // Create main image
    const mainImg = document.createElement('img');
    mainImg.src = imagesToUse[0];
    mainImg.alt = `Main view of ${destination}`;
    mainImg.className = 'gallery-img-main';
    mainImg.loading = 'lazy';
    galleryGrid.appendChild(mainImg);
    
    // Create side images
    for (let i = 1; i < 3 && i < imagesToUse.length; i++) {
        const sideImg = document.createElement('img');
        sideImg.src = imagesToUse[i];
        sideImg.alt = `${destination} view ${i}`;
        sideImg.className = 'gallery-img-side';
        sideImg.loading = 'lazy';
        galleryGrid.appendChild(sideImg);
    }
}

/**
 * @function updateDescription
 * Updates the description section with Wikipedia data
 * @param {Object} description - Description object from Wikipedia
 * @param {string} destination - Name of the destination
 */
function updateDescription(description, destination) {
    const contentSection = document.querySelector('.details-content');
    
    if (!contentSection) {
        console.error('Content section not found');
        return;
    }
    
    const descriptionText = description ? description.extract : 'No description available for this destination.';
    
    // Split description into paragraphs (roughly)
    const paragraphs = descriptionText.match(/.{1,300}(\s|$)/g) || [descriptionText];
    
    contentSection.innerHTML = `
        <h2>About ${destination}</h2>
        ${paragraphs.map(para => `<p>${para.trim()}</p>`).join('')}
    `;
}

/**
 * @function showError
 * Displays an error message on the page
 * @param {string} message - Error message to display
 */
function showError(message) {
    const container = document.querySelector('.details-container');
    if (container) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h2 style="color: #E8AC20;">Oops!</h2>
                <p style="color: #555; font-size: 1.1rem; margin: 20px 0;">${message}</p>
                <a href="index.html" style="display: inline-block; background: #E8AC20; color: white; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: 600;">Go to Home</a>
            </div>
        `;
    }
}