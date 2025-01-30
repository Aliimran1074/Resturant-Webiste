document.getElementById("uploadBtn").addEventListener("click", () => {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file to upload.");
        return;
    }

    const cloudName = "dfs2ngeah"; // Your Cloudinary cloud name
    const unsignedPreset = "my_unsigned_preset"; // Replace with your actual preset name

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", unsignedPreset);

    document.getElementById("status").innerText = "Uploading...";

    fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                console.error("Cloudinary error response:", err);
                throw new Error(err.error.message);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log("Cloudinary response:", data);
        document.getElementById("status").innerText = "Upload successful!";
        document.getElementById("uploadedImage").src = data.secure_url;
        document.getElementById("uploadedImage").style.display = "block";
    })
    .catch(error => {
        console.error("Error uploading image:", error);
        document.getElementById("status").innerText = "Upload failed: " + error.message;
    });
});
