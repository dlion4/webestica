export class BaseAuthenticationMiddleware {
    constructor() {
        this.metatdata = new MetaDataApi();
        this.protectedPaths = [
            "/dashboard/",
        ]
    }

    get_access_token() {
        return localStorage.getItem('access_token') || null;
    }
    remove_access_refresh_token() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }
    // Check if user is logged in (access token exists)
    isLoggedIn() {
        const accessToken = localStorage.getItem('access_token');
        return accessToken !== null;
    }
    // Function to refresh access token using refresh token
    retrieveRefreshToken = async () => {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await this.metatdata.serverCallRequest({}, "GET", "/refresh_token", {
            "Authorization": `Bearer ${refreshToken}`
        })

        // if (response.ok) {
        const newTokens = await response.json();
        localStorage.setItem('access_token', newTokens.access_token);
        // Optionally update expiration time or perform other actions
        return true;

    }
    // Example usage to check login state and initiate refresh if needed
    checkLoginState = async () => {

        if (!this.isLoggedIn()) {
            console.log('User is not logged in');
            window.location.href = '/accounts/login/';
        }
        const accessToken = localStorage.getItem('access_token');
        // Example: Check if token is expired (pseudo-code, adjust as per your token structure)

        // FUNCTION to decote the acces token 
        function decodeToken(token) {
            try {
                // Assuming your token is a JWT (JSON Web Token)
                const tokenPayload = token.split('.')[1]; // Get the payload part
                const decodedPayload = atob(tokenPayload); // Decode base64
                return JSON.parse(decodedPayload); // Parse JSON
            } catch (error) {
                console.error('Error decoding token:', error);
                return null;
            }
        }
        const tokenExpireTime = decodeToken(accessToken).exp;
        const currentTime = Math.floor(Date.now() / 1000);

        console.log("token expiry: ", tokenExpireTime)
        console.log("current time: ", currentTime)

        if (tokenExpireTime < currentTime) {
            // Token expired, refresh token
            const refreshed = await this.retrieveRefreshToken();
            if (!refreshed) {
                // Handle refresh token failure, maybe redirect to login
                console.log('Refresh token failed, redirecting to login');
                window.location.href = '/accounts/login/';
            }
        }
        // Optionally, you can redirect to a login page if tokens are not valid
    }
    isPathProtected() {
        const currentPath = window.location.pathname;
        return this.protectedPaths.some(path => currentPath.startsWith(path));
    }

    deauthenticate = async () => {
        try {
            const response = await this.metatdata.serverCallRequest({}, "GET", "/auth/logout", {
                "Authorization": `Bearer ${this.get_access_token()}`,
            });
            this.remove_access_refresh_token()
            console.log({ ...response });
            // Redirect to login page
            window.location.href = "/accounts/login/";
        } catch (error) {
            console.error(error);
            alert("Logout failed. Please try again.");
        }
    }
}

