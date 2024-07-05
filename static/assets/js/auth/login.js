import { BaseAuthenticationMiddleware } from "./main.js";
import { Dashboard } from "../dashboard/main.js"

class Authentication {
    constructor() {
        this.main = new BaseAuthenticationMiddleware();
        this.dashboard = new Dashboard();
        this.loginForm = document.getElementById("loginForm");

        this.formState = {
            isLoading: {
                state: "loading",
                message: "Loading...",
                el: document.getElementById("login-loading"),
            }
        }
    }
    async init() {

        if (this.main.isPathProtected()) {
            await this.main.checkLoginState();
            await this.dashboard.init();
        }
        if (window.location.pathname.startsWith("/accounts/login/")) {
            await this.authenticate(this.loginForm);

        }
    }
    async authenticate(form) {

        const validateForm = (form) => {
            // Validate form data
            const formData = new FormData(form);
            const email = formData.get("email");
            const password = formData.get("password");

            if (email === "" || password === "") {
                alert("Please fill out all fields");
                return false;
            }
            // Additional validation logic
            if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
                alert("Please enter a valid email address");
                return false;
            }
            return {
                email, password
            };

        }
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const formData = validateForm(form);
            if (formData) {
                try {
                    const response = await this.main.metatdata.serverCallRequest(formData, "POST", "/auth/login");
                    console.log({ ...response });
                    // Redirect to home page or dashboard
                    // window.location.href = "/dashboard";
                    storeTheAccessAndResfreshToken(response) // store the refresh and token access token for the future registration  

                    if (response.access_token) {
                        // Redirect to home page or dashboard
                        window.location.href = "/dashboard";
                    }

                } catch (error) {
                    console.error(error);
                    alert("Login failed. Please try again.");
                }
            }
        })

        function storeTheAccessAndResfreshToken(data) {
            // Store access and refresh tokens
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            // Refresh token every 30 minutes
        }
    }
}



const authenticate = new Authentication()

authenticate.init()
