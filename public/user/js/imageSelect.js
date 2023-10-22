document.addEventListener("DOMContentLoaded", function () {
    const smallImages = document.querySelectorAll(".small-image");
    const largeImage = document.querySelector(".large-image");

    // Add click event listeners to each small image
    smallImages.forEach(function (smallImg) {
        smallImg.addEventListener("click", function () {
            // Set the large image source to the clicked small image source
            const smallImageSrc = smallImg.getAttribute("src");
            largeImage.setAttribute("src", smallImageSrc);
        });
    });
});