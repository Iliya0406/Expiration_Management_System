/* ==========================================
   HTML ELEMENTS
========================================== */

const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");

const userSection = document.getElementById("userSection");
const adminPanel = document.getElementById("adminPanel");

const welcomeUser = document.getElementById("welcomeUser");
const welcomeAdmin = document.getElementById("welcomeAdmin");


/* ==========================================
   EVENT LISTENERS
========================================== */

if (signupForm) {
    signupForm.addEventListener("submit", signUp);
}

if (loginForm) {
    loginForm.addEventListener("submit", login);
}


/* ==========================================
   SIGN UP
========================================== */

async function signUp(e) {

    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();

    const username = document.getElementById("username").value.trim();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value;

    // Create Authentication User
    const { data, error } =
        await supabaseClient.auth.signUp({

            email,

            password

        });

    if (error) {

        alert(error.message);

        return;

    }

    // Create Profile
    const { error: insertProfileError } =
        await supabaseClient
        .from("profiles")
        .insert([

            {
                id: data.user.id,
                username: username,
                full_name: fullName,
                role: "user"
            }

        ]);

    if (insertProfileError) {

        alert(insertProfileError.message);

        return;

    }

    alert("Account created successfully.");

    window.location.href = "index.html";

}


/* ==========================================
   LOGIN
========================================== */

async function login(e) {

    e.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const { data, error } =
        await supabaseClient.auth.signInWithPassword({

            email,

            password

        });

    if (error) {

        alert(error.message);

        return;

    }

    // Get User Profile

    const {

        data: profile,

        error: profileError

    } =
    await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

    if (profileError) {

        alert(profileError.message);

        return;

    }

    showDashboard(profile);

}


/* ==========================================
   SHOW DASHBOARD
========================================== */

function showDashboard(profile){

    if(profile.role === "admin"){

        window.location.href = "admin.html";

    }

    else{

        window.location.href = "dashboard.html";

    }

}


/* ==========================================
   LOGOUT
========================================== */

async function logout() {

    await supabaseClient.auth.signOut();

    window.location.href = "index.html";

}