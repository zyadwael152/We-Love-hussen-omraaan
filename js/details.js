document.addEventListener('DOMContentLoaded', () => {
    loadDestinationDetails();
});

/**
 * @function loadDestinationDetails
 * Parses the URL query parameter for destination name and displays details
 */
async function loadDestinationDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const destinationName = urlParams.get('destination');

    if (!destinationName) {
        displayError('No destination specified.');
        return;
    }

    try {
        const response = await fetch('data/mock.json');
        if (!response.ok) throw new Error('Failed to load destination data');
        const destinations = await response.json();

        const destination = destinations.find(dest =>
            dest.name.toLowerCase() === destinationName.toLowerCase()
        );

        if (!destination) {
            displayError('Destination not found.');
            return;
        }

        displayDestinationDetails(destination);
    } catch (error) {
        console.error('Error loading destination details:', error);
        displayError('Error loading destination details. Please try again later.');
    }
}

/**
 * @function displayDestinationDetails
 * Renders the destination details in the page
 * @param {Object} destination - Destination object with name, desc, img, etc.
 */
function displayDestinationDetails(destination) {
    const detailsContainer = document.getElementById('destination-details');

    const detailsHTML = `
        <div class="destination-header">
            <h1>${destination.name}</h1>
            <p class="country">${destination.country}</p>
        </div>
        <div class="destination-content">
            <img src="${destination.img}" alt="${destination.name}" class="destination-image">
            <div class="destination-description">
                <p>${destination.desc}</p>
            </div>
        </div>
    `;

    detailsContainer.innerHTML = detailsHTML;
}

/**
 * @function displayError
 * Displays an error message in the details container
 * @param {string} message - Error message to display
 */
function displayError(message) {
    const detailsContainer = document.getElementById('destination-details');
    detailsContainer.innerHTML = `<p style="text-align: center; color: red; padding: 40px; font-size: 18px;">${message}</p>`;
}
