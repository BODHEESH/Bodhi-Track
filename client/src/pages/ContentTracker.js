import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Button, Input, Badge } from '../components/ui/Card';
import { Tabs, FloatingActionButton, Accordion } from '../components/ui/Interactive';
import { Toast, Modal } from '../components/ui/Advanced';
import { GlowingBorder, Sparkles, WavePattern } from '../components/ui/Decorative';
import { 
  BookOpenIcon, VideoCameraIcon, DocumentTextIcon, 
  PencilSquareIcon, LinkIcon, PlayCircleIcon 
} from '@heroicons/react/24/outline';

const ContentTracker = () => {
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [modalType, setModalType] = useState('update'); // 'update' or 'create'

  const contentTypes = [
    {
      type: 'Learning Resources',
      icon: <BookOpenIcon className="w-6 h-6" />,
      items: [
        {
          title: "Clean Code",
          author: "Robert C. Martin",
          progress: 0,
          totalChapters: 17,
          currentChapter: 0,
          notes: []
        },
        {
          title: "Design Patterns",
          author: "Gang of Four",
          progress: 0,
          totalChapters: 23,
          currentChapter: 0,
          notes: []
        }
      ]
    },
    {
      type: 'Content Creation',
      icon: <PencilSquareIcon className="w-6 h-6" />,
      platforms: [
        {
          name: 'YouTube',
          icon: <PlayCircleIcon className="w-6 h-6" />,
          content: [
            {
              title: "System Design: URL Shortener",
              status: "published",
              views: 1200,
              likes: 156,
              publishDate: "2025-02-19",
              tasks: [
                { task: "Script Writing", completed: true },
                { task: "Recording", completed: true },
                { task: "Editing", completed: true },
                { task: "Thumbnail", completed: true }
              ]
            },
            {
              title: "DSA: Dynamic Programming",
              status: "in-progress",
              tasks: [
                { task: "Script Writing", completed: true },
                { task: "Recording", completed: false },
                { task: "Editing", completed: false },
                { task: "Thumbnail", completed: false }
              ]
            }
          ]
        },
        {
          name: 'Hashnode',
          icon: <DocumentTextIcon className="w-6 h-6" />,
          content: [
            {
              title: "Mastering System Design",
              status: "published",
              views: 450,
              reactions: 25,
              publishDate: "2025-02-18",
              tasks: [
                { task: "Outline", completed: true },
                { task: "Draft", completed: true },
                { task: "Review", completed: true },
                { task: "Publish", completed: true }
              ]
            },
            {
              title: "Advanced Git Workflows",
              status: "draft",
              tasks: [
                { task: "Outline", completed: true },
                { task: "Draft", completed: false },
                { task: "Review", completed: false },
                { task: "Publish", completed: false }
              ]
            }
          ]
        },
        {
          name: 'LinkedIn',
          icon: <LinkIcon className="w-6 h-6" />,
          content: [
            {
              title: "Weekly Tech Digest",
              status: "published",
              impressions: 2300,
              reactions: 180,
              publishDate: "2025-02-17",
              tasks: [
                { task: "Research", completed: true },
                { task: "Writing", completed: true },
                { task: "Review", completed: true }
              ]
            },
            {
              title: "Career Growth Tips",
              status: "scheduled",
              scheduledDate: "2025-02-21",
              tasks: [
                { task: "Research", completed: true },
                { task: "Writing", completed: true },
                { task: "Review", completed: false }
              ]
            }
          ]
        }
      ]
    }
  ];

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'published': return 'success';
      case 'in-progress': return 'info';
      case 'draft': return 'warning';
      case 'scheduled': return 'primary';
      default: return 'default';
    }
  };

  const renderContentCreationSection = () => (
    <div className="space-y-6">
      {contentTypes[1].platforms.map((platform) => (
        <GlowingBorder key={platform.name}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {platform.icon}
                  <h2 className="text-xl font-bold">{platform.name}</h2>
                </div>
                <Button
                  variant="primary"
                  onClick={() => {
                    setModalType('create');
                    setSelectedContent({ platform: platform.name });
                    setShowModal(true);
                  }}
                >
                  Create New
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion
                items={platform.content.map((item) => ({
                  title: (
                    <div className="flex justify-between items-center w-full">
                      <span>{item.title}</span>
                      <Badge variant={getStatusBadgeVariant(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                  ),
                  content: (
                    <div className="space-y-4">
                      {/* Stats Section */}
                      {item.status === 'published' && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {item.views && (
                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                              <div className="text-sm text-gray-500 dark:text-gray-400">Views</div>
                              <div className="text-lg font-semibold">{item.views}</div>
                            </div>
                          )}
                          {item.likes && (
                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                              <div className="text-sm text-gray-500 dark:text-gray-400">Likes</div>
                              <div className="text-lg font-semibold">{item.likes}</div>
                            </div>
                          )}
                          {item.reactions && (
                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                              <div className="text-sm text-gray-500 dark:text-gray-400">Reactions</div>
                              <div className="text-lg font-semibold">{item.reactions}</div>
                            </div>
                          )}
                          {item.impressions && (
                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                              <div className="text-sm text-gray-500 dark:text-gray-400">Impressions</div>
                              <div className="text-lg font-semibold">{item.impressions}</div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Tasks Section */}
                      <div className="space-y-2">
                        <h3 className="font-medium">Tasks</h3>
                        <div className="space-y-2">
                          {item.tasks.map((task, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => {}}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span className={task.completed ? 'line-through text-gray-500' : ''}>
                                {task.task}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setModalType('update');
                            setSelectedContent(item);
                            setShowModal(true);
                          }}
                        >
                          Edit
                        </Button>
                        {item.status !== 'published' && (
                          <Button
                            variant="primary"
                            onClick={() => {
                              setShowToast(true);
                              // Add publish logic here
                            }}
                          >
                            Publish
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                }))}
              />
            </CardContent>
          </Card>
        </GlowingBorder>
      ))}
    </div>
  );

  return (
    <div className="relative min-h-screen">
      <WavePattern />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content Hub</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track your learning progress and content creation
          </p>
        </div>

        <Tabs
          tabs={[
            {
              label: "Learning Resources",
              content: (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {contentTypes[0].items.map((item, index) => (
                    <GlowingBorder key={index}>
                      <Card className="h-full">
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">{item.title}</h3>
                            <Badge variant={item.progress === 100 ? 'success' : 'info'}>
                              {item.progress}% Complete
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {item.author}
                            </p>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div
                                className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${item.progress}%` }}
                              />
                            </div>
                            <Button
                              variant="primary"
                              onClick={() => {
                                setModalType('update');
                                setSelectedContent(item);
                                setShowModal(true);
                              }}
                            >
                              Update Progress
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </GlowingBorder>
                  ))}
                </div>
              )
            },
            {
              label: "Content Creation",
              content: renderContentCreationSection()
            }
          ]}
        />

        <FloatingActionButton
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          }
          onClick={() => {
            setModalType('create');
            setSelectedContent(null);
            setShowModal(true);
          }}
          position="bottom-right"
        />

        {/* Content Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={modalType === 'create' ? 'Create New Content' : `Update ${selectedContent?.title || ''}`}
        >
          <div className="space-y-4">
            {modalType === 'create' && (
              <>
                <Input
                  type="text"
                  placeholder="Title"
                  className="w-full"
                />
                {selectedContent?.platform && (
                  <div className="text-sm text-gray-500">
                    Platform: {selectedContent.platform}
                  </div>
                )}
              </>
            )}
            
            {modalType === 'update' && selectedContent?.tasks ? (
              <div className="space-y-4">
                {selectedContent.tasks.map((task, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => {}}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>{task.task}</span>
                  </div>
                ))}
              </div>
            ) : (
              <Input
                type="number"
                placeholder="Progress (%)"
                min="0"
                max="100"
                className="w-full"
              />
            )}

            <Input
              type="text"
              placeholder="Add notes..."
              className="w-full"
            />

            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setShowToast(true);
                  setShowModal(false);
                }}
              >
                {modalType === 'create' ? 'Create' : 'Save'}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Success Toast */}
        {showToast && (
          <Toast
            message={modalType === 'create' ? 'Content created successfully!' : 'Progress updated successfully!'}
            type="success"
            onClose={() => setShowToast(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ContentTracker;
