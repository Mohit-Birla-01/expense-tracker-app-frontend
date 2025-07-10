// Add Expense page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkAuthStatus();

    // Initialize the page
    initializeAddExpensePage();

    // Load existing expenses
    loadExpenses();
});

// Check authentication status
function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        console.log('User not logged in, but allowing access for development');
    }

    // Update user name if available
    const userName = localStorage.getItem('userName');
    if (userName) {
        const userElement = document.querySelector('.user-name');
        if (userElement) {
            userElement.textContent = `Welcome, ${userName}!`;
        }
    }
}

// Initialize add expense page
function initializeAddExpensePage() {
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;

    // Add form submit event listener
    document.getElementById('expense-form').addEventListener('submit', handleExpenseSubmit);
}

// Handle expense form submission
async function handleExpenseSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const expenseData = {
        amount: parseFloat(formData.get('amount')),
        description: formData.get('description'),
        category: formData.get('category'),
        date: formData.get('date'),
        userId: localStorage.getItem('userEmail') || 'user@example.com'
    };

    // Validate form data
    if (!expenseData.amount || !expenseData.description || !expenseData.category) {
        showMessage('Please fill in all required fields.', 'error');
        return;
    }

    try {
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
        submitBtn.disabled = true;

        // Send to backend
        const response = await fetch('http://localhost:3000/api/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(expenseData)
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Expense added successfully!', 'success');
            e.target.reset();
            document.getElementById('date').value = new Date().toISOString().split('T')[0];

            // Reload expenses list
            loadExpenses();
        } else {
            showMessage(data.message || 'Failed to add expense.', 'error');
        }
    } catch (error) {
        console.error('Error adding expense:', error);
        showMessage('Network error. Please try again.', 'error');
    } finally {
        // Reset button state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Add Expense';
        submitBtn.disabled = false;
    }
}

// Load existing expenses
async function loadExpenses() {
    const expensesList = document.getElementById('expenses-list');

    try {
        // Show loading state
        expensesList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading expenses...</div>';

        const response = await fetch('http://localhost:3000/api/expenses', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            displayExpenses(data.expenses || []);
        } else {
            expensesList.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Failed to load expenses</p></div>';
        }
    } catch (error) {
        console.error('Error loading expenses:', error);
        expensesList.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Network error</p></div>';
    }
}

// Display expenses in the list
function displayExpenses(expenses) {
    const expensesList = document.getElementById('expenses-list');

    if (expenses.length === 0) {
        expensesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-receipt"></i>
                <p>No expenses yet</p>
                <p>Add your first expense above!</p>
            </div>
        `;
        return;
    }

    // Sort expenses by date (newest first)
    expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    const expensesHTML = expenses.map(expense => `
        <div class="expense-item" data-id="${expense._id || expense.id}">
            <button class="delete-btn" onclick="deleteExpense('${expense._id || expense.id}')" title="Delete expense">
                <i class="fas fa-trash"></i>
            </button>
            <div class="expense-header">
                <span class="expense-amount ${expense.category === 'Salary' ? 'income' : ''}">
                    ${expense.category === 'Salary' ? '+' : '-'}$${expense.amount.toFixed(2)}
                </span>
                <span class="expense-category">${expense.category}</span>
            </div>
            <div class="expense-description">${expense.description}</div>
            <div class="expense-date">${formatDate(expense.date)}</div>
        </div>
    `).join('');

    expensesList.innerHTML = expensesHTML;
}

// Delete expense
async function deleteExpense(expenseId) {
    if (!confirm('Are you sure you want to delete this expense?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/expenses/${expenseId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Expense deleted successfully!', 'success');
            loadExpenses(); // Reload the list
        } else {
            showMessage(data.message || 'Failed to delete expense.', 'error');
        }
    } catch (error) {
        console.error('Error deleting expense:', error);
        showMessage('Network error. Please try again.', 'error');
    }
}

// Show message
function showMessage(text, type) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = text;
    messageElement.className = `message ${type}`;

    // Auto-hide after 3 seconds
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 3000);
}

// Go back to dashboard
function goBack() {
    window.location.href = '/home';
}

// Logout function
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    window.location.href = '/login';
}

// Utility function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}
