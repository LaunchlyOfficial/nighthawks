// Navigation state management
const NAV_ITEMS = {
    'super_admin': [
        { path: '/admin-dashboard.html', label: 'Dashboard' },
        { path: '/reports.html', label: 'Reports' },
        { path: '/applications.html', label: 'Applications' },
        { path: '/permissions.html', label: 'Permissions' },
        { path: '/admin-management.html', label: 'Admins' }
    ],
    'admin': [
        { path: '/admin-dashboard.html', label: 'Dashboard' },
        { path: '/reports.html', label: 'Reports' },
        { path: '/applications.html', label: 'Applications' },
        { path: '/permissions.html', label: 'Permissions' }
    ],
    'analyst': [
        { path: '/reports.html', label: 'Reports' },
        { path: '/applications.html', label: 'Applications' }
    ]
};

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
}

function getCurrentUserRole() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role;
    } catch (e) {
        console.error('Error parsing token:', e);
        return null;
    }
}

function renderNavigation() {
    const role = getCurrentUserRole();
    if (!role) return;

    const navItems = NAV_ITEMS[role] || [];
    const currentPath = window.location.pathname;

    const navHtml = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand" href="/">NightHawk</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    ${navItems.map(item => `
                        <li class="nav-item">
                            <a class="nav-link ${currentPath === item.path ? 'active' : ''}" 
                               href="${item.path}">
                                ${item.label}
                            </a>
                        </li>
                    `).join('')}
                </ul>
                <div class="navbar-nav">
                    <span class="nav-item nav-link text-light me-3">
                        Role: ${role.replace('_', ' ').toUpperCase()}
                    </span>
                    <button class="btn btn-outline-light" onclick="logout()">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    </nav>`;

    // Insert navigation at the start of the body
    document.body.insertAdjacentHTML('afterbegin', navHtml);
}

// Initialize Bootstrap's JavaScript components
document.addEventListener('DOMContentLoaded', () => {
    renderNavigation();
}); 