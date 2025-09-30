// Main JavaScript file for Template Boilerplate
console.log('Template Boilerplate loaded successfully!');

// Example: DOM Content Loaded event
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM is fully loaded and parsed');
    
    // Example: Add some basic interactivity
    const header = document.querySelector('h1');
    if (header) {
        header.addEventListener('click', function() {
            header.style.color = header.style.color === 'blue' ? 'black' : 'blue';
        });
    }
});

// Example: Basic utility functions
const Utils = {
    // Get element by ID
    getId: function(id) {
        return document.getElementById(id);
    },
    
    // Get elements by class name
    getClass: function(className) {
        return document.getElementsByClassName(className);
    },
    
    // Simple log function
    log: function(message) {
        console.log('[Template Boilerplate]:', message);
    }
};

// Export Utils for use in other scripts
window.Utils = Utils;