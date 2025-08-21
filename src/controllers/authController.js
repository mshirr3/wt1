import dotenv from'dotenv'

dotenv.config()

// redirect to gitlabs OAuth screen
export const login = (req, res) => {
    const gitlabAuthUrl = `${process.env.GITLAB_BASE_URL}/oauth/authorize` +
    `?client_id=${process.env.GITLAB_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(process.env.GITLAB_REDIRECT_URI)}` +
    `&response_type=code` +
    `&scope=read_user read_api`

    res.redirect(gitlabAuthUrl)
}

// called by gitlab through the uri i registred
export const callback = async (req, res) => {
    const { code } = req.query

    if (!code) {
        return res.status(400).send("Authorization code not provided")
    }

    try {
        const response = await fetch(`${process.env.GITLAB_BASE_URL}/oauth/token`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: process.env.GITLAB_CLIENT_ID,
            client_secret: process.env.GITLAB_CLIENT_SECRET,
            code,
            grant_type: "authorization_code",
            redirect_uri: process.env.GITLAB_REDIRECT_URI
          })
        })

        const tokenData = await response.json()

        if (tokenData.error) {
            return res.status(400).send(`Error:${tokenData.error_description}`)
        }

        // save token in session for later gitlab api calls
        req.session.accessToken = tokenData.access_token

        res.send(`Access token received and stored in session: ${tokenData.access_token}`)
    } catch (error) {
        console.error('Token exchange failed', error)
        res.status(500).send('Failed to exchange code for token')
    }
}