

function alertMessage() {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      // Perform the delete action here
      Swal.fire(
        'Deleted!',
        'Your file has been deleted.',
        'success'
      );
    }
  });
}

  // event.preventDefault()
// Swal.fire({
//     title: 'Are you sure?',
//     icon: 'warning',
//     showCancelButton: true,
//     confirmButtonColor: '#3085d6',
//     cancelButtonColor: '#d33',
//     confirmButtonText: 'Yes, change it!'
//   }).then((result) => {
//     if (result.isConfirmed) {
//       Swal.fire(
//         'changed!',
//         'Your file has been changed.',
//         'success'
//       )
//     }
//   })
