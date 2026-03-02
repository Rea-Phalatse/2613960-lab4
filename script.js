const countryInput = document.getElementById('country-input');
const loadingSpinner = document.getElementById('loading-spinner');
const countryInfo = document.getElementById('country-info');
const borderingInfo = document.getElementById('bordering-countries');
const errorMessage = document.getElementById('error-message');

async function searchCountry(countryName) {
    try {
        loadingSpinner.classList.remove('hidden');
        errorMessage.textContent = "";
        countryInfo.innerHTML = "";
        borderingInfo.innerHTML = "";

        // Fetch country data
        const response = await fetch(
            `https://restcountries.com/v3.1/name/${countryName}?fullText=true`
        );

        if (!response.ok) {
            throw new Error("Country not found");
        }

        const data = await response.json();
        const country = data[0];

        // Update main country DOM
        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital?.[0] || "N/A"}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" 
                 alt="${country.name.common} flag">
        `;
        countryInfo.classList.remove('hidden');

        // Fetch bordering countries
        if (country.borders && country.borders.length > 0) {
            for (let code of country.borders) {
                const borderResponse = await fetch(
                    `https://restcountries.com/v3.1/alpha/${code}`
                );

                const borderData = await borderResponse.json();
                const borderCountry = borderData[0];

                const borderCard = document.createElement('div');
                borderCard.innerHTML = `
                    <p>${borderCountry.name.common}</p>
                    <img src="${borderCountry.flags.svg}" 
                         alt="${borderCountry.name.common} flag">
                `;

                borderingInfo.appendChild(borderCard);
            }
        } else {
            borderingInfo.innerHTML = "<p>No bordering countries.</p>";
        }

        borderingInfo.classList.remove('hidden');

    } catch (error) {
        errorMessage.textContent = error.message;
    } finally {
        loadingSpinner.classList.add('hidden');
    }
}

document.getElementById('search-btn').addEventListener('click', () => {
    const country = document.getElementById('country-input').value;
    searchCountry(country);
});

countryInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchCountry(input.value.trim());
    }
});