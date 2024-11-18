export async function fetchGithubStats(input: string) {
  const username = input.includes('github.com') 
    ? input.split('/').filter(Boolean).pop() 
    : input;

  if (!username) throw new Error('Invalid username');

  // GitHub Personal Access Token with higher rate limits
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'Authorization': 'Bearer x'
  };

  try {
    // Fetch user data and repos in parallel
    const [userResponse, reposResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers })
    ]);

    if (userResponse.status === 404) throw new Error('User not found');
    if (userResponse.status === 403) throw new Error('API rate limit exceeded. Please try again later.');
    if (!userResponse.ok) throw new Error('Failed to fetch user data');

    const userData = await userResponse.json();
    const reposData = await reposResponse.json();

    // Fetch commit counts for each repository
    const commitPromises = reposData.map(async (repo: any) => {
      try {
        // Use statistics endpoint for more accurate commit count
        const statsResponse = await fetch(
          `https://api.github.com/repos/${username}/${repo.name}/stats/contributors`,
          { headers }
        );
        
        if (!statsResponse.ok) return 0;
        
        const stats = await statsResponse.json();
        const userStats = stats.find((s: any) => s.author.login === username);
        
        return userStats ? userStats.total : 0;
      } catch {
        return 0;
      }
    });

    const commitCounts = await Promise.all(commitPromises);
    const totalCommits = commitCounts.reduce((a, b) => a + b, 0);

    // Calculate repository statistics
    const repoStats = reposData.reduce((acc: any, repo: any) => ({
      stars: acc.stars + repo.stargazers_count,
      forks: acc.forks + repo.forks_count,
      watchers: acc.watchers + repo.watchers_count,
      languages: [...acc.languages, repo.language].filter(Boolean),
      size: acc.size + repo.size,
    }), { stars: 0, forks: 0, watchers: 0, languages: [], size: 0 });

    // Get unique languages
    const languages = [...new Set(repoStats.languages)];

    return {
      username: userData.login,
      avatarUrl: userData.avatar_url,
      name: userData.name || userData.login,
      company: userData.company,
      location: userData.location,
      followers: userData.followers,
      following: userData.following,
      publicRepos: userData.public_repos,
      stars: repoStats.stars,
      forks: repoStats.forks,
      watchers: repoStats.watchers,
      totalCommits,
      languages: languages.slice(0, 3),
      totalSize: Math.round(repoStats.size / 1024),
      joinDate: new Date(userData.created_at),
      bio: userData.bio,
    };
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch GitHub stats');
  }
}