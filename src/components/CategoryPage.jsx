import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { getProductImage } from '../utils/productImages';

const PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23333" width="300" height="300"/%3E%3Ctext x="50%25" y="50%25" font-size="14" fill="%23999" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';

const ProductCard = ({ product }) => (
  <Link to={`/product/${product.id}`} className="no-underline text-white group">
    <div className="bg-gray-900 rounded-xl overflow-hidden border-2 border-gray-800 hover:border-white transition-all duration-300 hover:-translate-y-2 cursor-pointer h-full">
      <div className="overflow-hidden h-64">
        <img
          src={getProductImage(product) || PLACEHOLDER}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = PLACEHOLDER; }}
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="text-base font-semibold text-white mb-2 line-clamp-2 min-h-[40px]">{product.name}</h3>
        <p className="text-lg font-bold text-white">₹{product.price}</p>
      </div>
    </div>
  </Link>
);

const CategoryPage = ({ category, title }) => {
  const { data: all = [], loading } = useFetch('/admin/public/products');
  const [searchTerm, setSearchTerm] = useState('');

  const products = (all || []).filter(p => {
    const pCat = (p.category || '').toLowerCase();
    const cat = category.toLowerCase();
    
    // 1. Direct or sub-category match (e.g. 'male-tshirts' exact match, or 'tshirts' matches 'male-tshirts')
    if (pCat === cat || pCat.endsWith('-' + cat)) {
      return true;
    }
    
    // 2. Fallback check for legacy 'tshirts' products
    if (pCat === 'tshirts' || pCat === 'tshirt') {
      const val = `${p.category || ''} ${p.name || ''}`.toLowerCase();
      if (cat === 'male-tshirts') {
        return (val.includes('male') && !val.includes('female')) || 
               (val.includes('men') && !val.includes('women')) || 
               (val.includes('man') && !val.includes('woman'));
      }
      if (cat === 'female-tshirts') {
        return val.includes('female') || val.includes('women') || val.includes('woman') || val.includes('ladies');
      }
      if (cat === 'oversized-tshirts') {
        return val.includes('oversized');
      }
    }
    
    return false;
  });
  const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-10">{title}</h2>

        <div className="flex justify-center mb-10">
          <div className="flex items-center bg-gray-950 border border-gray-700 hover:border-white rounded-full px-5 py-3 w-full max-w-md transition-colors duration-200">
            <span className="mr-3 text-lg">🔍</span>
            <input
              type="text"
              placeholder={`Search ${title}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none text-white text-sm w-full placeholder-gray-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-white text-center">
              <div className="text-4xl mb-4 animate-spin">⏳</div>
              <p>Loading {title}...</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-400 py-24">
            {searchTerm ? `No results for "${searchTerm}"` : `No ${title} found`}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
