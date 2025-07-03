import { useEffect } from 'react';

const ImpersonateLogin = () => {
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const email = urlParams.get('email');
        const role = urlParams.get('role');
        const firstname = urlParams.get('firstname');
        const lastname = urlParams.get('lastname');

        if (token) {
            // Save impersonation token and user info
            localStorage.setItem('admintoken', token);
            localStorage.setItem('email', email);
            localStorage.setItem('role', role);
            localStorage.setItem('firstname', firstname);
            localStorage.setItem('lastname', lastname);

            // Optionally: trigger a global state load using a custom flag or event (see below)
            // Or force full reload to allow Redux to pick up from localStorage
            window.location.href = '/dashboard';
        } else {
            alert('Invalid impersonation token.');
        }
    }, []);

    return <div>Logging you in as Admin...</div>;
};

export default ImpersonateLogin;
