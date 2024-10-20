import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function UpdateSpotForm() {
  const { spotId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    lat: '',
    lng: '',
    price: '',
    description: '',
    imageUrl: '', // Optional for MVP
  });

  useEffect(() => {
    const fetchSpotData = async () => {
      try {
        const response = await fetch(`/api/spots/${spotId}`);
        const data = await response.json();
        setFormData({
          name: data.name,
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          lat: data.lat,
          lng: data.lng,
          price: data.price,
          description: data.description,
          imageUrl: '', // Optional for MVP
        });
      } catch (error) {
        console.error('Error fetching spot data:', error);
      }
    };

    fetchSpotData();
  }, [spotId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const getCsrfToken = () => {
    const name = 'XSRF-TOKEN=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const csrfToken = getCsrfToken(); // Retrieve CSRF token
      const response = await fetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken, // Include CSRF token in headers
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Update successful, navigating to detail page');
        navigate(`/spots/${spotId}`); // Redirect to the spot's detail page
      } else {
        const errorData = await response.json();
        console.error('Error updating spot:', errorData);
      }
    } catch (error) {
      console.error('Error updating spot:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Update your Spot</h2>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          placeholder="Name of your spot" // Ensure this matches the test
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="address">Address</label>
        <input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="city">City</label>
        <input
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="state">State</label>
        <input
          id="state"
          name="state"
          value={formData.state}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="country">Country</label>
        <input
          id="country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="lat">Latitude</label>
        <input
          id="lat"
          name="lat"
          value={formData.lat}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="lng">Longitude</label>
        <input
          id="lng"
          name="lng"
          value={formData.lng}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="price">Price</label>
        <input
          id="price"
          name="price"
          placeholder="Price per night (USD)" // Ensure this matches the test
          value={formData.price}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          placeholder="Please write at least 30 characters" // Ensure this matches the test
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="imageUrl">Image URL (Optional)</label>
        <input
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Update your Spot</button>
    </form>
  );
}

export default UpdateSpotForm;
