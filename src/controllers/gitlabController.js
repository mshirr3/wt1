export const getProfile = async (req, res) => {
    const token = req.session.accessToken
    if (!token) return res.status(401).send('Not logged in')
    
    try {
      const response = await fetch(`${process.env.GITLAB_BASE_URL}/api/v4/user`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error(`Gitlab API error: ${response.status}`)

      const profile = await response.json()
      console.log(profile)
      res.render('profile', { profile })
    } catch (err) {
        console.error('Profile fetch failed', err)
        res.status(500).send('failed to fetch profile')
    }
}

export const getActivities = async (req, res) => {
    const token = req.session.accessToken
    if (!token) return res.status(401).send('not logged in')
    
    try {
        const response = await fetch(`${process.env.GITLAB_BASE_URL}/api/v4/events?per_page=101`, {
           headers: { 'Authorization': `Bearer ${token}` }
        })

        if (!response.ok) throw new Error(`Gitlab api error: ${response.status}`)

        const activities = await response.json()
        res.render('activities', { activities })
    } catch (err) {
        console.error('activities fetch failed', err)
        res.status(500).send('failed to fetch activities')
    }
}