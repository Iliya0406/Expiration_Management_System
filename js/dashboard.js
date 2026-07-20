console.log(
    "dashboard.js loaded"
);


// ==========================================
// LOAD ADMIN STATISTICS
// ==========================================

async function loadAdminStatistics() {

    const totalUsers =
    document.getElementById("totalUsers");

    const totalItems =
        document.getElementById("totalItems");
    
    const expiredItems =
        document.getElementById("expiredItems");
    
    const totalMessages =
        document.getElementById("totalMessages");
    
    
    if (
        !totalUsers ||
        !totalItems ||
        !expiredItems ||
        !totalMessages
    ) {
    
        return;
    
    }

    console.log("loadAdminStatistics() started");


    // TOTAL USERS

    const {

        count: userCount,

        error: userError

    } = await supabaseClient

        .from("profiles")

        .select(
            "id",
            {
                count: "exact",
                head: true
            }
        )

        .eq(
            "role",
            "user"
        );

    console.log("User Count:", userCount);
    console.log("User Error:", userError);


    if (userError) {

        console.error(
            "User Statistics Error:",
            userError
        );

    }


    totalUsers.textContent =
        userCount || 0;


    // TOTAL HOUSEHOLD ITEMS

    const {

        count: itemCount,

        error: itemError

    } = await supabaseClient

        .from("household_items")

        .select(
            "id",
            {
                count: "exact",
                head: true
            }
        );
    console.log("Item Count:", itemCount);
    console.log("Item Error:", itemError);


    if (itemError) {

        console.error(
            "Item Statistics Error:",
            itemError
        );

    }


    totalItems.textContent =
        itemCount || 0;


    // EXPIRED ITEMS

    const today =
        new Date()

            .toISOString()

            .split("T")[0];


    const {

        count: expiredCount,

        error: expiredError

    } = await supabaseClient

        .from("household_items")

        .select(
            "id",
            {
                count: "exact",
                head: true
            }
        )

        .lt(
            "expiry_date",
            today
        );

    console.log("Expired Count:", expiredCount);
    console.log("Expired Error:", expiredError);


    if (expiredError) {

        console.error(
            "Expired Statistics Error:",
            expiredError
        );

    }


    expiredItems.textContent =
        expiredCount || 0;


    // TOTAL MESSAGES

    const {

        count: messageCount,

        error: messageError

    } = await supabaseClient

        .from("messages")

        .select(
            "id",
            {
                count: "exact",
                head: true
            }
        );

    console.log("Message Count:", messageCount);
    console.log("Message Error:", messageError);


    if (messageError) {

        console.error(
            "Message Statistics Error:",
            messageError
        );

    }


   totalMessages.textContent =
        messageCount || 0;


    console.log(

        "Statistics loaded successfully"

    );


}

// ==========================================
// RUN WHEN PAGE LOADS
// ==========================================

    document.addEventListener(

        "DOMContentLoaded",

        function () {

            console.log(
                "DOM loaded - loading statistics"
            );

            loadAdminStatistics();

        }

    );

