import { createContext, useContext, useState, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/projects');
      setProjects(res.data.projects);
    } catch (err) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProject = useCallback(async (id) => {
    setLoading(true);
    try {
      const res = await api.get(`/projects/${id}`);
      setCurrentProject(res.data.project);
      return res.data.project;
    } catch (err) {
      toast.error('Failed to load project details');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = async (data) => {
    try {
      const res = await api.post('/projects', data);
      setProjects(prev => [res.data.project, ...prev]);
      toast.success('Feedback form created successfully');
      return res.data.project;
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create project');
      throw err;
    }
  };

  const updateProject = async (id, data) => {
    try {
      const res = await api.put(`/projects/${id}`, data);
      setProjects(prev => prev.map(p => p._id === id ? res.data.project : p));
      if (currentProject?._id === id) {
        setCurrentProject(res.data.project);
      }
      toast.success('Project updated');
      return res.data.project;
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update project');
      throw err;
    }
  };

  const deleteProject = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      setProjects(prev => prev.filter(p => p._id !== id));
      if (currentProject?._id === id) {
        setCurrentProject(null);
      }
      toast.success('Project deleted');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete project');
      throw err;
    }
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      currentProject,
      loading,
      fetchProjects,
      fetchProject,
      createProject,
      updateProject,
      deleteProject,
      setCurrentProject
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProjects must be used within ProjectProvider');
  return context;
};

export default ProjectContext;
