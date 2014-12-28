requirejs.config({
    "baseUrl": "js/lib",
    "paths": {
      "app": "../app",
      "jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min"
    }
});

// Load the main app module to start the app
requirejs(["app/script"]);