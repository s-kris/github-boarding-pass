import type { APIRoute } from 'astro';

const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN;

export const GET: APIRoute = async ({ url }) => {
  const username = url.searchParams.get('username');

  if (!username) {
    return new Response('Username is required', { status: 400 });
  }

  const cleanUsername = username.includes('github.com')
    ? username.split('/').filter(Boolean).pop()
    : username;

  if (!cleanUsername) {
    return new Response('Invalid username', { status: 400 });
  }

  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'Authorization': `Bearer ${GITHUB_TOKEN}`
  };

  console.log('Token exists:', !!GITHUB_TOKEN);
  console.log('Token prefix:', GITHUB_TOKEN?.substring(0, 4));

  try {
    const [userResponse, reposResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${cleanUsername}`, { headers }),
      fetch(`https://api.github.com/users/${cleanUsername}/repos?per_page=100&sort=updated`, { headers })
    ]);

    if (userResponse.status === 404) {
      return new Response('User not found', { status: 404 });
    }
    if (userResponse.status === 403) {
      return new Response('API rate limit exceeded. Please try again later.', { status: 403 });
    }
    if (!userResponse.ok) {
      const errorData = await userResponse.json().catch(() => ({}));
      console.error('GitHub API Error:', {
        status: userResponse.status,
        statusText: userResponse.statusText,
        headers: Object.fromEntries(userResponse.headers),
        error: errorData
      });
      return new Response(`Failed to fetch user data: ${userResponse.statusText}`, {
        status: userResponse.status || 500
      });
    }

    const userData = await userResponse.json();
    const reposData = await reposResponse.json();

    // Fetch commit counts for each repository
    const commitPromises = reposData.map(async (repo: any) => {
      try {
        const statsResponse = await fetch(
          `https://api.github.com/repos/${cleanUsername}/${repo.name}/stats/contributors`,
          { headers }
        );

        if (!statsResponse.ok) return 0;

        const stats = await statsResponse.json();
        const userStats = stats.find((s: any) => s.author.login === cleanUsername);

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

    const stats = {
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
      joinDate: userData.created_at,
      bio: userData.bio,
    };

    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    return new Response('Failed to fetch GitHub stats', { status: 500 });
  }
}