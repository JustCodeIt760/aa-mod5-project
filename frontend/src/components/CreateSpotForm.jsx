import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Import useSelector to access Redux state

function CreateSpotForm() {
  const [formData, setFormData] = useState({
    country: '',
    address: '',
    city: '',
    state: '',
    lat: '',
    lng: '',
    name: '',
    price: '',
    description: '',
    previewImage: '',
    imageUrls: ['', '', '', ''],
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.session.user); // Get the current user from Redux state

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (index, value) => {
    const newImageUrls = [...formData.imageUrls];
    newImageUrls[index] = value;
    setFormData({ ...formData, imageUrls: newImageUrls });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.address) newErrors.address = "Street Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.name) newErrors.name = "Name of your spot is required";
    if (!formData.price) newErrors.price = "Price per night is required";
    if (!formData.previewImage) newErrors.previewImage = "Preview Image URL is required";
    if (formData.description.length < 30) newErrors.description = "Description needs 30 or more characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const csrfToken = getCookie('XSRF-TOKEN'); // Ensure this function is correctly implemented

        const response = await fetch('/api/spots', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': csrfToken, // Include CSRF token in headers
          },
          body: JSON.stringify(formData),
          credentials: 'same-origin', // Ensure cookies are sent with the request
        });

        if (!response.ok) {
          throw new Error('Failed to create spot');
        }

        const newSpot = await response.json();
        // Navigate to the new spot's detail page
        navigate(`/spots/${newSpot.id}`);
      } catch (error) {
        console.error('Error creating spot:', error);
        // Handle error (e.g., set error state)
      }
    }
  };

  function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      let [key, value] = cookie.trim().split('=');
      if (key === name) return decodeURIComponent(value);
    }
    return null;
  }

  // Function to fetch a new CSRF token
  async function fetchCsrfToken() {
    const response = await fetch('/api/csrf/restore', {
      method: 'GET',
      credentials: 'same-origin',
    });
    if (response.ok) {
      const data = await response.json();
      // Assuming the token is returned in the response
      return data.csrfToken;
    }
    throw new Error('Failed to fetch CSRF token');
  }

  // Call this function on page load
  useEffect(() => {
    fetchCsrfToken().then(token => {
      // Store the token in a cookie or state
      document.cookie = `XSRF-TOKEN=${token}; path=/`;
    }).catch(error => {
      console.error('Error fetching CSRF token:', error);
    });
  }, []);

  return (
    <div className="create-spot-form">
      <h1>Create a New Spot</h1>

      {/* Display form-wide errors */}
      {Object.keys(errors).length > 0 && (
        <div className="form-errors">
          <ul>
            {Object.values(errors).map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* First Section */}
        <section>
          <h2>Where's your place located?</h2>
          <p>Guests will only get your exact address once they booked a reservation.</p>
          <label>
            Country:
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
              required
            />
            {errors.country && <p className="error">{errors.country}</p>}
          </label>
          <label>
            Street Address:
            <input
              type="text"
              name="address"
              placeholder="Street Address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            {errors.address && <p className="error">{errors.address}</p>}
          </label>
          <label>
            City:
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
            />
            {errors.city && <p className="error">{errors.city}</p>}
          </label>
          <label>
            State:
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              required
            />
            {errors.state && <p className="error">{errors.state}</p>}
          </label>
          {/* Optional Latitude and Longitude inputs */}
          <label>
            Latitude:
            <input
              type="text"
              name="lat"
              placeholder="Latitude (optional)"
              value={formData.lat}
              onChange={handleChange}
            />
          </label>
          <label>
            Longitude:
            <input
              type="text"
              name="lng"
              placeholder="Longitude (optional)"
              value={formData.lng}
              onChange={handleChange}
            />
          </label>
        </section>

        {/* Second Section */}
        <section>
          <h2>Describe your place to guests</h2>
          <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
          <label>
            Description:
            <textarea
              name="description"
              placeholder="Please write at least 30 characters"
              value={formData.description}
              onChange={handleChange}
              required
            />
            {errors.description && <p className="error">{errors.description}</p>}
          </label>
        </section>

        {/* Third Section */}
        <section>
          <h2>Create a title for your spot</h2>
          <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
          <label>
            Title:
            <input
              type="text"
              name="name"
              placeholder="Name of your spot"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </label>
        </section>

        {/* Fourth Section */}
        <section>
          <h2>Set a base price for your spot</h2>
          <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
          <label>
            Price:
            <input
              type="number"
              name="price"
              placeholder="Price per night (USD)"
              value={formData.price}
              onChange={handleChange}
              required
            />
            {errors.price && <p className="error">{errors.price}</p>}
          </label>
        </section>

        {/* Fifth Section */}
        <section>
          <h2>Liven up your spot with photos</h2>
          <p>Submit a link to at least one photo to publish your spot.</p>
          <label>
            Preview Image URL:
            <input
              type="text"
              name="previewImage"
              placeholder="Preview Image URL"
              value={formData.previewImage}
              onChange={handleChange}
              required
            />
            {errors.previewImage && <p className="error">{errors.previewImage}</p>}
          </label>
          {formData.imageUrls.map((url, index) => (
            <label key={index}>
              Image URL:
              <input
                type="text"
                placeholder="Image URL"
                value={url}
                onChange={(e) => handleImageChange(index, e.target.value)}
              />
            </label>
          ))}
        </section>

        <button type="submit">Create Spot</button>
      </form>
    </div>
  );
}

export default CreateSpotForm;
