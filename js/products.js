document.addEventListener('DOMContentLoaded', function() {
    const productsContainer = document.querySelector('.products-container');
    const categoryFilter = document.getElementById('category-filter');
    const sortBy = document.getElementById('sort-by');
    const productSearch = document.getElementById('product-search');
    const searchBtn = document.getElementById('search-btn');
    
    if (!productsContainer) return;
    
    // Sample product data
    const products = [
        {
            id: 1,
            name: 'Organic Tomatoes',
            category: 'vegetables',
            price: 250,
            image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            rating: 4.5,
            description: 'Fresh organic tomatoes, rich in flavor and perfect for salads, sauces, and cooking.',
            isNew: true,
            isPopular: false
        },
        {
            id: 2,
            name: 'Organic Avocados',
            category: 'fruits',
            price: 180,
            image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            rating: 4.8,
            description: 'Creamy Hass avocados, perfect for guacamole or toast.',
            isNew: false,
            isPopular: true
        },
        {
            id: 3,
            name: 'Organic Spinach',
            category: 'vegetables',
            price: 150,
            image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            rating: 4.2,
            description: 'Nutrient-packed spinach leaves, great for salads and smoothies.',
            isNew: false,
            isPopular: false
        },
        {
            id: 4,
            name: 'Organic Bananas',
            category: 'fruits',
            price: 120,
            image: 'https://images.unsplash.com/photo-1603833665858-e61a17a96224?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            rating: 4.3,
            description: 'Naturally sweet bananas, a perfect healthy snack.',
            isNew: false,
            isPopular: true
        },
        {
            id: 5,
            name: 'Organic Basil',
            category: 'herbs',
            price: 100,
            image: 'https://images.unsplash.com/photo-1594282416549-65a9355680d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            rating: 4.6,
            description: 'Fragrant fresh basil for your culinary creations.',
            isNew: true,
            isPopular: false
        },
        {
            id: 6,
            name: 'Organic Carrots',
            category: 'vegetables',
            price: 200,
            image: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            rating: 4.4,
            description: 'Sweet and crunchy carrots, packed with beta-carotene.',
            isNew: false,
            isPopular: false
        },
        {
            id: 7,
            name: 'Organic Mangoes',
            category: 'fruits',
            price: 220,
            image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            rating: 4.9,
            description: 'Juicy, sweet mangoes at their peak ripeness.',
            isNew: false,
            isPopular: true
        },
        {
            id: 8,
            name: 'Organic Quinoa',
            category: 'pantry',
            price: 350,
            image: 'https://images.unsplash.com/photo-1598965402089-897c8e0a3ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            rating: 4.7,
            description: 'Protein-rich quinoa, a perfect grain alternative.',
            isNew: false,
            isPopular: false
        }
    ];
    
    // Render products
    function renderProducts(productsToRender) {
        productsContainer.innerHTML = '';
        
        if (productsToRender.length === 0) {
            productsContainer.innerHTML = '<p class="no-products">No products found matching your criteria.</p>';
            return;
        }
        
        productsToRender.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            let badge = '';
            if (product.isNew) {
                badge = '<span class="product-badge">New</span>';
            } else if (product.isPopular) {
                badge = '<span class="product-badge" style="background-color: var(--secondary-color);">Popular</span>';
            }
            
            productCard.innerHTML = `
                ${badge}
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <span class="product-category">${product.category}</span>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">KSh ${product.price.toFixed(2)}</div>
                    <div class="product-rating">
                        ${renderRating(product.rating)}
                        <span>(${product.rating})</span>
                    </div>
                    <button class="add-to-cart" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            `;
            
            productsContainer.appendChild(productCard);
        });
        
        // Add event listeners to add-to-cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                const product = products.find(p => p.id === productId);
                addToCart(product);
            });
        });
    }
    
    // Render star rating
    function renderRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        
        return stars;
    }
    
    // Filter and sort products
    function filterAndSortProducts() {
        const category = categoryFilter ? categoryFilter.value : 'all';
        const sort = sortBy ? sortBy.value : 'popular';
        const searchTerm = productSearch ? productSearch.value.toLowerCase() : '';
        
        let filteredProducts = [...products];
        
        // Filter by category
        if (category !== 'all') {
            filteredProducts = filteredProducts.filter(product => product.category === category);
        }
        
        // Filter by search term
        if (searchTerm) {
            filteredProducts = filteredProducts.filter(product => 
                product.name.toLowerCase().includes(searchTerm) || 
                product.description.toLowerCase().includes(searchTerm)
            );
        }
        
        // Sort products
        switch (sort) {
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                filteredProducts.sort((a, b) => (b.isNew || false) - (a.isNew || false));
                break;
            default: // popular
                filteredProducts.sort((a, b) => (b.isPopular || false) - (a.isPopular || false) || b.rating - a.rating);
        }
        
        renderProducts(filteredProducts);
    }
    
    // Event listeners for filters
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterAndSortProducts);
    }
    
    if (sortBy) {
        sortBy.addEventListener('change', filterAndSortProducts);
    }
    
    if (searchBtn && productSearch) {
        searchBtn.addEventListener('click', filterAndSortProducts);
        productSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                filterAndSortProducts();
            }
        });
    }
    
    // Initial render
    filterAndSortProducts();
});