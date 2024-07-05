import { BaseAuthenticationMiddleware } from "../auth/main.js";

export class Dashboard {
    constructor() {
        this.main = new BaseAuthenticationMiddleware();
        this.logoutBtns = document.querySelectorAll("logoutBtn");
        this.updateForm = document.getElementById("updateForm");
    }

    init = async () => {
        console.log("Authenticated user")
        await this.dashboardContent()

        this.logoutBtns.forEach((btn) => {
            btn.addEventListener("click", this.main.deauthenticate);
        })

        await this.updateProfile()
    }

    prefetchDashboardData = async () => {
        // Fetch dashboard data here
        const response = await this.main.metatdata.serverCallRequest({}, "GET", "/auth/dashboard", {
            "Authorization": `Bearer ${this.main.get_access_token()}`
        })
        if (!response.user.id) {
            console.log("Not authenticated please login to proceed")
        }
        console.log(response)
        return response

    }

    dashbordMetaData = async () => {

    }

    profileUserMetaData = (data) => {
        const dateJoined = document.querySelectorAll(".date-joined")
        const profileUserName = document.querySelectorAll(".profile-user-name")
        const profileUserEmail = document.querySelectorAll(".profile-user-email")
        const verificationStatus = document.querySelectorAll(".verified")

        dateJoined.forEach(element => {
            element.textContent = this.main.metatdata.updateHero.utility.formatDate(data.user.date_joined, false);
        });

        profileUserName.forEach(element => {
            if (data.full_name) {
                element.textContent = this.main.metatdata.updateHero.utility.capitalizeSentences(data.full_name)
            }
            else {
                element.textContent = this.main.metatdata.updateHero.utility.capitalizeSentences(data.user.username)
            }
        });

        profileUserEmail.forEach(element => {
            element.textContent = data.user.email
        });

        verificationStatus.forEach(element => {
            if (data.user.verified) {
                element.innerHTML = `<i class="bi bi-patch-check-fill text-info small"></i>`;
            } else {
                element.innerHTML = ''
            }
        });

        // form update 

        if (document.querySelector("[name='first_name']")) {
            document.querySelector("[name='first_name']").value = data.first_name;
            document.querySelector("[name='last_name']").value = data.last_name;
            document.querySelector("[name='username']").value = data.user.username;
        }


        // More metadata updates can be added here
    }

    dashboardContent = async () => {
        const data = await this.prefetchDashboardData()
        this.profileUserMetaData(data)
    }

    updateProfile = async () => {

        if (!this.updateForm) {
            return;
        }
        this.updateForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const formData = validateForm(this.updateForm);
            if (formData) {
                try {
                    const response = await this.main.metatdata.serverCallRequest(formData, "POST", "/auth/profile/update", {
                        "Authorization": `Bearer ${this.main.get_access_token()}`
                    })
                    console.log({ ...response });
                    this.profileUserMetaData(response)
                } catch (error) {
                    console.error(error)
                }
            }
        })

        function validateForm(updateForm) {
            const formData = new FormData(updateForm);

            const lastName = formData.get("last_name")

            return {
                first_name: formData.get("first_name"),
                last_name: formData.get("last_name"),
                username: formData.get("username"),
                bio: formData.get("bio")
            }
        }
    }

    // More functions can be added here to handle other dashboard functionalities



}