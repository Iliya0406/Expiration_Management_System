// ==========================================
// HOUSEHOLD ITEMS - SUPABASE
// ==========================================


// ==========================================
// ADD ITEM
// ==========================================

const foodForm =
    document.getElementById("foodForm");

if (foodForm) {

    foodForm.addEventListener(
        "submit",
        addHouseholdItem
    );

}


// ==========================================
// CLEAR ALL ITEMS BUTTON
// ==========================================

const clearFoodItemsBtn =
    document.getElementById(
        "clearFoodItemsBtn"
    );

if (clearFoodItemsBtn) {

    clearFoodItemsBtn.addEventListener(
        "click",
        clearFoodItems
    );

}


// ==========================================
// ADD HOUSEHOLD ITEM
// ==========================================

async function addHouseholdItem(e) {

    e.preventDefault();


    const category =
        document.getElementById(
            "category"
        ).value;


    const itemName =
        document.getElementById(
            "itemName"
        ).value.trim();


    const expiryDate =
        document.getElementById(
            "expiryDate"
        ).value;


    const {

        data: { user },

        error: userError

    } = await supabaseClient
        .auth
        .getUser();


    if (userError || !user) {

        alert(
            "You must be logged in."
        );

        return;

    }


    const {

        data,

        error

    } = await supabaseClient

        .from(
            "household_items"
        )

        .insert([

            {

                user_id:
                    user.id,

                category:
                    category,

                item_name:
                    itemName,

                expiry_date:
                    expiryDate

            }

        ])

        .select();


    if (error) {

        console.error(
            "Add Item Error:",
            error
        );


        alert(
            "Unable to add household item."
        );


        return;

    }


    console.log(
        "Item Added:",
        data
    );


    alert(
        "Household item added successfully!"
    );


    foodForm.reset();


    // Reload list
    loadHouseholdItems();

}


// ==========================================
// LOAD ITEMS
// ==========================================

async function loadHouseholdItems() {


    const {

        data: { user },

        error: userError

    } = await supabaseClient
        .auth
        .getUser();


    if (userError || !user) {

        console.error(
            "User Error:",
            userError
        );


        return;

    }


    const {

        data: items,

        error

    } = await supabaseClient

        .from(
            "household_items"
        )

        .select("*")

        .eq(
            "user_id",
            user.id
        )

        .order(

            "expiry_date",

            {

                ascending:
                    true

            }

        );


    if (error) {

        console.error(
            "Load Items Error:",
            error
        );


        return;

    }


    console.log(
        "Household Items:",
        items
    );


    displayHouseholdItems(
        items
    );

}


// ==========================================
// DISPLAY ITEMS
// ==========================================

function displayHouseholdItems(
    items
) {


    const foodList =
        document.getElementById(
            "foodList"
        );


    if (!foodList) {

        return;

    }


    foodList.innerHTML =
        "";


    items.forEach(

        item => {


            const li =
                document.createElement(
                    "li"
                );


            const {

                statusText,

                statusClass

            } = calculateExpiryStatus(

                item.expiry_date

            );


            li.classList.add(
                statusClass
            );


            const formattedDate =

                new Date(

                    item.expiry_date

                )

                .toLocaleDateString(

                    "en-GB",

                    {

                        day:
                            "numeric",

                        month:
                            "long",

                        year:
                            "numeric"

                    }

                );


            li.innerHTML = `

                <div class="item-card">

                    <div class="status-badge ${statusClass}">

                        ${statusText}

                    </div>


                    <div class="item-row">

                        <span class="label">

                            📂 Category

                        </span>


                        <span>

                            ${item.category}

                        </span>

                    </div>


                    <div class="item-row">

                        <span class="label">

                            📦 Item

                        </span>


                        <span>

                            ${item.item_name}

                        </span>

                    </div>


                    <div class="item-row">

                        <span class="label">

                            📅 Expiry Date

                        </span>


                        <span>

                            ${formattedDate}

                        </span>

                    </div>

                </div>

            `;


            const deleteButton =

                document.createElement(

                    "button"

                );


            deleteButton.textContent =
                "Delete";


            deleteButton.className =
                "delete-btn";


            deleteButton.style.marginTop =
                "15px";


            deleteButton.addEventListener(

                "click",

                function () {

                    deleteHouseholdItem(

                        item.id

                    );

                }

            );


            li.appendChild(
                deleteButton
            );


            foodList.appendChild(
                li
            );

        }

    );

}


// ==========================================
// CALCULATE EXPIRY STATUS
// ==========================================

function calculateExpiryStatus(

    expiryDate

) {


    const today =
        new Date();


    today.setHours(

        0,

        0,

        0,

        0

    );


    const expiry =
        new Date(

            expiryDate

        );


    expiry.setHours(

        0,

        0,

        0,

        0

    );


    const diff =

        Math.ceil(

            (

                expiry -
                today

            )

            /

            (

                1000 *
                60 *
                60 *
                24

            )

        );


    let statusText;

    let statusClass;


    if (

        diff < 0

    ) {


        statusText =
            "🔴 EXPIRED";


        statusClass =
            "expired";

    }


    else if (

        diff <= 3

    ) {


        statusText =
            "🟡 EXPIRING SOON";


        statusClass =
            "warning";

    }


    else {


        statusText =
            "🟢 SAFE";


        statusClass =
            "safe";

    }


    return {

        statusText,

        statusClass

    };

}


// ==========================================
// DELETE ONE ITEM
// ==========================================

async function deleteHouseholdItem(

    itemId

) {


    const confirmed =

        confirm(

            "Are you sure you want to delete this item?"

        );


    if (

        !confirmed

    ) {

        return;

    }


    const {

        error

    } = await supabaseClient

        .from(

            "household_items"

        )

        .delete()

        .eq(

            "id",

            itemId

        );


    if (

        error

    ) {


        console.error(

            "Delete Item Error:",

            error

        );


        alert(

            "Unable to delete household item."

        );


        return;

    }


    console.log(

        "Item deleted successfully."

    );


    loadHouseholdItems();

}


// ==========================================
// CLEAR ALL ITEMS
// ==========================================

async function clearFoodItems() {


    const confirmed =

        confirm(

            "Are you sure you want to delete all your household items?"

        );


    if (

        !confirmed

    ) {

        return;

    }


    const {

        data: { user },

        error: userError

    } = await supabaseClient
        .auth
        .getUser();


    if (

        userError ||
        !user

    ) {


        alert(

            "You must be logged in."

        );


        return;

    }


    const {

        error

    } = await supabaseClient

        .from(

            "household_items"

        )

        .delete()

        .eq(

            "user_id",

            user.id

        );


    if (

        error

    ) {


        console.error(

            "Clear Items Error:",

            error

        );


        alert(

            "Unable to clear household items."

        );


        return;

    }


    console.log(

        "All household items deleted."

    );


    loadHouseholdItems();

}


// ==========================================
// LOAD ITEMS WHEN PAGE OPENS
// ==========================================

document.addEventListener(

    "DOMContentLoaded",

    loadHouseholdItems

);



// ==========================================
// REALTIME LISTENER
// ==========================================

const householdChannel =
    supabaseClient

        .channel(
            "household-items-changes"
        )

        .on(

            "postgres_changes",

            {

                event: "*",

                schema: "public",

                table: "household_items"

            },

            function (payload) {

                console.log(
                    "Realtime Change:",
                    payload
                );


                loadHouseholdItems();

            }

        )

        .subscribe();