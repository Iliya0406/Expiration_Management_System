async function getCurrentProfile() {

    // Get authenticated user
    const {
        data: { user },
        error
    } = await supabaseClient.auth.getUser();

    if (error || !user) {

        return null;

    }

    // Load profile
    const {
        data: profile,
        error: profileError
    } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (profileError) {

        return null;

    }

    return profile;

}