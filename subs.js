document.addEventListener("DOMContentLoaded", function () {
    const subscribeButton = document.querySelector(".button .btn:first-child");
    const modal = document.getElementById("subscriptionModal");
    const closeModalButton = document.getElementById("closeModal");
  
    // Open modal
    subscribeButton.addEventListener("click", function () {
      modal.style.display = "block";
    });
  
    // Close modal
    closeModalButton.addEventListener("click", function () {
      modal.style.display = "none";
    });
  
    // Close when clicking outside the modal content
    window.addEventListener("click", function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  });
  