import addUserDetailsToDb from "../db/db.js";

// We will  Fetch primary email if private 

async function fetchPrimaryEmail(accessToken) {
    const url = 'https://api.github.com/user/emails';
    const headers = {
        Authorization: `token ${accessToken}`,
        Accept: 'application/vnd.github+json',
    };

    const response = await fetch(url, { headers });
    if (!response.ok) {
        console.error(`⚡ Error fetching emails: ${response.status}`);
        return null;
    }
    const emails = await response.json();
    const primaryEmail = emails.find((email) => email.primary && email.verified);
    return primaryEmail ? primaryEmail.email : null;
}

//  Fetch GitHub user data + private email
async function get_User_DATA(accessToken) {
    const url = 'https://api.github.com/user';
    const headers = {
        Authorization: `token ${accessToken}`,
        Accept: 'application/vnd.github+json',
    };

    const response = await fetch(url, { headers });
    if (!response.ok) {
        console.error(`⚡ Error fetching user: ${response.status}`);
        return null;
    }

    const userData = await response.json();
    if (!userData.email) {
        userData.email = await fetchPrimaryEmail(accessToken);
    }
    return userData;
}

// OAuth Handler 

async function Handler(req, res) {
    try {
        const code = req.query.code;
        if (!code) return res.status(400).send("Code not provided in query.");

        const param = `?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}`;
        const tokenResponse = await fetch(`https://github.com/login/oauth/access_token${param}`, {
            method: "POST",
            headers: { Accept: "application/json" },
        });

        const data = await tokenResponse.json();
        // Access Token 

        const accessToken = data.access_token;
        if (!accessToken) {
            console.error("🔒 Access token not received from GitHub.");
            return res.status(401).send("Access token missing.");
        }
        
        // Fetch user data 

        const userData = await get_User_DATA(accessToken);
        if (!userData || !userData.email) {
            console.error(" Email not found after fetching private emails.");
            return res.status(400).send("Failed to fetch user email.");
        }

        //  Login if exists, else register

        const finalUser = await addUserDetailsToDb(
            String(userData.name),
            String(userData.email),
            String(accessToken)
        );

        console.log(`🚀 User ${finalUser.name} (${finalUser.email}) logged in/registered successfully.`);
        res.redirect(`http://localhost:5173/?name=${encodeURIComponent(finalUser.name)}&email=${encodeURIComponent(finalUser.email)}`);

    } catch (err) {
        console.error("🔥 Handler Error:", err);
        res.status(500).send("Internal Server Error.");
    }
}

export default Handler;
