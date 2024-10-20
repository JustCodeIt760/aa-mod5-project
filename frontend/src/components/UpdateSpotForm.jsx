import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function getCsrfToken() {
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
}

function UpdateSpotForm() {
  const { spotId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    country: '',
    address: '',
    city: '',
    state: '',
    lat: '',
    lng: '',
    description: '',
    name: '',
    price: '',
    images: ['', '', '', '', ''],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchSpotData = async () => {
      try {
        const response = await fetch(`/api/spots/${spotId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch spot data');
        }
        const spotData = await response.json();
        setFormData({
          country: spotData.country,
          address: spotData.address,
          city: spotData.city,
          state: spotData.state,
          lat: spotData.lat || '',
          lng: spotData.lng || '',
          description: spotData.description,
          name: spotData.name,
          price: spotData.price,
          images: spotData.SpotImages?.map(img => img.url) || ['', '', '', '', ''],
        });
      } catch (error) {
        console.error('Error fetching spot data:', error);
        setErrors({ api: 'Failed to fetch spot data. Please try again.' });
      }
    };

    fetchSpotData();
  }, [spotId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('image')) {
      const index = parseInt(name.split('-')[1], 10);
      const newImages = [...formData.images];
      newImages[index] = value;
      setFormData({
        ...formData,
        images: newImages,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.address) newErrors.address = "Street Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.description || formData.description.length < 30) {
      newErrors.description = "Description needs 30 or more characters";
    }
    if (!formData.name) newErrors.name = "Name of your spot is required";
    if (!formData.price) newErrors.price = "Price per night is required";
    if (!formData.images[0]) newErrors.images = "Preview Image URL is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const csrfToken = getCsrfToken();
        const response = await fetch(`/api/spots/${spotId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken,
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Failed to update spot');
        }

        const updatedSpot = await response.json();
        navigate(`/spots/${updatedSpot.id}`);
      } catch (error) {
        console.error('Error updating spot:', error);
        setErrors({ api: 'Failed to update spot. Please try again.' });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="update-spot-form">
      <h2 data-testid="form-title">Update your Spot</h2>
      
      <div data-testid="section-1">
        <h2 data-testid="section-1-heading">Where's your place located?</h2>
        <p data-testid="section-1-caption">Guests will only get your exact address once they booked a reservation.</p>
        <div>
          <label htmlFor="country">Country</label>
          <input
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country"
            required
          />
          {errors.country && <p className="error">{errors.country}</p>}
        </div>

        <div>
          <label htmlFor="address">Street Address</label>
          <input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Street Address"
            required
          />
          {errors.address && <p className="error">{errors.address}</p>}
        </div>

        <div>
          <label htmlFor="city">City</label>
          <input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            required
          />
          {errors.city && <p className="error">{errors.city}</p>}
        </div>

        <div>
          <label htmlFor="state">State</label>
          <input
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State"
            required
          />
          {errors.state && <p className="error">{errors.state}</p>}
        </div>

        <div>
          <label htmlFor="lat">Latitude</label>
          <input
            id="lat"
            name="lat"
            value={formData.lat}
            onChange={handleChange}
            placeholder="Latitude"
          />
        </div>

        <div>
          <label htmlFor="lng">Longitude</label>
          <input
            id="lng"
            name="lng"
            value={formData.lng}
            onChange={handleChange}
            placeholder="Longitude"
          />
        </div>
      </div>

      <div data-testid="section-2">
        <h2 data-testid="section-2-heading">Describe your place to guests</h2>
        <p data-testid="section-2-caption">Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
        <div>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Please write at least 30 characters"
            required
            minLength={30}
          />
          {errors.description && <p className="error">{errors.description}</p>}
        </div>
      </div>

      <div data-testid="section-3">
        <h2 data-testid="section-3-heading">Create a title for your spot</h2>
        <p data-testid="section-3-caption">Catch guests' attention with a spot title that highlights what makes your place special.</p>
        <div>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name of your spot"
            required
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>
      </div>

      <div data-testid="section-4">
        <h2 data-testid="section-4-heading">Set a base price for your spot</h2>
        <p data-testid="section-4-caption">Competitive pricing can help your listing stand out and rank higher in search results.</p>
        <div>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price per night (USD)"
            required
            min="0"
            step="0.01"
          />
          {errors.price && <p className="error">{errors.price}</p>}
        </div>
      </div>

      <div data-testid="section-5">
        <h2 data-testid="section-5-heading">Liven up your spot with photos</h2>
        <p data-testid="section-5-caption">Submit a link to at least one photo to publish your spot.</p>
        
        <input
          type="url"
          name="image-0"
          value={formData.images[0]}
          onChange={handleChange}
          placeholder="Preview Image URL"
          required
        />
        {errors.images && <p className="error">{errors.images}</p>}
        
        {[1, 2, 3, 4].map((index) => (
          <div key={index}>
            <input
              type="url"
              name={`image-${index}`}
              value={formData.images[index]}
              onChange={handleChange}
              placeholder="Image URL"
            />
          </div>
        ))}
      </div>
      <button type="submit" data-testid="update-spot-button">Create Spot</button>
    </form>
  );
}

export default UpdateSpotForm;
