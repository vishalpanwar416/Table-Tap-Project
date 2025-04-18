// AdminPage.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { categories } from '../FoodData/foodData';
import { allFoodItems, addFoodItem, updateFoodItem, deleteFoodItem } from '../FoodData/foodData';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('food');
  const [foodItems, setFoodItems] = useState(allFoodItems);
  const [offers, setOffers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Snacks',
    tags: [],
    image: ''
  });
  const [editItem, setEditItem] = useState(null);

  // Food Item Management
  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      ...formData,
      id: editItem ? editItem.id : Math.max(...foodItems.map(item => item.id)) + 1,
      price: parseFloat(formData.price),
      tags: formData.tags.split(',').map(tag => tag.trim())
    };

    if(editItem) {
      updateFoodItem(newItem);
    } else {
      addFoodItem(newItem);
    }
    
    setFoodItems(allFoodItems);
    setFormData({
      name: '',
      price: '',
      description: '',
      category: 'Snacks',
      tags: [],
      image: ''
    });
    setEditItem(null);
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setFormData({
      ...item,
      tags: item.tags.join(', ')
    });
  };

  const handleDelete = (id) => {
    deleteFoodItem(id);
    setFoodItems(allFoodItems);
  };

  // Offer Management
  const [offerForm, setOfferForm] = useState({
    title: '',
    discount: '',
    validUntil: '',
    category: 'All'
  });

  const handleOfferSubmit = (e) => {
    e.preventDefault();
    const newOffer = {
      id: offers.length + 1,
      ...offerForm,
      discount: parseFloat(offerForm.discount)
    };
    setOffers([...offers, newOffer]);
    setOfferForm({
      title: '',
      discount: '',
      validUntil: '',
      category: 'All'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('food')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'food' ? 'bg-blue-600 text-white' : 'bg-white'
            }`}
          >
            Food Items
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'offers' ? 'bg-blue-600 text-white' : 'bg-white'
            }`}
          >
            Offers
          </button>
        </div>

        {/* Food Items Management */}
        {activeTab === 'food' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Manage Food Items</h2>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-8">
              <input
                type="text"
                placeholder="Item Name"
                className="p-2 border rounded"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <input
                type="number"
                placeholder="Price"
                className="p-2 border rounded"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
              <textarea
                placeholder="Description"
                className="p-2 border rounded col-span-2"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
              <select
                className="p-2 border rounded"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                {categories.map(category => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Tags (comma separated)"
                className="p-2 border rounded"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
              />
              <input
                type="text"
                placeholder="Image URL"
                className="p-2 border rounded col-span-2"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                required
              />
              <button
                type="submit"
                className="col-span-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
              >
                {editItem ? 'Update Item' : 'Add Item'}
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {foodItems.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-lg shadow-md">
                  <img src={item.image} alt={item.name} className="w-full h-48 object-cover mb-4" />
                  <h3 className="font-semibold mb-2">{item.name}</h3>
                  <p className="text-gray-600 mb-2">₹{item.price}</p>
                  <p className="text-sm text-gray-500 mb-4">{item.description}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex items-center gap-1 text-blue-600"
                    >
                      <Edit size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex items-center gap-1 text-red-600"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Offers Management */}
        {activeTab === 'offers' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Manage Offers</h2>
            
            <form onSubmit={handleOfferSubmit} className="grid grid-cols-2 gap-4 mb-8">
              <input
                type="text"
                placeholder="Offer Title"
                className="p-2 border rounded"
                value={offerForm.title}
                onChange={(e) => setOfferForm({...offerForm, title: e.target.value})}
                required
              />
              <input
                type="number"
                placeholder="Discount Percentage"
                className="p-2 border rounded"
                value={offerForm.discount}
                onChange={(e) => setOfferForm({...offerForm, discount: e.target.value})}
                required
              />
              <input
                type="date"
                placeholder="Valid Until"
                className="p-2 border rounded"
                value={offerForm.validUntil}
                onChange={(e) => setOfferForm({...offerForm, validUntil: e.target.value})}
                required
              />
              <select
                className="p-2 border rounded"
                value={offerForm.category}
                onChange={(e) => setOfferForm({...offerForm, category: e.target.value})}
              >
                <option value="All">All Categories</option>
                {categories.map(category => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="col-span-2 bg-green-600 text-white p-2 rounded hover:bg-green-700"
              >
                <Plus size={16} className="mr-2" /> Add Offer
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {offers.map(offer => (
                <div key={offer.id} className="bg-yellow-50 p-4 rounded-lg shadow-md">
                  <h3 className="font-semibold mb-2">{offer.title}</h3>
                  <p className="text-lg text-green-600 mb-2">{offer.discount}% OFF</p>
                  <p className="text-sm mb-2">Valid until: {offer.validUntil}</p>
                  <p className="text-sm text-gray-500">Category: {offer.category}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;