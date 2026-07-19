document.addEventListener(
    "DOMContentLoaded",
    initializeAdmin
);

async function initializeAdmin() {

    const profile = await getCurrentProfile();

    // No authenticated user
    if (!profile) {

        window.location.href = "index.html";

        return;

    }

    // Prevent normal users from accessing admin dashboard
    if (profile.role !== "admin") {

        window.location.href = "dashboard.html";

        return;

    }

    // Display welcome message
    document.getElementById("welcomeAdmin").textContent =
        `Welcome, ${profile.full_name}!`;

}