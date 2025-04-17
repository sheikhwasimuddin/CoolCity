let map;
        const openWeatherMapApiKey = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your OpenWeatherMap API key

        function initMap() {
            map = L.map('map').setView([21.1458, 79.0882], 13);

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            map.on('click', function(e) {
                const lat = e.latlng.lat.toFixed(6);
                const lng = e.latlng.lng.toFixed(6);
                updateLocationInput(lat, lng);
                getInterventionSuggestions(lat, lng);
                fetchWeatherData(lat, lng);
            });

            setupZoomControls();
            setupLayerToggles();
            setupGeolocation();
            setupReportForm();
            fetchWeatherData(21.1458, 79.0882);
        }

        document.addEventListener('DOMContentLoaded', function() {
            initMap();
            setupLearnMoreLinks();
        });

        function updateLocationInput(lat, lng) {
            const locationInput = document.getElementById('location');
            if (locationInput) {
                locationInput.value = `${lat}, ${lng}`;
            }
        }

        function setupZoomControls() {
            const zoomInButton = document.querySelector('.zoom-in');
            const zoomOutButton = document.querySelector('.zoom-out');

            if (zoomInButton) {
                zoomInButton.addEventListener('click', () => map.setZoom(map.getZoom() + 1));
            }
            if (zoomOutButton) {
                zoomOutButton.addEventListener('click', () => map.setZoom(map.getZoom() - 1));
            }
        }

        function setupLayerToggles() {
            const heatmapLayerButton = document.querySelector('.map-control-button:nth-child(1)');
            const buildingsLayerButton = document.querySelector('.map-control-button:nth-child(2)');
            const communityLayerButton = document.querySelector('.map-control-button:nth-child(3)');
            const infoLayerButton = document.querySelector('.map-control-button:nth-child(4)');

            function toggleButtonActiveClass(button) {
                document.querySelectorAll('.map-control-button').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            }

            if (heatmapLayerButton) {
                heatmapLayerButton.addEventListener('click', () => {
                    toggleButtonActiveClass(heatmapLayerButton);
                    console.log('Toggling Heat Map Layer (Leaflet)');
                    // Implement Leaflet layer control logic here
                });
            }

            if (buildingsLayerButton) {
                buildingsLayerButton.addEventListener('click', () => {
                    toggleButtonActiveClass(buildingsLayerButton);
                    console.log('Toggling Buildings Layer (Leaflet)');
                    // Implement Leaflet layer control logic here
                });
            }

            if (communityLayerButton) {
                communityLayerButton.addEventListener('click', () => {
                    toggleButtonActiveClass(communityLayerButton);
                    console.log('Toggling Community Layer (Leaflet)');
                    // Implement Leaflet layer control logic here
                });
            }

            if (infoLayerButton) {
                infoLayerButton.addEventListener('click', () => {
                    toggleButtonActiveClass(infoLayerButton);
                    console.log('Toggling Info Layer (Leaflet)');
                    // Implement Leaflet layer control logic here
                });
            }
        }

        function setupGeolocation() {
            const geolocationButton = document.querySelector('.geolocation-button');
            if (geolocationButton && navigator.geolocation) {
                geolocationButton.addEventListener('click', () => {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const lat = position.coords.latitude.toFixed(6);
                            const lng = position.coords.longitude.toFixed(6);
                            updateLocationInput(lat, lng);
                            map.setView([parseFloat(lat), parseFloat(lng)], 15);
                            getInterventionSuggestions(lat, lng);
                            fetchWeatherData(lat, lng);
                        },
                        (error) => {
                            alert('Error getting geolocation: ' + error.message);
                        }
                    );
                });
            } else if (geolocationButton) {
                geolocationButton.style.display = 'none';
            }
        }

        function setupReportForm() {
            const reportForm = document.getElementById('report-form');
            if (reportForm) {
                reportForm.addEventListener('submit', function(event) {
                    event.preventDefault();
                    const location = document.getElementById('location').value;
                    const temperature = document.getElementById('temperature').value;
                    const date = document.getElementById('date').value;
                    const description = document.getElementById('description').value;
                    const email = document.getElementById('email').value;

                    console.log('Heat island report submitted:', { location, temperature, date, description, email });
                    alert('Report submitted! (This is a frontend simulation)');
                    reportForm.reset();
                });
            }
        }

        function getInterventionSuggestions(latitude, longitude) {
            console.log(`Fetching suggestions for: ${latitude}, ${longitude}`);
            const suggestionsList = document.getElementById('suggestions-list');
            if (suggestionsList) {
                suggestionsList.innerHTML = '';
                const loadingItem = document.createElement('li');
                loadingItem.textContent = 'Fetching suggestions...';
                suggestionsList.appendChild(loadingItem);

                setTimeout(() => {
                    const suggestions = [
                        "Promote planting of indigenous shade trees in this area.",
                        "Consider implementing cool roof policies for new constructions.",
                        "Explore the use of permeable pavements in public spaces.",
                        "Develop small urban green spaces and pocket parks.",
                        "Encourage the creation of green walls on buildings."
                    ];
                    suggestionsList.innerHTML = '';
                    suggestions.forEach(suggestion => {
                        const listItem = document.createElement('li');
                        listItem.textContent = suggestion;
                        suggestionsList.appendChild(listItem);
                    });
                }, 1500);
            }
        }

        function fetchWeatherData(latitude, longitude) {
            const apiKeyOWM = openWeatherMapApiKey;
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKeyOWM}&units=metric`;

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    console.log('Weather Data:', data);
                    updateWeatherIndicators(data);
                })
                .catch(error => {
                    console.error('Error fetching weather data:', error);
                });
        }

        function updateWeatherIndicators(weatherData) {
            const tempElement = document.querySelector('.indicator-card:nth-child(1) .value');
            const humidityElement = document.querySelector('.indicator-card:nth-child(2) .value');

            if (weatherData && weatherData.main) {
                const temperatureCelsius = weatherData.main.temp;
                const temperatureFahrenheit = (temperatureCelsius * 9/5) + 32;
                const humidity = weatherData.main.humidity;

                if (tempElement) {
                    tempElement.textContent = `${temperatureFahrenheit.toFixed(1)}°F`;
                }
                if (humidityElement) {
                    humidityElement.textContent = `${humidity}%`;
                }
            }
        }

        function setupLearnMoreLinks() {
            const learnMoreLinks = document.querySelectorAll('.intervention-card .learn-more');
            learnMoreLinks.forEach(link => {
                link.addEventListener('click', function(event) {
                    event.preventDefault();
                    const targetUrl = this.getAttribute('href');
                    if (targetUrl) {
                        window.location.href = targetUrl;
                    } else {
                        alert('More information coming soon!');
                    }
                });
            });
            async function fetchWeather(lat, lon) {
                const apiKey = 'YOUR_API_KEY';
                const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${apiKey}&units=metric`;
              
                const response = await fetch(url);
                const data = await response.json();
                const trendMessage = analyzeWeatherTrends(data);
                document.getElementById("forecast-tip").innerText = trendMessage;
              }
              
        }