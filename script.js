function previewImage(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('imagePreview');
    const predictBtn = document.getElementById('predictBtn');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Uploaded Image">`;
            predictBtn.disabled = false; // Enable predict button
        };
        reader.readAsDataURL(file);
    } else {
        preview.innerHTML = '';
        predictBtn.disabled = true;
    }
}

function predictImage() {
    const imageFile = document.getElementById('imageUpload').files[0];
    const resultDiv = document.getElementById('result');
    const container = document.querySelector('.container');
    const uploadBtn = document.querySelector('.upload-btn');
    const predictBtn = document.getElementById('predictBtn');
    const headerTitle = document.querySelector('header h1'); // Select the header title
    
    if (!imageFile) {
        resultDiv.innerHTML = "❌ Please upload an image first!";
        return;
    }

    resultDiv.innerHTML = "⏳ Predicting...";

    const formData = new FormData();
    formData.append('file', imageFile);

    fetch('/predict', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Server Error: ${response.status} - ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            throw new Error(data.error);
        }
        const prediction = data.prediction;
        resultDiv.innerHTML = `<h3>🧐 Prediction: ${prediction}</h3>`;

        // Update background, container theme, button styles, and header color based on prediction
        if (prediction === "Fake") {
            document.body.style.backgroundImage = "url('/static/red_1.jpeg')";
            container.classList.remove('theme-green', 'theme-default');
            container.classList.add('theme-red');
            // Change upload button to yellow with black text
            uploadBtn.style.background = "#FFFF00"; // Yellow
            uploadBtn.style.color = "#000000"; // Black
            // Reset predict button to default styles (yellow when enabled)
            predictBtn.style.background = "";
            predictBtn.style.color = "";
            // Change header to yellow
            headerTitle.style.color = "#FFFF00"; // Yellow
        } else if (prediction === "Real") {
            document.body.style.backgroundImage = "url('/static/dark_green_6.jpeg')";
            container.classList.remove('theme-red', 'theme-default');
            container.classList.add('theme-green');
            // Change upload button to dark green with white text
            uploadBtn.style.background = "#00320ae4"; // Dark Green
            uploadBtn.style.color = "#FFFFFF"; // White
            // Change predict button to dark green with white text
            predictBtn.style.background = "#00320ae4"; // Dark Green
            predictBtn.style.color = "#FFFFFF"; // White
            // Change header to white
            headerTitle.style.color = "#FFFFFF"; // White
        }
    })
    .catch(error => {
        resultDiv.innerHTML = `❌ Error: ${error.message}`;
        console.error('Prediction Error:', error);
    });
}