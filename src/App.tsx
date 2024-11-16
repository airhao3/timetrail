import React, { useState } from 'react';
import { Activity, Project } from './types';
import { Timeline } from './components/Timeline';
import { ProjectStats } from './components/ProjectStats';
import { AddActivityModal } from './components/AddActivityModal';
import { AddProjectModal } from './components/AddProjectModal';
import { Layout, Plus, Filter } from 'lucide-react';

const INITIAL_PROJECTS: Project[] = [
  { id: '1', name: 'Personal Website', color: '#3B82F6' },
  { id: '2', name: 'Mobile App', color: '#10B981' },
  { id: '3', name: 'Client Project', color: '#8B5CF6' },
];

const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: '1',
    projectId: '1',
    title: 'Design Homepage',
    description: 'Created wireframes and final design for the personal portfolio homepage',
    date: '2024-03-10T10:00:00Z',
    timeSpent: 180,
    cost: 0,
    imageUrl: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=800',
    status: 'completed',
  },
  {
    id: '2',
    projectId: '2',
    title: 'User Authentication',
    description: 'Implement user authentication flow using Firebase',
    date: '2024-03-15T15:00:00Z',
    timeSpent: 240,
    cost: 49.99,
    linkUrl: 'https://firebase.google.com/docs/auth',
    status: 'in-progress',
  },
  {
    id: '3',
    projectId: '3',
    title: 'API Integration',
    description: 'Connect frontend with backend REST API endpoints',
    date: '2024-03-12T09:00:00Z',
    timeSpent: 360,
    cost: 150,
    status: 'stuck',
  },
];

function App() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [selectedProject, setSelectedProject] = useState<string | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<Activity['status'] | 'all'>('all');
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const filteredActivities = activities.filter(activity => {
    const projectMatch = selectedProject === 'all' || activity.projectId === selectedProject;
    const statusMatch = selectedStatus === 'all' || activity.status === selectedStatus;
    return projectMatch && statusMatch;
  });

  const handleAddActivity = (newActivity: Omit<Activity, 'id' | 'date'>) => {
    const activity: Activity = {
      ...newActivity,
      id: (activities.length + 1).toString(),
      date: new Date().toISOString(),
    };
    setActivities([activity, ...activities]);
  };

  const handleAddProject = (newProject: { name: string; color: string }) => {
    const project: Project = {
      ...newProject,
      id: (projects.length + 1).toString(),
    };
    setProjects([...projects, project]);
  };

  const handleStatusChange = (activityId: string, newStatus: Activity['status']) => {
    setActivities(activities.map(activity =>
      activity.id === activityId
        ? { ...activity, status: newStatus }
        : activity
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Layout className="w-8 h-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-gray-900">TimeTrail</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsProjectModalOpen(true)}
                className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Project
              </button>
              <button
                onClick={() => setIsActivityModalOpen(true)}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Activity
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Projects</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedProject('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedProject === 'all'
                      ? 'bg-blue-50 text-blue-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  All Projects
                </button>
                {projects.map(project => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(project.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedProject === project.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                      {project.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedProject !== 'all' && (
              <ProjectStats
                project={projects.find(p => p.id === selectedProject)!}
                activities={activities}
              />
            )}
          </div>

          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Timeline</h1>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as Activity['status'] | 'all')}
                  className="border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="planned">Planned</option>
                  <option value="in-progress">In Progress</option>
                  <option value="stuck">Stuck</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <Timeline
              activities={filteredActivities}
              projects={projects}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>
      </main>

      <AddActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        onSubmit={handleAddActivity}
        projects={projects}
      />

      <AddProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSubmit={handleAddProject}
      />
    </div>
  );
}

export default App;