document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
  
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
  
    var data = {
      username: username,
      password: password
    };
  
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(function(response) {
      if (response.ok) {
        document.getElementById('message').textContent = 'Login successful.';
      } else {
        document.getElementById('message').textContent = 'Invalid username or password.';
      }
    })
    .catch(function(error) {
      console.error('Error:', error);
      document.getElementById('message').textContent = 'An error occurred. Please try again later.';
    });
  });
  