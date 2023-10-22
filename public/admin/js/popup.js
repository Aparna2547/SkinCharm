document.addEventListener('click', function (event) {
    if (event.target.classList.contains('showpopup')) {
      const button = event.target;
  
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      });
  
      swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          // You can use button.getAttribute('href') to get the URL to block/unblock the user
          const userActionUrl = button.getAttribute('href');
  
          // Handle the user action (e.g., send an AJAX request to the server)
          // You can use fetch or another method to perform the action
          // ...
  
          // You can also update the button text or style if the action is successful
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // User canceled, do nothing
        }
      });
    }
  });
  