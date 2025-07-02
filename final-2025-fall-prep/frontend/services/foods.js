var FoodsService = {
    // Base URL for your backend API
    baseUrl: 'http://localhost/final-2025-fall-prep/backend/rest',
    
    // Pagination settings
    currentPage: 1,
    perPage: 10,
    
    init: function() {
        console.log('FoodsService initialized');
        
        // Load initial foods when the service initializes
        this.loadFoods();
        
        // Set up event listeners
        this.setupEventListeners();
    },
    
    // Method to be called when the foods section is loaded
    onPageLoad: function() {
        console.log('Foods page loaded');
        this.init();
    },
    
    setupEventListeners: function() {
        // You can add pagination event listeners here if needed
        // For now, we'll just load the first page
    },
    
    loadFoods: function(page = 1) {
        console.log('Loading foods for page:', page);
        
        // Show loading state in table
        const tableBody = $('#foods-table tbody');
        tableBody.html('<tr><td colspan="8" class="text-center">Loading foods...</td></tr>');
        
        // Update current page
        this.currentPage = page;
        
        $.ajax({
            url: this.baseUrl + '/foods/report?page=' + page + '&perPage=' + this.perPage,
            method: 'GET',
            dataType: 'json',
            success: function(response) {
                console.log('Foods loaded:', response);
                
                tableBody.empty();
                
                if (Array.isArray(response) && response.length > 0) {
                    response.forEach(function(food) {
                        // Create table row for each food
                        const row = $('<tr>').append(
                            $('<td>').text(food.name || 'N/A'),
                            $('<td>').text(food.brand || 'N/A'),
                            $('<td>').addClass('text-center').html(
                                food.image ? 
                                    '<img src="' + food.image + '" height="50" alt="' + (food.name || 'Food') + '" onerror="this.src=\'https://picsum.photos/200\'" />' : 
                                    '<img src="https://picsum.photos/200" height="50" alt="No image" />'
                            ),
                            $('<td>').text(food.energy || '0'),
                            $('<td>').text(food.protein || '0'),
                            $('<td>').text(food.fat || '0'),
                            $('<td>').text(food.fiber || '0'),
                            $('<td>').text(food.carbs || '0')
                        );
                        
                        tableBody.append(row);
                    });
                } else {
                    tableBody.html('<tr><td colspan="8" class="text-center">No foods found</td></tr>');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error loading foods:', xhr.responseText);
                tableBody.html('<tr><td colspan="8" class="text-center text-danger">Error loading foods</td></tr>');
                
                // Show user-friendly error message
                toastr.error('Failed to load foods. Please try again.');
            }
        });
    },
    
    // Method to load next page (if you want to implement pagination)
    loadNextPage: function() {
        this.loadFoods(this.currentPage + 1);
    },
    
    // Method to load previous page (if you want to implement pagination)
    loadPreviousPage: function() {
        if (this.currentPage > 1) {
            this.loadFoods(this.currentPage - 1);
        }
    },
    
    // Method to reload current page
    reload: function() {
        this.loadFoods(this.currentPage);
    }
};

// Make sure the service is available globally
window.FoodsService = FoodsService;