import { Plus, BookOpen, Clock, TrendingUp, X, Loader2 } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useState, useEffect } from 'react';
import Input from '../components/Input';

export default function Subjects() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#2563EB');

  // --- STATE DỮ LIỆU THỰC ---
  const [subjects, setSubjects] = useState([]); 
  const [loadingData, setLoadingData] = useState(true); 

  // --- STATE FORM NHẬP ---
  const [subjectName, setSubjectName] = useState('');
  const [targetHours, setTargetHours] = useState('');
  const [iconEmoji, setIconEmoji] = useState('📚');
  const [loadingAdd, setLoadingAdd] = useState(false); 

  const colors = ['#2563EB', '#7C3AED', '#22C55E', '#F59E0B', '#EF4444', '#06B6D4', '#8B5CF6', '#EC4899'];

  // 1. HÀM LẤY DANH SÁCH MÔN HỌC TỪ SERVER
  const fetchSubjects = async () => {
    setLoadingData(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/v1/subjects/getSubject', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (response.ok) {
        setSubjects(result.data || []); // Lưu dữ liệu thật vào state
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách môn học:", error);
    } finally {
      setLoadingData(false);
    }
  };

  // Tự động gọi API khi vừa mở trang
  useEffect(() => {
    fetchSubjects();
  }, []);

  // 2. HÀM THÊM MÔN HỌC MỚI
  const handleAddSubject = async () => {
    if (!subjectName) return alert("Please enter subject name");
    
    setLoadingAdd(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5000/api/v1/subjects/createSubject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: subjectName,
          // ĐỔI TÊN BIẾN CHO KHỚP VỚI BACKEND
          weeklyStudyHours: parseInt(targetHours) || 0, 
          colorCode: selectedColor 
          // Mình bỏ 'icon' đi vì BE hiện tại của bạn không hề lưu icon
        })
      });

      if (response.ok) {
        setIsModalOpen(false);
        setSubjectName('');
        setTargetHours('');
        setIconEmoji('📚');
        fetchSubjects(); 
      } else {
        const errorData = await response.json();
        console.error("Server báo lỗi:", errorData);
        alert("Lỗi: " + (errorData.message || "Không thể thêm môn học"));
      }
    } catch (error) {
      console.error("Lỗi khi thêm:", error);
    } finally {
      setLoadingAdd(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="dark:text-white">Subjects</h1>
          <p className="text-[16px] text-[#6B7280] dark:text-[#94A3B8] mt-2">Manage your study subjects and track progress</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex flex-row items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white rounded-[8px] hover:bg-[#1d4ed8] shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-5 h-5 flex-shrink-0" strokeWidth={2.5} />
          <span className="font-semibold text-[15px] leading-none">Add Subject</span>
        </button>
      </div>

      {/* HIỂN THỊ LOADING KHI ĐANG TẢI DỮ LIỆU */}
      {loadingData ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-[#6B7280] dark:text-[#94A3B8]">Loading your subjects...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Card key={subject.id} className="p-6 hover:shadow-xl transition-shadow cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-[12px] flex items-center justify-center text-2xl dark:opacity-80" 
                  style={{ backgroundColor: `${subject.colorCode || '#2563EB'}20` }}
                >
                  {/* Dùng icon của subject hoặc mặc định là cuốn sách */}
                  {subject.icon || '📚'}
                </div>
                <div 
                  className="w-2 h-2 rounded-full group-hover:scale-150 transition-transform" 
                  style={{ backgroundColor: subject.colorCode || '#2563EB' }}
                ></div>
              </div>
              <h3 className="text-[20px] font-semibold text-[#111827] dark:text-white mb-4">{subject.name}</h3>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[14px] text-[#6B7280] dark:text-[#94A3B8]">Progress</span>
                  <span className="text-[14px] font-semibold" style={{ color: subject.colorCode || '#2563EB' }}>
                    {subject.progress || 0}%
                  </span>
                </div>
                <div className="w-full h-2 bg-[#F8FAFC] dark:bg-[#0F172A] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ width: `${subject.progress || 0}%`, backgroundColor: subject.colorCode || '#2563EB' }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E5E7EB] dark:border-[#334155]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-[#6B7280] dark:text-[#94A3B8]" />
                    <span className="text-[12px] text-[#6B7280] dark:text-[#94A3B8]">Study Hours</span>
                  </div>
                  {/* SỬA THÀNH weeklyStudyHours */}
                  <p className="text-[16px] font-semibold text-[#111827] dark:text-white">
                    {subject.weeklyStudyHours || 0}h
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="w-4 h-4 text-[#6B7280] dark:text-[#94A3B8]" />
                    <span className="text-[12px] text-[#6B7280] dark:text-[#94A3B8]">Tasks</span>
                  </div>
                  {/* SỬA THÀNH totalTasks */}
                  <p className="text-[16px] font-semibold text-[#111827] dark:text-white">
                    {subject.totalTasks || 0}
                  </p>
                </div>
              </div>
            </Card>
          ))}

          {/* Nút Add Card luôn nằm cuối danh sách */}
          <Card 
            className="p-6 border-2 border-dashed border-[#E5E7EB] dark:border-[#334155] hover:border-primary dark:hover:border-primary bg-transparent hover:bg-[#EFF6FF] dark:hover:bg-[#1e3a8a]/20 transition-all cursor-pointer flex items-center justify-center min-h-[280px]"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-[#EFF6FF] dark:bg-[#1e3a8a]/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-primary dark:text-[#60A5FA]" />
              </div>
              <h3 className="text-[16px] font-medium text-[#111827] dark:text-white mb-1">Add New Subject</h3>
              <p className="text-[14px] text-[#6B7280] dark:text-[#94A3B8]">Start tracking a new subject</p>
            </div>
          </Card>
        </div>
      )}

      {/* MODAL NHẬP LIỆU (Giữ nguyên phần này như bạn đã có) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#0f172a]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] dark:border dark:border-[#334155] rounded-3xl p-8 w-full max-w-[450px] shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-[#94a3b8] hover:text-[#ef4444] transition-colors cursor-pointer bg-[#f8fafc] dark:bg-[#0F172A] hover:bg-[#fee2e2] dark:hover:bg-red-500/20 p-2 rounded-full">
              <X className="w-5 h-5" />
            </button>
            <div className="mb-6">
              <h2 className="text-[24px] font-bold text-[#0f172a] dark:text-white">Add New Subject</h2>
              <p className="text-[#64748b] dark:text-[#94A3B8] text-[14px] mt-1">Expand your knowledge.</p>
            </div>
            <div className="space-y-6">
              <Input label="Subject Name" placeholder="e.g., Math" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Target (hours/week)" type="number" placeholder="10" value={targetHours} onChange={(e) => setTargetHours(e.target.value)} />
                <Input label="Icon (Emoji)" placeholder="⚛️" value={iconEmoji} onChange={(e) => setIconEmoji(e.target.value)} />
              </div>
              {/* Theme Color selector giữ nguyên... */}
              <div className="pt-5 border-t border-[#f1f5f9] dark:border-[#334155] flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setIsModalOpen(false)} className="cursor-pointer px-6 dark:border-[#475569] dark:text-[#CBD5E1]">Cancel</Button>
                <button 
                  onClick={handleAddSubject}
                  disabled={loadingAdd}
                  className={`flex flex-row items-center justify-center gap-2 px-6 py-2.5 text-white rounded-[10px] shadow-md transition-all hover:-translate-y-0.5 cursor-pointer whitespace-nowrap ${loadingAdd ? 'opacity-50' : ''}`}
                  style={{ backgroundColor: selectedColor }}
                >
                  {loadingAdd ? 'Adding...' : 'Add Subject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}