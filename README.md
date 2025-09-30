# Learn How to API

A hands-on repository for learning and practicing how to use APIs in web development. This project includes example code and structured assets to help you understand API concepts, make calls from the frontend, and integrate data into a modern web application.

## Overview

This repository is designed to help beginners and intermediate developers learn how to:
- Use JavaScript to make API requests (fetch, async/await, error handling)
- Style API responses using SCSS and CSS
- Organize a project for API-centric workflows
- Build simple UI with HTML to display API data

## Technologies Used

- **JavaScript** (32.5%): For making API calls and manipulating responses
- **SCSS** (35.4%): Powerful, modular styling for UI/UX
- **CSS** (27.6%): Compiled from SCSS for production-ready styles
- **HTML** (4.5%): Markup for structuring the web app

## Project Structure

```
├── index.html             # Main HTML file
├── assets/
│   ├── css/               # Compiled CSS files
│   └── js/
│       └── main.js        # Main JavaScript file with API logic
├── scss/
│   └── main.scss          # SCSS source file for custom styles
├── LICENSE
└── README.md
```

## Getting Started

1. **Clone the repository**
   ```sh
   git clone https://github.com/BeastTheNinja/Learn_How_to_API.git
   ```
2. **Open `index.html` in your browser**  
   Start exploring the code and see how API calls work.
3. **Edit and Experiment**  
   Try modifying `main.js` to use different APIs or update the UI.
4. **Compile SCSS if you make style changes**  
   Use a tool like `sass` to compile `scss/main.scss` to `assets/css/main.css`.

## Example: Making an API Call

Here’s a simple example using JavaScript’s `fetch` to get data from a public API:

```js
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => {
    // Do something with the data
    console.log(data);
  })
  .catch(error => console.error('Error:', error));
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
