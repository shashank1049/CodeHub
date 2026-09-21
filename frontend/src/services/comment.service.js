import api from "./api";

const getProjectComments = async (projectId) => {
    const response = await api.get(
        `/comments/project/${projectId}`
    );

    return response.data;
};

const createComment = async (projectId, content) => {
    const response = await api.post(
        `/comments/project/${projectId}`,
        { content }
    );

    return response.data;
};

const updateComment = async (commentId, content) => {
    const response = await api.patch(
        `/comments/${commentId}`,
        { content }
    );

    return response.data;
};

const deleteComment = async (commentId) => {
    const response = await api.delete(
        `/comments/${commentId}`
    );

    return response.data;
};

export {
    getProjectComments,
    createComment,
    updateComment,
    deleteComment,
};