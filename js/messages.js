// ==========================================
// MESSAGES - SUPABASE
// ==========================================


// ==========================================
// ELEMENTS
// ==========================================

const messagesDiv =
    document.getElementById("messages");

const adminMessagesDiv =
    document.getElementById("adminMessages");

const adminSendMessageBtn =
    document.getElementById(
        "adminSendMessageBtn"
    );

if (adminSendMessageBtn) {

    adminSendMessageBtn.addEventListener(

        "click",

        sendAdminMessage

    );

}

const userReplyForm =
    document.getElementById("userReplyForm");

const adminMessage =
    document.getElementById("adminMessage");


// ==========================================
// USER SENDS MESSAGE
// ==========================================

if (userReplyForm) {

    userReplyForm.addEventListener(
        "submit",
        function (e) {

            console.log(
                "User reply form submitted"
            );

            sendUserMessage(e);

        }
    );

}    

async function sendUserMessage(e) {

    e.preventDefault();

    console.log(
        "sendUserMessage() started"
    );

    const input =
        document.getElementById(
            "userReply"
        );

    const message =
        input.value.trim();

    console.log(
        "Message:",
        message
    );

    if (!message) {

        return;
    }

    await sendMessage(

        message,

        "user"

    );


    input.value = "";

}


// ==========================================
// ADMIN SENDS MESSAGE
// ==========================================

async function sendAdminMessage() {


    const message =
        adminMessage.value.trim();


    if (!message) {

        return;

    }


    await sendMessage(

        message,

        "admin"

    );


    adminMessage.value = "";

}


// ==========================================
// SEND MESSAGE TO SUPABASE
// ==========================================

async function sendMessage(

    message,

    senderRole

) {

    console.log(
        "Sending message:",
        message,
        senderRole
    );


    const {

        data: { user },

        error: userError

    } = await supabaseClient

        .auth

        .getUser();


    console.log(
        "Current User:",
        user
    );


    if (

        userError ||

        !user

    ) {

        console.error(
            "User Error:",
            userError
        );


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

            "messages"

        )

        .insert([

            {

                sender_id:

                    user.id,

                sender_role:

                    senderRole,

                message:

                    message

            }

        ])

        .select();


    console.log(
        "Insert Data:",
        data
    );


    console.log(
        "Insert Error:",
        error
    );


    if (

        error

    ) {

        console.error(

            "Send Message Error:",

            error

        );


        alert(

            "Unable to send message."

        );


        return;

    }


    console.log(

        "Message Sent Successfully"

    );

}


// ==========================================
// LOAD MESSAGES
// ==========================================

async function loadMessages() {


    const {

        data,

        error

    } = await supabaseClient

        .from(

            "messages"

        )

        .select(

            "*"

        )

        .order(

            "created_at",

            {

                ascending:

                    true

            }

        );


    if (

        error

    ) {


        console.error(

            "Load Messages Error:",

            error

        );


        return;

    }


    displayMessages(

        data

    );

}


// ==========================================
// DISPLAY MESSAGES
// ==========================================

function displayMessages(messages) {

    if (messagesDiv) {

        messagesDiv.innerHTML = "";

    }

    if (adminMessagesDiv) {

        adminMessagesDiv.innerHTML = "";

    }


    messages.forEach(message => {

        const div =
            document.createElement("div");


        div.className =
            message.sender_role === "admin"
                ? "admin-message"
                : "user-message";


        const time =
            new Date(
                message.created_at
            ).toLocaleString("en-GB");


        div.innerHTML = `

            <strong>
                ${message.sender_role}
            </strong>

            <br>

            ${message.message}

            <br>

            <small>
                ${time}
            </small>

        `;


        // USER MESSAGE DISPLAY

        if (messagesDiv) {

            messagesDiv.appendChild(
                div.cloneNode(true)
            );

        }


        // ADMIN MESSAGE DISPLAY

        if (adminMessagesDiv) {

            const adminDiv =
                div.cloneNode(true);


            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.textContent =
                "Delete";


            deleteButton.className =
                "delete-btn";


            deleteButton.style.marginTop =
                "10px";


            deleteButton.addEventListener(

                "click",

                function () {

                    deleteMessage(
                        message.id
                    );

                }

            );


            adminDiv.appendChild(
                deleteButton
            );


            adminMessagesDiv.appendChild(
                adminDiv
            );

        }

    });

}


// ==========================================
// REALTIME MESSAGE LISTENER
// ==========================================

const messagesChannel =

    supabaseClient

        .channel(

            "messages-changes"

        )

        .on(

            "postgres_changes",

            {

                event:

                    "*",

                schema:

                    "public",

                table:

                    "messages"

            },

            function (

                payload

            ) {


                console.log(

                    "Message Realtime Change:",

                    payload

                );


                loadMessages();

            }

        )

        .subscribe();




// ==========================================
// CLEAR ALL MESSAGES
// ==========================================

async function clearMessages() {


    const confirmed =

        confirm(

            "Are you sure you want to delete all messages?"

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

            "messages"

        )

        .delete()

        .neq(

            "id",

            "00000000-0000-0000-0000-000000000000"

        );


    if (

        error

    ) {


        console.error(

            "Clear Messages Error:",

            error

        );


        alert(

            "Unable to clear messages."

        );


        return;

    }


    loadMessages();

}


// ==========================================
// Delete MESSAGES
// ==========================================

async function deleteMessage(messageId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this message?"
        );


    if (!confirmed) {

        return;

    }


    const {

        error

    } = await supabaseClient

        .from("messages")

        .delete()

        .eq(
            "id",
            messageId
        );


    if (error) {

        console.error(
            "Delete Message Error:",
            error
        );


        alert(
            "You are not allowed to delete this message."
        );


        return;

    }


    console.log(
        "Message deleted successfully."
    );

}

// ==========================================
// LOAD EXISTING MESSAGES WHEN PAGE OPENS
// ==========================================
