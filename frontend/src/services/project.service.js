import api from "./api";

const createProject = async (projectData) => {
    const response = await api.post(
        "/projects",
        projectData
    );

    return response.data;
};

const getProjects = async (params = {}) => {
    const response = await api.get("/projects", {
        params,
    });

    return response.data;
};

const getProjectById = async (projectId) => {
    const response = await api.get(
        `/projects/${projectId}`
    );

    return response.data;
};

export {
    createProject,
    getProjects,
    getProjectById,
};