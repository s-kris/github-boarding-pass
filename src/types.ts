export interface GithubStats {
  username: string;
  avatarUrl: string;
  name: string;
  company?: string;
  location?: string;
  followers: number;
  following: number;
  publicRepos: number;
  stars: number;
  forks: number;
  watchers: number;
  totalCommits: number;
  languages: string[];
  totalSize: number;
  joinDate: Date;
  bio?: string;
}