function sendMail(e) {
    e.preventDefault();
    emailjs.sendForm('service_r8lj3qs','template_srli6yp','#enquiryForm').then(
      (response) => {
        console.log('SUCCESS!', response.status, response.text);
        Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Enquiry Raised',
        });
        document.getElementById("enquiryForm").reset();
      },
      (error) => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
        });
      },
    );
    return false;
}