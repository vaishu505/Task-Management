import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem('taskflow-tasks');

      return savedTasks
        ? JSON.parse(savedTasks)
        : [
          {
            id: 1,
            title: 'Complete portfolio website',
            category: 'Development',
            priority: 'High',
            status: 'In Progress',
          },
          {
            id: 2,
            title: 'Review project documentation',
            category: 'Work',
            priority: 'Medium',
            status: 'Pending',
          },
          {
            id: 3,
            title: 'Learn React components',
            category: 'Learning',
            priority: 'High',
            status: 'Completed',
          },
          {
            id: 4,
            title: 'Prepare internship presentation',
            category: 'Work',
            priority: 'Low',
            status: 'Pending',
          },
        ];
      // useEffect(() => {
      //   localStorage.setItem('taskflow-tasks', JSON.stringify(tasks));
      // }, [tasks]);
    } catch {
      return [];
    }

  });
  useEffect(() => {
    localStorage.setItem('taskflow-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('taskflow-dark-mode') === 'true'
  );

  const [newTask, setNewTask] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newDueDate, setNewDueDate] = useState('');
  const [search, setSearch] = useState('');
  // const [menuOpen, setMenuOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

  const [projects, setProjects] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('taskflow-projects')) || [];
    } catch {
      return [];
    }
  });

  const [newProject, setNewProject] = useState('');


  // const [darkMode, setDarkMode] = useState(
  //   () => localStorage.getItem('taskflow-dark-mode') === 'true'
  // );


  const [activePage, setActivePage] = useState('Dashboard');

  const [sortBy, setSortBy] = useState('default');
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [filter, setFilter] = useState('All');

  const [menuOpen, setMenuOpen] = useState(false);


  useEffect(() => {
    localStorage.setItem('taskflow-projects', JSON.stringify(projects));
  }, [projects]);

  const [priorityFilter, setPriorityFilter] = useState('All');
  useEffect(() => {
    localStorage.setItem('taskflow-dark-mode', darkMode);
  }, [darkMode]);


  const addTask = (event) => {
    event.preventDefault();

    if (!newTask.trim()) return;

    const task = {
      id: Date.now(),
      title: newTask.trim(),
      category: 'Personal',
      priority: newPriority,
      dueDate: newDueDate,
      status: 'Pending',

    };

    setTasks((previousTasks) => [task, ...previousTasks]);
    setNewTask('');
    setNewPriority('Medium');
    setNewDueDate('');
  };


  const toggleTask = (id) => {
    const task = tasks.find((task) => task.id === id);

    if (!task) return;

    const isCompleting = task.status !== 'Completed';

    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id
          ? {
            ...task,
            status: isCompleting ? 'Completed' : 'Pending',
          }
          : task
      )
    );

    setSuccessMessage(
      isCompleting
        ? '🎉 Task completed successfully!'
        : 'Task marked as pending.'
    );

    setTimeout(() => setSuccessMessage(''), 2500);
  };


  const deleteTask = (id) => {
    setTasks((previousTasks) =>
      previousTasks.filter((task) => task.id !== id)
    );
  };
  const startEditing = (task) => {
    setEditingId(task.id);
    setEditingTitle(task.title);
  };

  const saveEdit = (id) => {
    if (!editingTitle.trim()) return;

    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id
          ? { ...task, title: editingTitle.trim() }
          : task
      )
    );

    setEditingId(null);
    setEditingTitle('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle('');
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter =
      filter === 'All' || task.status === filter;

    const matchesPriority =
      priorityFilter === 'All' ||
      task.priority === priorityFilter;



    return matchesSearch && matchesFilter && matchesPriority;

  });


  // const matchesPriority =
  //   priorityFilter === 'All' ||
  //   task.priority === priorityFilter;


  const completed = tasks.filter(
    (task) => task.status === 'Completed'
  ).length;

  const pending = tasks.filter(
    (task) => task.status === 'Pending'
  ).length;

  const inProgress = tasks.filter(
    (task) => task.status === 'In Progress'
  ).length;
  const completedCount = tasks.filter(
    (task) => task.status === 'Completed'
  ).length;

  const progressPercentage = tasks.length === 0
    ? 0
    : Math.round((completedCount / tasks.length) * 100);


  const today = new Date().toLocaleDateString('en-CA');

  const dueToday = tasks.filter(
    (task) =>
      task.dueDate === today &&
      task.status !== 'Completed'
  ).length;

  const upcomingTasks = tasks.filter((task) => {
    if (!task.dueDate || task.status === 'Completed') return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(task.dueDate + 'T00:00:00');
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    return dueDate >= today && dueDate <= nextWeek;
  });


  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      return (priorityOrder[a.priority] || 4) -
        (priorityOrder[b.priority] || 4);
    }

    if (sortBy === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    }

    if (sortBy === 'name') {
      return a.title.localeCompare(b.title);
    }

    return 0;
  });



  const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();

  const daysInMonth = new Date(
    calendarYear,
    calendarMonth + 1,
    0
  ).getDate();

  const changeMonth = (direction) => {
    const newDate = new Date(
      calendarYear,
      calendarMonth + direction,
      1
    );

    setCalendarMonth(newDate.getMonth());
    setCalendarYear(newDate.getFullYear());
  };

  const getTasksForDay = (day) => {
    const month = String(calendarMonth + 1).padStart(2, '0');
    const date = String(day).padStart(2, '0');
    const targetDate = `${calendarYear}-${month}-${date}`;

    return tasks.filter((task) => task.dueDate === targetDate);
  };




  return (






    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      {successMessage && (
        <div className="success-message" role="status">
          {successMessage}
        </div>
      )}

      {/* Keep your existing app content below */}


      <aside className={`bar ${menuOpen ? 'menu-open' : ''}`}>
        <button
          className="mobile-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
        <div className="brand">
          <span className="brand-icon">✓</span>
          TaskFlow
        </div>

        <p className="menu-label">WORKSPACE</p>


        <div
          className={`nav-item ${activePage === 'Dashboard' ? 'active' : ''}`}
          onClick={() => setActivePage('Dashboard')}
        >
          ▦ &nbsp; Dashboard
        </div>

        <div
          className={`nav-item ${activePage === 'My Tasks' ? 'active' : ''}`}
          onClick={() => {
            setActivePage('My Tasks');
            setMenuOpen(false);
          }}
        >
          ☷ &nbsp; My Tasks
        </div>

        <div
          className={`nav-item ${activePage === 'Projects' ? 'active' : ''}`}
          onClick={() => {
            setActivePage('Projects');
            setMenuOpen(false);
          }}
        >
          ▣ &nbsp; Projects
        </div>

        <div
          className={`nav-item ${activePage === 'Calendar' ? 'active' : ''}`}
          onClick={() => {
            setActivePage('Calendar');
            setMenuOpen(false);
          }}
        >
          ▦ &nbsp; Calendar
        </div>


        <div className="sidebar-bottom">
          <div className="avatar">TF</div>
          <div>
            <strong>TaskFlow User</strong>
            <small>Personal workspace</small>
          </div>
        </div>
      </aside>


      <main className="main">

        {activePage !== 'Dashboard' && (
          <div className="page-placeholder">
            {activePage === 'My Tasks' && (
              <>
                <h1>My Tasks</h1>
                <p>You have {tasks.length} tasks in total.</p>
                {tasks.length === 0 ? (
                  <p>No tasks yet. Go to Dashboard to add your first task.</p>
                ) : (
                  <ul>
                    {tasks.map((task) => (
                      <li key={task.id}>
                        {task.title} — {task.status} — {task.priority}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}


            {activePage === 'Projects' && (
              <>
                <h1>My Projects</h1>
                <p>Organize and track your work.</p>

                <div className="project-card">
                  <div className="project-icon">📋</div>
                  <h2>TaskFlow</h2>
                  <p>Personal task management workspace</p>
                  <p>Total tasks: {tasks.length}</p>
                  <p>
                    Completed: {tasks.filter(
                      (task) => task.status === 'Completed'
                    ).length}
                  </p>
                </div>
              </>
            )}


                     {activePage === 'Calendar' && (
              <div className="calendar-page">
                <div className="calendar-heading">
                  <div>
                    <h1>📅 Task Calendar</h1>
                    <p>View your scheduled tasks by date.</p>
                  </div>

                  <div className="calendar-navigation">
                    <button type="button" onClick={() => changeMonth(-1)}>
                      ←
                    </button>

                    <strong>
                      {new Date(calendarYear, calendarMonth).toLocaleDateString(
                        'en-US',
                        { month: 'long', year: 'numeric' }
                      )}
                    </strong>

                    <button type="button" onClick={() => changeMonth(1)}>
                      →
                    </button>
                  </div>
                </div>

                <div className="calendar-grid">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div className="calendar-weekday" key={day}>
                      {day}
                    </div>
                  ))}

                  {Array.from({ length: firstDay }, (_, i) => (
                    <div
                      className="calendar-cell empty-cell"
                      key={`empty-${i}`}
                    />
                  ))}

                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const dayTasks = getTasksForDay(day);

                    return (
                      <div className="calendar-cell" key={day}>
                        <strong>{day}</strong>

                        {dayTasks.map((task) => (
                          <div
                            className="calendar-event"
                            key={task.id}
                            title={task.title}
                          >
                            {task.title}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}


           
<button
  className="back-dashboard-btn"
  onClick={() => setActivePage('Dashboard')}
>
  ← Back to Dashboard
</button>

          </div>
        )}



        {activePage === 'Dashboard' && (
          <header className="topbar">
            <div className="breadcrumb">
              Workspace / <strong>{activePage}</strong>
            </div>

            <div className="profile">
              <div className="avatar">TF</div>
            </div>
          </header>
        )}




        {activePage === 'Dashboard' && (
          <>
            <section className="welcome">
              <div>
                <p className="eyebrow">YOUR PRODUCTIVITY SPACE</p>
                <h1>
                  Good day! 👋</h1>
                <p>Plan your work, track progress, and get things done.</p>
              </div>

              <button
                className="dark-mode-toggle"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </button>
              <div className="welcome-icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="5" width="18" height="16" rx="3" />
                  <path d="M16 3v4M8 3v4M3 10h18" />
                  <path d="m8 15 2.5 2.5L16 12" />
                </svg>
              </div>
            </section>

            <section className="stats">
              <div className="stat-card">
                <div className="stat-top">
                  <span>Total Tasks</span>
                  <span className="stat-icon purple">☷</span>
                </div>
                <h2>{tasks.length}</h2>
                <small>Tasks in your workspace</small>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <span>In Progress</span>
                  <span className="stat-icon blue">◷</span>
                </div>
                <h2>{inProgress}</h2>
                <small>Currently being worked on</small>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <span>Completed</span>
                  <span className="stat-icon green">✓</span>
                </div>
                <h2>{completed}</h2>
                <small>Tasks finished</small>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <span>Pending</span>
                  <span className="stat-icon orange">◴</span>
                </div>
                <h2>{pending}</h2>
                <small>Waiting to get started</small>
              </div>
            </section>

            <section className="upcoming-section">
              <h2>📅 Upcoming Tasks</h2>
              {upcomingTasks.length === 0 ? (
                <p>No upcoming tasks for the next 7 days.</p>
              ) : (
                <ul>
                  {upcomingTasks.map((task) => (
                    <li key={task.id}>
                      <span>{task.title}</span>
                      <span>
                        Due: {task.dueDate}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section className="progress-card">
              <div className="progress-header">
                <div>
                  <h3>Overall Progress</h3>
                  <p>Keep going — you're making progress!</p>
                </div>
                <strong>{progressPercentage}%</strong>
              </div>

              <div className="stat-card">
                <h3>Due Today</h3>
                <p>{dueToday}</p>
              </div>


              <div
                className="progress-track"
                role="progressbar"
                aria-label="Task completion progress"
                aria-valuenow={progressPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="progress-fill"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              <small>
                {completedCount} of {tasks.length} tasks completed
              </small>
            </section>

            <section className="task-section">
              <div className="section-heading">
                <div>
                  <h2>My Tasks</h2>
                  <p>Keep your priorities in focus.</p>
                </div>

                <span className="task-count">
                  {filteredTasks.length} tasks
                </span>
              </div>

              <form className="add-form" onSubmit={addTask}>
                <input
                  value={newTask}
                  onChange={(event) => setNewTask(event.target.value)}
                  placeholder="What needs to get done?"
                  aria-label="New task title"
                />
                <select
                  className="priority-select"
                  value={newPriority}
                  onChange={(event) => setNewPriority(event.target.value)}
                  aria-label="Select task priority"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <input
                  type="date"
                  className="due-date-input"
                  value={newDueDate}
                  onChange={(event) => setNewDueDate(event.target.value)}
                  aria-label="Task due date"
                />
                <button type="submit">+ Add Task</button>
              </form>

              <div className="task-controls">
                <input
                  className="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="⌕  Search tasks..."
                  aria-label="Search tasks"
                />

                {/* <select
  className="search"
  value={priorityFilter}
  onChange={(event) => setPriorityFilter(event.target.value)}
  aria-label="Filter by priority"
>
  <option value="All">All Priorities</option>
  <option value="High">High Priority</option>
  <option value="Medium">Medium Priority</option>
  <option value="Low">Low Priority</option>
</select> */}



                <select
                  className="search"
                  value={priorityFilter}
                  onChange={(event) => setPriorityFilter(event.target.value)}
                  aria-label="Filter by priority"
                >
                  <option value="All">All Priorities</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>

                <select
                  className="search"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  aria-label="Sort tasks"
                >
                  <option value="default">Sort: Default</option>
                  <option value="priority">Sort: Priority</option>
                  <option value="dueDate">Sort: Due Date</option>
                  <option value="name">Sort: Name</option>
                </select>


                <select
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                  aria-label="Filter tasks"
                >
                  <option value="All">All tasks</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="task-list">
                {sortedTasks.map((task) => (
                  <article className="task-row" key={task.id}>
                    <button
                      type="button"
                      className={`check ${task.status === 'Completed' ? 'checked' : ''
                        }`}
                      onClick={() => toggleTask(task.id)}
                      aria-label={`Toggle ${task.title}`}
                    >
                      {task.status === 'Completed' ? '✓' : ''}
                    </button>

                    {/* <div className="task-info">
                  <strong
                    className={
                      task.status === 'Completed' ? 'task-done' : ''
                    }
                  >
                    {task.title}
                  </strong>
                  <small>{task.category}</small>
                </div> */}
                    {editingId === task.id ? (
                      <div className="task-info edit-fields">
                        <input
                          value={editingTitle}
                          onChange={(event) => setEditingTitle(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') saveEdit(task.id);
                            if (event.key === 'Escape') cancelEdit();
                          }}
                          aria-label="Edit task title"
                          autoFocus
                        />
                        <button
                          type="button"
                          className="edit-action save-action"
                          onClick={() => saveEdit(task.id)}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="edit-action"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="task-info">
                        <strong
                          className={task.status === 'Completed' ? 'task-done' : ''}
                        >
                          {task.title}
                        </strong>
                        <small>{task.category}</small>

                        {task.dueDate && (
                          <div className="due-date-container">
                            <small className="task-due-date">
                              Due: {task.dueDate}
                            </small>

                            {task.status !== 'Completed' &&
                              task.dueDate < new Date().toLocaleDateString('en-CA') && (
                                <span className="overdue-badge">Overdue</span>
                              )}
                          </div>
                        )}

                      </div>
                    )}

                    <span
                      className={`priority priority-${task.priority.toLowerCase()}`}
                    >
                      {task.priority}
                    </span>

                    <span
                      className={`status status-${task.status
                        .toLowerCase()
                        .replace(' ', '-')}`}
                    >
                      {task.status}
                    </span>
                    {editingId !== task.id && (
                      <button
                        type="button"
                        className="edit-button"
                        onClick={() => startEditing(task)}
                        aria-label={`Edit ${task.title}`}
                      >
                        Edit
                      </button>
                    )}

                    <button
                      type="button"
                      className="delete"

                      onClick={() => {
                        const confirmed = window.confirm(
                          `Are you sure you want to delete "${task.title}"?`
                        );

                        if (confirmed) {
                          deleteTask(task.id);
                        }
                      }}

                      aria-label={`Delete ${task.title}`}
                    >
                      ×
                    </button>
                  </article>
                ))}

                {filteredTasks.length === 0 && (
                  <div className="empty">
                    No tasks found. Add a new task to get started!
                  </div>
                )}
              </div>
            </section>

            <footer>Made with focus & care · TaskFlow</footer>
          </>
        )}

      </main>

    </div>
  );
}

export default App;