var CustomersService = {
    // Base URL for your backend API
    baseUrl: 'http://localhost/final-2025-fall-prep/backend/rest',
    
    init: function() {
        console.log('CustomersService initialized');
        
        // Load initial customers when the service initializes
        this.loadCustomers();
        
        // Set up event listeners
        this.setupEventListeners();
    },
    
    setupEventListeners: function() {
        // Customer selection change handler
        $('#customers-list').off('change').on('change', function() {
            const customerId = $(this).val();
            console.log('Selected customer ID:', customerId);
            
            if (customerId && customerId !== 'Please select one customer') {
                CustomersService.loadCustomerMeals(customerId);
            } else {
                // Clear the table if no valid customer is selected
                $('#customer-meals tbody').empty();
            }
        });
        
        // Form submission handler
        $('#add-customer-form').off('submit').on('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted');
            CustomersService.addCustomer();
        });
        
        // Clear table when modal is closed without saving
        $('#add-customer-modal').on('hidden.bs.modal', function() {
            $('#add-customer-form')[0].reset();
        });
    },
    
    loadCustomers: function() {
        console.log('Loading customers...');
        
        // Show loading state
        $('#customers-list').html('<option>Loading customers...</option>');
        
        $.ajax({
            url: this.baseUrl + '/customers',
            method: 'GET',
            dataType: 'json',
            success: function(response) {
                console.log('Customers loaded:', response);
                
                const select = $('#customers-list');
                select.empty();
                
                // Add default option
                select.append('<option value="" selected disabled>Please select one customer</option>');
                
                // Check if response is an array and has data
                if (Array.isArray(response) && response.length > 0) {
                    response.forEach(function(customer) {
                        select.append($('<option>', {
                            value: customer.id,
                            text: customer.first_name + ' ' + customer.last_name
                        }));
                    });
                } else {
                    select.append('<option disabled>No customers found</option>');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error loading customers:', xhr.responseText);
                $('#customers-list').html('<option disabled>Error loading customers</option>');
                
                // Show user-friendly error message
                toastr.error('Failed to load customers. Please try again.');
            }
        });
    },
    
    loadCustomerMeals: function(customerId) {
        console.log('Loading meals for customer:', customerId);
        
        // Show loading state in table
        const tableBody = $('#customer-meals tbody');
        tableBody.html('<tr><td colspan="3" class="text-center">Loading meals...</td></tr>');
        
        $.ajax({
            url: this.baseUrl + '/customer/meals/' + customerId,
            method: 'GET',
            dataType: 'json',
            success: function(response) {
                console.log('Customer meals loaded:', response);
                
                tableBody.empty();
                
                if (Array.isArray(response) && response.length > 0) {
                    response.forEach(function(meal) {
                        // Format the date properly
                        let mealDate = 'N/A';
                        if (meal.meal_date) {
                            const date = new Date(meal.meal_date);
                            mealDate = date.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            });
                        }
                        
                        tableBody.append(
                            $('<tr>').append(
                                $('<td>').text(meal.food_name || 'N/A'),
                                $('<td>').text(meal.food_brand || 'N/A'),
                                $('<td>').text(mealDate)
                            )
                        );
                    });
                } else {
                    tableBody.html('<tr><td colspan="3" class="text-center">No meals found for this customer</td></tr>');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error loading meals:', xhr.responseText);
                tableBody.html('<tr><td colspan="3" class="text-center text-danger">Error loading meals</td></tr>');
                
                toastr.error('Failed to load customer meals. Please try again.');
            }
        });
    },
    
    addCustomer: function() {
        console.log('Adding customer...');
        
        // Get form data
        const formData = {
            first_name: $('#first_name').val().trim(),
            last_name: $('#last_name').val().trim(),
            birth_date: $('#birth_date').val()
        };
        
        // Basic validation
        if (!formData.first_name) {
            toastr.error('Please enter first name');
            return;
        }
        
        if (!formData.last_name) {
            toastr.error('Please enter last name');
            return;
        }
        
        if (!formData.birth_date) {
            toastr.error('Please enter birth date');
            return;
        }
        
        // Disable submit button to prevent double submission
        const submitBtn = $('#add-customer-form button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Adding...');
        
        $.ajax({
            url: this.baseUrl + '/customers/add',
            method: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                console.log('Customer added:', response);
                
                // Close modal and reset form
                $('#add-customer-modal').modal('hide');
                $('#add-customer-form')[0].reset();
                
                // Refresh customer list
                CustomersService.loadCustomers();
                
                // Show success message
                toastr.success('Customer added successfully!');
            },
            error: function(xhr, status, error) {
                console.error('Error adding customer:', xhr.responseText);
                
                let errorMessage = 'Failed to add customer. Please try again.';
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMessage = xhr.responseJSON.message;
                }
                
                toastr.error(errorMessage);
            },
            complete: function() {
                // Re-enable submit button
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    }
};

// Make sure the service is available globally
window.CustomersService = CustomersService;