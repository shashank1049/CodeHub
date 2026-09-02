import { ApiError } from "../utils/ApiError.js";

import {
    getCache,
    setCache,
} from "./cache.service.js";


// Get GitHub repositories
const getGithubRepositories = async (
    username,
    page = 1,
    limit = 10
) => {
    try {
        const pageNumber = Math.max(
            parseInt(page, 10) || 1,
            1
        );

        const limitNumber = Math.min(
            Math.max(parseInt(limit, 10) || 10, 1),
            100
        );

        const cacheKey =
            `github:repos:${username}:${pageNumber}:${limitNumber}`;

        // Check cache
        const cachedRepositories = getCache(cacheKey);

        if (cachedRepositories) {
            return cachedRepositories;
        }

        // Check GitHub token
        if (!process.env.GITHUB_TOKEN) {
            throw new ApiError(
                500,
                "GitHub token is not configured"
            );
        }

        const response = await fetch(
            `https://api.github.com/users/${username}/repos?sort=updated&page=${pageNumber}&per_page=${limitNumber}`,
            {
                headers: {
                    Accept: "application/vnd.github+json",
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    "User-Agent": "CodeHub",
                },
            }
        );

        if (response.status === 404) {
            throw new ApiError(
                404,
                "GitHub user not found"
            );
        }

        if (response.status === 401) {
            throw new ApiError(
                401,
                "GitHub authentication failed"
            );
        }

        if (response.status === 403) {
            throw new ApiError(
                429,
                "GitHub API rate limit exceeded"
            );
        }

        if (!response.ok) {
            throw new ApiError(
                502,
                "GitHub service is currently unavailable"
            );
        }

        const repositories = await response.json();

        const result = {
            repositories: repositories.map((repo) => ({
                id: repo.id,
                name: repo.name,
                description: repo.description,
                htmlUrl: repo.html_url,
                language: repo.language,
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                updatedAt: repo.updated_at,
            })),

            pagination: {
                currentPage: pageNumber,
                limit: limitNumber,
                hasNextPage:
                    repositories.length === limitNumber,
                hasPreviousPage:
                    pageNumber > 1,
            },
        };

        // Store result in cache
        setCache(cacheKey, result);

        return result;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        throw new ApiError(
            502,
            "Unable to connect to GitHub"
        );
    }
};


// Get single GitHub repository
const getGithubRepository = async (
    username,
    repoName
) => {
    try {
        const cacheKey =
            `github:repo:${username}:${repoName}`;

        // Check cache
        const cachedRepository = getCache(cacheKey);

        if (cachedRepository) {
            return cachedRepository;
        }

        // Check GitHub token
        if (!process.env.GITHUB_TOKEN) {
            throw new ApiError(
                500,
                "GitHub token is not configured"
            );
        }

        const response = await fetch(
            `https://api.github.com/repos/${username}/${repoName}`,
            {
                headers: {
                    Accept: "application/vnd.github+json",
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    "User-Agent": "CodeHub",
                },
            }
        );

        if (response.status === 404) {
            throw new ApiError(
                404,
                "GitHub repository not found"
            );
        }

        if (response.status === 401) {
            throw new ApiError(
                401,
                "GitHub authentication failed"
            );
        }

        if (response.status === 403) {
            throw new ApiError(
                429,
                "GitHub API rate limit exceeded"
            );
        }

        if (!response.ok) {
            throw new ApiError(
                502,
                "GitHub service is currently unavailable"
            );
        }

        const repo = await response.json();

        const result = {
            id: repo.id,
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description,
            htmlUrl: repo.html_url,
            language: repo.language,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            watchers: repo.watchers_count,
            openIssues: repo.open_issues_count,
            defaultBranch: repo.default_branch,
            topics: repo.topics || [],
            isPrivate: repo.private,
            createdAt: repo.created_at,
            updatedAt: repo.updated_at,
            pushedAt: repo.pushed_at,
        };

        // Store result in cache
        setCache(cacheKey, result);

        return result;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        throw new ApiError(
            502,
            "Unable to connect to GitHub"
        );
    }
};


export {
    getGithubRepositories,
    getGithubRepository,
};