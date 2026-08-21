const ADMIN_ID = 'Gaire web';
const ADMIN_PASSWORD = '12345678';
if (sessionStorage.getItem('gaire_admin_auth') !== 'true') window.location.replace('admin-login.html');

