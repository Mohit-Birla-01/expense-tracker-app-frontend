// Home page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkAuthStatus();

    // Initialize the page
    initializeHomePage();

    // Load real expenses
    loadHomeExpenses();
});

// Check authentication status
function checkAuthStatus() {
    // Check if user is logged in (without token requirement)
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        // For development, we'll allow access without login
        // In production, you would redirect to login
        console.log('User not logged in, but allowing access for development');
        // window.location.href = '/login';
        // return;
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

// Initialize home page
function initializeHomePage() {
    // Add any initialization logic here
    console.log('Home page initialized');
}

// Load expenses for home page
async function loadHomeExpenses() {
    try {
        const response = await fetch('http://localhost:3000/api/expenses', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            updateHomeStats(data.expenses || []);
            updateRecentTransactions(data.expenses || []);
        }
    } catch (error) {
        console.error('Error loading expenses for home page:', error);
    }
}

// Update home page statistics
function updateHomeStats(expenses) {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Filter expenses for current month
    const monthlyExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth &&
               expenseDate.getFullYear() === currentYear;
    });

    // Calculate totals
    const totalExpenses = monthlyExpenses
        .filter(exp => exp.category !== 'Salary')
        .reduce((sum, exp) => sum + exp.amount, 0);

    const totalIncome = monthlyExpenses
        .filter(exp => exp.category === 'Salary')
        .reduce((sum, exp) => sum + exp.amount, 0);

    const budgetRemaining = 3000 - totalExpenses;
    const totalTransactions = monthlyExpenses.length;
    const totalSavings = totalIncome - totalExpenses;

    // Update stats cards
    updateStatCard('Total Expenses', `$${totalExpenses.toFixed(2)}`);
    updateStatCard('Budget Remaining', `$${budgetRemaining.toFixed(2)}`);
    updateStatCard('Transactions', totalTransactions.toString());
    updateStatCard('Savings', `$${totalSavings.toFixed(2)}`);
}

// Update a specific stat card
function updateStatCard(title, value) {
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        const cardTitle = card.querySelector('h3').textContent;
        if (cardTitle === title) {
            card.querySelector('.stat-value').textContent = value;
        }
    });
}

// Update recent transactions section
function updateRecentTransactions(expenses) {
    const transactionsList = document.querySelector('.transactions-list');

    if (expenses.length === 0) {
        transactionsList.innerHTML = `
            <div class="transaction-item">
                <div class="transaction-icon">
                    <i class="fas fa-info-circle"></i>
                </div>
                <div class="transaction-details">
                    <h4>No transactions yet</h4>
                    <p>Add your first expense to see it here</p>
                </div>
                <div class="transaction-amount">
                    <span class="amount">$0.00</span>
                    <span class="date">-</span>
                </div>
            </div>
        `;
        return;
    }

    // Sort by date (newest first) and take first 4
    const recentExpenses = expenses
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 4);

    const transactionsHTML = recentExpenses.map(expense => {
        const isIncome = expense.category === 'Salary';
        const icon = getCategoryIcon(expense.category);

        return `
            <div class="transaction-item">
                <div class="transaction-icon">
                    <i class="${icon}"></i>
                </div>
                <div class="transaction-details">
                    <h4>${expense.description}</h4>
                    <p>${expense.category}</p>
                </div>
                <div class="transaction-amount">
                    <span class="amount ${isIncome ? 'income' : ''}">
                        ${isIncome ? '+' : '-'}$${expense.amount.toFixed(2)}
                    </span>
                    <span class="date">${formatDate(expense.date)}</span>
                </div>
            </div>
        `;
    }).join('');

    transactionsList.innerHTML = transactionsHTML;
}

// Get icon for category
function getCategoryIcon(category) {
    const icons = {
        'Food': 'fas fa-utensils',
        'Transportation': 'fas fa-gas-pump',
        'Shopping': 'fas fa-shopping-bag',
        'Entertainment': 'fas fa-gamepad',
        'Healthcare': 'fas fa-heartbeat',
        'Education': 'fas fa-graduation-cap',
        'Utilities': 'fas fa-bolt',
        'Salary': 'fas fa-briefcase',
        'Other': 'fas fa-receipt'
    };
    return icons[category] || 'fas fa-receipt';
}

// Logout function
function logout() {
    // Clear local storage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');

    // Redirect to login page
    window.location.href = '/login';
}

// Action button functions
function addExpense() {
    // Redirect to add expense page
    window.location.href = '/add-expense';
}

function setBudget() {
    // Placeholder for set budget functionality
    alert('Set Budget functionality will be implemented here');
    // You can redirect to a budget setting page or open a modal
    // window.location.href = '/set-budget';
}

function viewReports() {
    // Placeholder for view reports functionality
    alert('View Reports functionality will be implemented here');
    // You can redirect to a reports page
    // window.location.href = '/reports';
}

function exportData() {
    // Placeholder for export data functionality
    alert('Export Data functionality will be implemented here');
    // You can implement CSV/PDF export functionality
}

// Navigation functions
function navigateToDashboard() {
    // Already on dashboard
    console.log('Already on dashboard');
}

function navigateToExpenses() {
    // Placeholder for expenses page navigation
    alert('Expenses page will be implemented here');
    // window.location.href = '/expenses';
}

function navigateToReports() {
    // Placeholder for reports page navigation
    alert('Reports page will be implemented here');
    // window.location.href = '/reports';
}

function navigateToSettings() {
    // Placeholder for settings page navigation
    alert('Settings page will be implemented here');
    // window.location.href = '/settings';
}

// Add event listeners for navigation
document.addEventListener('DOMContentLoaded', function() {
    // Add click event listeners for navigation links
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Check if the link has a real href (not just #)
            if (this.getAttribute('href') && this.getAttribute('href') !== '#') {
                // Allow normal navigation for real links
                return;
            }

            // Only prevent default for placeholder links
            e.preventDefault();

            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));

            // Add active class to clicked link
            this.classList.add('active');

            // Handle navigation based on link text
            const linkText = this.textContent.toLowerCase();

            switch(linkText) {
                case 'dashboard':
                    navigateToDashboard();
                    break;
                case 'expenses':
                    navigateToExpenses();
                    break;
                case 'reports':
                    navigateToReports();
                    break;
                case 'settings':
                    navigateToSettings();
                    break;
            }
        });
    });
});

// Utility function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Utility function to format date
function formatDate(date) {
    const dateObj = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - dateObj);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;

    return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
}
