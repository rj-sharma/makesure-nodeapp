$(document).ready(() => {
  $('.delete-sorted').on('click', (e) => {
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type:'DELETE',
      url: '/sorted/delete/'+id,
      success: (response) => {
        alert(`You no longer need this, right?
        Make sure!`);
        window.location.href='/';
      },
      error: (error) => {
        console.log(error);
      }
    });
  });
});
