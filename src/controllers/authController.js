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
export const callback = (req, res) => {
    const { code } = req.query

    if (!code) {
        return res.status(400).send("Authorization code not provided")
    }

    res.send(`got authorization code:${code}`)
}