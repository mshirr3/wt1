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

export const getLimitedGroupsAndProjects = async (req, res) => {
  const token = req.session.accessToken
  if (!token) return res.status(401).send("Not logged in")

  try {
    // fetch at most 3 groups
    const groupResp = await fetch(
      `${process.env.GITLAB_BASE_URL}/api/v4/groups?per_page=3`, 
      { headers: { "Authorization": `Bearer ${token}` } }
    )
    const groups = await groupResp.json()

    // check if user has more groups than returned
    const totalGroups = groupResp.headers.get("x-total")
    const hasMoreGroups = totalGroups > groups.length

    const groupData = await Promise.all(groups.map(async group => {
      // fetch at most 5 projects, include subgroups
      const projResp = await fetch(
        `${process.env.GITLAB_BASE_URL}/api/v4/groups/${group.id}/projects?per_page=5&include_subgroups=true`,
        { headers: { "Authorization": `Bearer ${token}` } }
      )
      const projects = await projResp.json()

      // check if group has more projects
      const totalProjects = projResp.headers.get("x-total")
      const hasMoreProjects = totalProjects > projects.length

      const projectsWithCommits = await Promise.all(projects.map(async project => {
        const commitResp = await fetch(
          `${process.env.GITLAB_BASE_URL}/api/v4/projects/${project.id}/repository/commits?per_page=1`,
          { headers: { "Authorization": `Bearer ${token}` } }
        )
        const commits = await commitResp.json()
        const latest = commits[0] || null

        return {
          ...project,
          latestCommit: latest ? {
            date: latest.created_at,
            authorName: latest.author_name,
            authorUsername: latest.author_email, // GitLab sometimes returns email instead of username
            authorAvatar: latest.author_avatar_url || null
          } : null
        }  
      }))

      return {
        ...group,
        hasMoreProjects,
        projects: projectsWithCommits
      }
    }))

    res.render("groupsLimited", { groups: groupData, hasMoreGroups })
  } catch (err) {
    console.error("Groups/projects fetch failed", err)
    res.status(500).send("Failed to fetch limited groups and projects")
  }
}
