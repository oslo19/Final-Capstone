import React, { useState, useEffect } from 'react';
import { FaLocationCrosshairs } from 'react-icons/fa6';
import { ImLocation } from "react-icons/im";

const MapSearchBox = ({ onAddressSelect, currentAddress }) => {
    const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";
    const [searchText, setSearchText] = useState(currentAddress || ''); // Initialize with current address if available
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const BASE_URL = import.meta.env.VITE_BACKEND_URL;
    useEffect(() => {
        setSearchText(currentAddress || '');  // Reset searchText when currentAddress changes
    }, [currentAddress]);

    useEffect(() => {
        const CEBU_VIEWBOX = {
            southwest: { lat: 9.550, lon: 123.593 },  // Southwest corner of Cebu
            northeast: { lat: 11.316, lon: 124.019 }  // Northeast corner of Cebu
        };
        if (searchText.length > 2 && showSuggestions) {
            const params = new URLSearchParams({
                q: `${searchText}, Cebu, Philippines`,
                format: 'json',
                addressdetails: '1',
                limit: '5',
                viewbox: `${CEBU_VIEWBOX.southwest.lon},${CEBU_VIEWBOX.southwest.lat},${CEBU_VIEWBOX.northeast.lon},${CEBU_VIEWBOX.northeast.lat}`,
                bounded: '1'
            });

            fetch(`${NOMINATIM_BASE_URL}${params}`)
                .then(response => response.json())
                .then(data => {
                    const newSuggestions = data.map(item => ({
                        display_name: item.display_name,
                        address: item.address,
                        lat: item.lat,
                        lon: item.lon
                    }));
                    setSuggestions(newSuggestions);
                })
                .catch(error => {
                    console.error('Error fetching data from Nominatim:', error);
                });
        } else {
            setSuggestions([]);
        }
    }, [searchText, showSuggestions]);

    const handleSuggestionClick = (suggestion) => {
        setSearchText(suggestion.display_name);  // Set the input to the selected suggestion
        setShowSuggestions(false);  // Hide suggestions after selection
        setSuggestions([]);         // Clear suggestions
        onAddressSelect(suggestion); // Send selected suggestion to parent
    };

    return (
        <div className="relative">
            <form className="max-w-full mt-9">
                <div className="relative z-20">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <FaLocationCrosshairs color="red" className="h-6 w-6" />
                    </div>
                    <input
                        type="search"
                        id="default-search"
                        className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
                        placeholder="Enter your exact location address"
                        value={searchText}  // Bind input value to searchText state
                        onChange={(e) => {
                            setSearchText(e.target.value);
                            setShowSuggestions(true);  // Show suggestions when the user types
                        }}
                        required
                    />
                </div>
            </form>

            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-50 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-w-full text-black">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            <div className='flex gap-1'>
                                <ImLocation color="red" className="h-6 w-6" />
                                {suggestion.display_name}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MapSearchBox;
