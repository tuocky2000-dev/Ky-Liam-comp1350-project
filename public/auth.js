async function initializeAuth() {
    await Clerk.load();
    const authState = document.getElementById('auth-state');

    if (Clerk.user) {
        authState.innerHTML = `
      <span>Welcome, ${Clerk.user.fullName || Clerk.user.primaryEmailAddress.emailAddress}</span> | 
      <a href="/api/auth/protected" target="_blank">Protected Route</a> | 
      <button id="sign-out-btn">Sign Out</button>
    `;
        document.getElementById('sign-out-btn').addEventListener('click', () => {
            Clerk.signOut().then(() => window.location.reload());
        });
    } else {
        authState.innerHTML = `
      <button id="sign-in-btn" class="login-btn">Sign In</button>
    `;
        document.getElementById('sign-in-btn').addEventListener('click', () => {
            Clerk.redirectToSignIn();
        });
    }
}

window.addEventListener('load', initializeAuth);