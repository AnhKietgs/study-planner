import { useState, useRef, useEffect } from 'react';
import { Plus, Search, Filter, X, Calendar as CalendarIcon, Check, Loader2, Trash2, AlertTriangle } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';

export default function Tasks() {
  const [activeTab, setActiveTab] = useState('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all'); 
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // --- STATE DỮ LIỆU TỪ API ---
  const [rawTasks, setRawTasks] = useState([]); 
  const [subjectsList, setSubjectsList] = useState([]); 
  const [loadingData, setLoadingData] = useState(true);
  
  // --- STATE FORM THÊM MỚI ---
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');
  const [newTaskSubjectId, setNewTaskSubjectId] = useState(''); 
  const [loadingAdd, setLoadingAdd] = useState(false);

  // --- STATE XÓA TASK ---
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const tabs = [
    { id: 'list', label: 'List View' },
    { id: 'board', label: 'Board View' },
    { id: 'matrix', label: 'Matrix View' },
  ];
  
  const filterRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) setIsFilterOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const priorityColors = { high: 'border-l-[#EF4444]', medium: 'border-l-[#F59E0B]', low: 'border-l-[#22C55E]' };

  // 1. FETCH DỮ LIỆU TỪ BACKEND
  const fetchData = async () => {
    setLoadingData(true);
    const token = localStorage.getItem('token');
    try {
      const [tasksRes, subjectsRes] = await Promise.all([
        fetch('http://localhost:5000/api/v1/tasks/getTask', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/v1/subjects/getSubject', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      const tasksData = await tasksRes.json();
      const subjectsData = await subjectsRes.json();

      if (tasksRes.ok) setRawTasks(tasksData || []);
      if (subjectsRes.ok) setSubjectsList(subjectsData.data || []); 

    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. HÀM THÊM CÔNG VIỆC MỚI
  const handleCreateTask = async () => {
    if (!newTaskTitle) return alert("Task title is required");
    
    setLoadingAdd(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5000/api/v1/tasks/createTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newTaskTitle,
          description: newTaskDesc,
          deadline: newTaskDeadline || null,
          subjectId: newTaskSubjectId || null 
        })
      });

      if (response.ok) {
        setIsModalOpen(false);
        setNewTaskTitle('');
        setNewTaskDesc('');
        setNewTaskDeadline('');
        setNewTaskSubjectId('');
        fetchData(); 
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to create task");
      }
    } catch (error) {
      console.error("Lỗi tạo công việc:", error);
    } finally {
      setLoadingAdd(false);
    }
  };

  // --- HÀM XÓA TASK ---
  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    
    setLoadingDelete(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:5000/api/v1/tasks/deleteTask/${taskToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setDeleteModalOpen(false);
        setTaskToDelete(null);
        fetchData(); // Tải lại danh sách sau khi xóa
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to delete task");
      }
    } catch (error) {
      console.error("Lỗi khi xóa task:", error);
    } finally {
      setLoadingDelete(false);
    }
  };

  const triggerDelete = (task, e) => {
    e.stopPropagation(); 
    setTaskToDelete(task);
    setDeleteModalOpen(true);
  };

  // --- HÀM MỚI: ĐỔI TRẠNG THÁI TASK (TICK CHECKBOX) ---
  const handleToggleStatus = async (task, e) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài
    const token = localStorage.getItem('token');
    
    // Nếu đang là DONE thì đổi thành TODO, và ngược lại
    const newStatus = task.status === 'DONE' ? 'TODO' : 'DONE';

    try {
      const response = await fetch(`http://localhost:5000/api/v1/tasks/updateStatus/${task.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchData(); // Gọi lại API để danh sách tự động cập nhật vị trí
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Lỗi khi cập nhật trạng thái");
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  // 3. PHÂN LOẠI & LỌC DỮ LIỆU
  const getFilteredTasks = () => {
    let result = { todo: [], inProgress: [], completed: [] };
    
    const filtered = rawTasks.filter(task => {
      const priorityString = String(task.priority || 'medium');
      const priorityLower = priorityString.toLowerCase(); 
      
      const matchPriority = filterPriority === 'all' || priorityLower === filterPriority;
      const taskTitle = String(task.title || '');
      const matchSearch = taskTitle.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchPriority && matchSearch;
    });

    result.todo = filtered.filter(t => t.status === 'TODO' || !t.status);
    result.inProgress = filtered.filter(t => t.status === 'IN_PROGRESS');
    result.completed = filtered.filter(t => t.status === 'DONE');
    
    return result;
  };
  
  const filteredTasks = getFilteredTasks();

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    return new Date(dateString).toLocaleDateString('en-GB'); 
  };

  const renderListView = () => (
    <div className="space-y-4">
      {Object.entries(filteredTasks).map(([status, taskList]) => (
        <div key={status}>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-[16px] font-semibold text-[#111827] dark:text-white capitalize">
              {status === 'inProgress' ? 'In Progress' : status}
            </h3>
            <span className="px-2 py-0.5 bg-[#F8FAFC] dark:bg-[#1E293B] rounded-full text-[12px] font-medium text-[#6B7280] dark:text-[#94A3B8]">
              {taskList.length}
            </span>
          </div>
          {taskList.length === 0 ? (
            <div className="p-4 bg-white dark:bg-[#1E293B] border border-dashed border-[#E5E7EB] dark:border-[#334155] rounded-xl text-center text-[#6B7280] dark:text-[#94A3B8] text-[14px]">
              No tasks found in this section.
            </div>
          ) : (
            <div className="space-y-3">
              {taskList.map((task) => {
                const pColor = priorityColors[task.priority?.toLowerCase()] || priorityColors.medium;
                return (
                  <Card key={task.id} className={`p-4 border-l-4 ${pColor} hover:shadow-lg transition-shadow cursor-pointer group relative overflow-hidden`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        
                        {/* --- Ô VUÔNG CHECKBOX ĐÃ ĐƯỢC GẮN SỰ KIỆN CLICK --- */}
                        <div 
                          onClick={(e) => handleToggleStatus(task, e)}
                          className={`w-5 h-5 border-2 rounded-[4px] flex items-center justify-center transition-colors cursor-pointer ${status === 'completed' ? 'bg-[#22C55E] border-[#22C55E]' : 'border-primary hover:bg-[#EFF6FF] dark:hover:bg-[#1e3a8a]'}`}
                        >
                          {status === 'completed' && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                        </div>

                        <div>
                          <h4 className={`text-[16px] font-medium ${status === 'completed' ? 'text-[#94A3B8] line-through' : 'text-[#111827] dark:text-white'}`}>{task.title}</h4>
                          <p className="text-[14px] text-[#6B7280] dark:text-[#94A3B8]">
                            {task.subject?.name || task.description || 'No subject'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className="text-[14px] text-[#6B7280] dark:text-[#94A3B8]">Due: {formatDate(task.deadline)}</span>
                        <span className={`px-3 py-1 rounded-[6px] text-[12px] font-medium ${
                          task.priority?.toLowerCase() === 'high' ? 'bg-[#EF4444] text-white' : 
                          task.priority?.toLowerCase() === 'low' ? 'bg-[#22C55E] text-white' : 
                          'bg-[#F59E0B] text-white'
                        }`}>
                          {(task.priority || 'MEDIUM').toUpperCase()}
                        </span>
                        
                        {/* NÚT XÓA (HIỆN KHI HOVER) */}
                        <button 
                          onClick={(e) => triggerDelete(task, e)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-100 dark:hover:bg-red-500/20"
                          title="Delete Task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderBoardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Object.entries(filteredTasks).map(([status, taskList]) => (
        <div key={status}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-semibold text-[#111827] dark:text-white capitalize">
              {status === 'inProgress' ? 'In Progress' : status}
            </h3>
            <span className="px-2 py-1 bg-[#F8FAFC] dark:bg-[#1E293B] rounded-[6px] text-[14px] font-medium text-[#6B7280] dark:text-[#94A3B8]">{taskList.length}</span>
          </div>
          <div className="space-y-3">
            {taskList.map((task) => (
              <Card key={task.id} className={`p-4 cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-transparent hover:border-primary group relative ${status === 'completed' ? 'opacity-60' : ''}`}>
                
                <button 
                  onClick={(e) => triggerDelete(task, e)}
                  className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-white dark:bg-[#1E293B] text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 dark:hover:bg-red-500/20 shadow-sm border border-red-100 dark:border-red-500/30"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <h4 className={`text-[16px] font-medium mb-2 pr-6 ${status === 'completed' ? 'text-[#94A3B8] line-through' : 'text-[#111827] dark:text-white'}`}>{task.title}</h4>
                <p className="text-[14px] text-[#6B7280] dark:text-[#94A3B8] mb-3 line-clamp-2">{task.subject?.name || task.description || 'No description'}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#6B7280] dark:text-[#94A3B8] flex items-center gap-1">
                    <CalendarIcon className="w-3 h-3" />
                    {formatDate(task.deadline)}
                  </span>
                  <span className={`px-2 py-1 rounded-[6px] text-[12px] font-medium ${
                    task.priority?.toLowerCase() === 'high' ? 'bg-[#FEE2E2] dark:bg-[#7f1d1d] text-[#EF4444] dark:text-[#fca5a5]' : 
                    task.priority?.toLowerCase() === 'low' ? 'bg-[#DCFCE7] dark:bg-[#14532d] text-[#22C55E] dark:text-[#86efac]' : 
                    'bg-[#FEF3C7] dark:bg-[#78350f] text-[#F59E0B] dark:text-[#fcd34d]'
                  }`}>
                    {(task.priority || 'MEDIUM').toUpperCase()}
                  </span>
                </div>
              </Card>
            ))}
            {taskList.length === 0 && (
              <div className="p-4 bg-[#F8FAFC] dark:bg-[#1E293B] border border-dashed border-[#E5E7EB] dark:border-[#334155] rounded-xl text-center text-[#6B7280] dark:text-[#94A3B8] text-[14px]">No tasks</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderMatrixView = () => (
    <div className="grid grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="text-[16px] font-semibold text-[#111827] dark:text-white mb-4">Urgent & Important (High)</h3>
        <div className="space-y-3 min-h-[300px] content-start">
          {filteredTasks.todo.filter(t => t.priority?.toLowerCase() === 'high').map(task => (
            <div key={task.id} className="p-3 bg-[#FEE2E2] dark:bg-[#7f1d1d]/30 border border-[#FECACA] dark:border-[#7f1d1d] rounded-[8px] hover:shadow-sm transition-shadow cursor-pointer group flex justify-between items-center">
              <p className="text-[14px] font-medium text-[#111827] dark:text-white">{task.title}</p>
              <button onClick={(e) => triggerDelete(task, e)} className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600"><X className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-6">
        <h3 className="text-[16px] font-semibold text-[#111827] dark:text-white mb-4">Not Urgent but Important (Medium)</h3>
        <div className="space-y-3 min-h-[300px] content-start">
          {filteredTasks.todo.filter(t => t.priority?.toLowerCase() === 'medium' || !t.priority).map(task => (
            <div key={task.id} className="p-3 bg-[#FEF3C7] dark:bg-[#78350f]/30 border border-[#FDE68A] dark:border-[#78350f] rounded-[8px] hover:shadow-sm transition-shadow cursor-pointer group flex justify-between items-center">
              <p className="text-[14px] font-medium text-[#111827] dark:text-white">{task.title}</p>
              <button onClick={(e) => triggerDelete(task, e)} className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600"><X className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-6">
        <h3 className="text-[16px] font-semibold text-[#111827] dark:text-white mb-4">Urgent but Not Important (Low)</h3>
        <div className="space-y-3 min-h-[300px] content-start">
           {filteredTasks.todo.filter(t => t.priority?.toLowerCase() === 'low').map(task => (
            <div key={task.id} className="p-3 bg-[#DCFCE7] dark:bg-[#14532d]/30 border border-[#BBF7D0] dark:border-[#14532d] rounded-[8px] hover:shadow-sm transition-shadow cursor-pointer group flex justify-between items-center">
              <p className="text-[14px] font-medium text-[#111827] dark:text-white">{task.title}</p>
              <button onClick={(e) => triggerDelete(task, e)} className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600"><X className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-6">
        <h3 className="text-[16px] font-semibold text-[#111827] dark:text-white mb-4">Completed</h3>
        <div className="space-y-3 min-h-[300px] content-start">
          {filteredTasks.completed.map(task => (
            <div key={task.id} className="p-3 bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-[8px] hover:shadow-sm transition-shadow cursor-pointer group flex justify-between items-center">
              <p className="text-[14px] font-medium text-[#94A3B8] line-through">{task.title}</p>
              <button onClick={(e) => triggerDelete(task, e)} className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600"><X className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <h1 className="dark:text-white">Tasks</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex flex-row items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white rounded-[8px] hover:bg-primary/90 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-5 h-5 flex-shrink-0" strokeWidth={2.5} />
          <span className="font-semibold text-[15px] leading-none">Add Task</span>
        </button>
      </div>

      <Card className="p-4">
        {/* Thanh tìm kiếm và Filter giữ nguyên */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8] group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search tasks by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-2.5 w-full bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-[#334155] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-primary transition-all text-[15px] text-[#111827] dark:text-white placeholder:text-[#94A3B8]"
              />
            </div>
          </div>
          <div className="relative" ref={filterRef}>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center px-5 py-2.5 rounded-[10px] font-semibold transition-all border cursor-pointer ${filterPriority !== 'all' ? 'bg-[#EFF6FF] dark:bg-[#1e3a8a]/30 border-[#BFDBFE] dark:border-[#1e3a8a] text-primary dark:text-[#60A5FA] shadow-sm' : 'bg-white dark:bg-[#1E293B] border-[#E5E7EB] dark:border-[#334155] text-[#475569] dark:text-[#CBD5E1] hover:bg-[#F8FAFC] dark:hover:bg-[#334155]'}`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter 
              {filterPriority !== 'all' && <span className="ml-2 w-5 h-5 flex items-center justify-center rounded-full bg-primary text-white text-[11px]">1</span>}
            </button>
            {isFilterOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#1E293B] rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-[#E5E7EB] dark:border-[#334155] z-20 py-2 animate-in fade-in slide-in-from-top-2 overflow-hidden">
                <div className="px-4 py-2 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">Filter by Priority</div>
                <div className="flex flex-col">
                  {['all', 'high', 'medium', 'low'].map(level => {
                    const isSelected = filterPriority === level;
                    return (
                      <button
                        key={level}
                        onClick={() => { setFilterPriority(level); setIsFilterOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-[14px] flex items-center justify-between transition-colors cursor-pointer ${isSelected ? 'bg-[#EFF6FF] dark:bg-[#1e3a8a]/30 text-primary dark:text-[#60A5FA] font-semibold' : 'text-[#475569] dark:text-[#CBD5E1] hover:bg-[#F8FAFC] dark:hover:bg-[#334155]'}`}
                      >
                        <div className="flex items-center gap-2">
                          {level !== 'all' && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: level === 'high' ? '#EF4444' : level === 'medium' ? '#F59E0B' : '#22C55E' }}></div>}
                          <span className="capitalize">{level === 'all' ? 'Show All Tasks' : level}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-primary dark:text-[#60A5FA]" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      <div className="flex gap-2 border-b border-[#E5E7EB] dark:border-[#334155]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-[16px] font-medium transition-colors border-b-2 cursor-pointer ${activeTab === tab.id ? 'text-primary dark:text-[#60A5FA] border-primary dark:border-[#60A5FA]' : 'text-[#6B7280] dark:text-[#94A3B8] border-transparent hover:text-[#111827] dark:hover:text-white'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loadingData ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-[#6B7280] dark:text-[#94A3B8]">Loading tasks...</p>
        </div>
      ) : (
        <div className="animate-in fade-in duration-300">
          {activeTab === 'list' && renderListView()}
          {activeTab === 'board' && renderBoardView()}
          {activeTab === 'matrix' && renderMatrixView()}
        </div>
      )}

      {/* POPUP XÁC NHẬN XÓA */}
      {deleteModalOpen && taskToDelete && (
        <div className="fixed inset-0 bg-[#0f172a]/80 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] border dark:border-[#334155] rounded-3xl p-8 w-full max-w-[440px] shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#FEF2F2] dark:bg-[#451a1a] rounded-full flex items-center justify-center mb-6">
                <AlertTriangle className="w-8 h-8 text-[#EF4444]" />
              </div>
              <h2 className="text-[24px] font-bold text-[#111827] dark:text-white mb-2">Delete Task?</h2>
              <p className="text-[#6B7280] dark:text-[#94A3B8] text-[15px] leading-relaxed">
                Are you sure you want to delete <span className="font-semibold text-gray-800 dark:text-gray-200">"{taskToDelete.title}"</span>? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex gap-3 mt-10">
              <button 
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 px-6 py-3 bg-[#F8FAFC] dark:bg-[#0F172A] text-[#475569] dark:text-[#CBD5E1] font-bold rounded-xl border border-[#E5E7EB] dark:border-[#334155] hover:bg-[#F1F5F9] dark:hover:bg-[#1e293b] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteTask}
                disabled={loadingDelete}
                className={`flex-1 flex justify-center items-center px-6 py-3 bg-[#EF4444] text-white font-bold rounded-xl shadow-lg shadow-red-500/20 hover:bg-[#dc2626] hover:-translate-y-0.5 transition-all cursor-pointer ${loadingDelete ? 'opacity-50' : ''}`}
              >
                {loadingDelete ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL THÊM TASK MỚI */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#0f172a]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] dark:border dark:border-[#334155] rounded-3xl p-8 w-full max-w-[500px] shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-[#94a3b8] hover:text-[#ef4444] transition-colors cursor-pointer bg-[#f8fafc] dark:bg-[#0F172A] hover:bg-[#fee2e2] dark:hover:bg-red-500/20 p-2 rounded-full">
              <X className="w-5 h-5" />
            </button>
            <div className="mb-6">
              <h2 className="text-[24px] font-bold text-[#0f172a] dark:text-white">Create New Task</h2>
              <p className="text-[#64748b] dark:text-[#94A3B8] text-[14px] mt-1">Plan your next move carefully.</p>
            </div>
            
            <div className="space-y-5">
              <Input 
                label="Task Title" 
                placeholder="What needs to be done?" 
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[14px] font-medium text-[#111827] dark:text-white transition-colors">
                    Subject (Optional)
                  </label>
                  <select
                    value={newTaskSubjectId}
                    onChange={(e) => setNewTaskSubjectId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-[#334155] rounded-[8px] text-[15px] text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 dark:focus:ring-[#2563EB]/50 focus:border-primary transition-colors cursor-pointer"
                  >
                    <option value="">-- Select Subject --</option>
                    {subjectsList.map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.icon} {sub.name}</option>
                    ))}
                  </select>
                </div>

                {/* --- Ô CHỌN NGÀY ĐÃ ĐƯỢC FIX LỖI --- */}
                <div className="space-y-2">
                  <label className="block text-[14px] font-medium text-[#111827] dark:text-white transition-colors">
                    Due Date
                  </label>
                  <input
                    type="datetime-local"
                    value={newTaskDeadline}
                    onChange={(e) => setNewTaskDeadline(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-[#334155] rounded-[8px] text-[15px] text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 dark:focus:ring-[#2563EB]/50 focus:border-primary transition-colors cursor-pointer dark:[color-scheme:dark]"
                  />
                </div>
              </div>

              <Input 
                label="Description" 
                placeholder="Additional details..." 
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
              />
              
              <div className="pt-5 border-t border-[#f1f5f9] dark:border-[#334155] flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setIsModalOpen(false)} className="cursor-pointer px-6 dark:border-[#475569] dark:text-[#CBD5E1]">
                  <span className="font-semibold">Cancel</span>
                </Button>
                <button 
                  onClick={handleCreateTask}
                  disabled={loadingAdd}
                  className={`flex flex-row items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-[10px] hover:bg-primary/90 shadow-md transition-all hover:-translate-y-0.5 cursor-pointer whitespace-nowrap ${loadingAdd ? 'opacity-50' : ''}`}
                >
                  <Plus className="w-5 h-5 flex-shrink-0" strokeWidth={2.5} />
                  <span className="font-semibold text-[15px] leading-none">
                    {loadingAdd ? 'Creating...' : 'Create Task'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}