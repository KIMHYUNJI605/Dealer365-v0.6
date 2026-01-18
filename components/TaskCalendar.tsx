import React, { useState } from 'react';
import { 
    Calendar, 
    CheckSquare, 
    ChevronLeft, 
    ChevronRight, 
    Clock, 
    MoreHorizontal, 
    Plus, 
    Phone, 
    Mail, 
    Car, 
    Users, 
    AlertCircle,
    CheckCircle2,
    Briefcase
} from 'lucide-react';
import { MOCK_ACTIVITIES } from '../data/mockData';

const TaskCalendar: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [taskFilter, setTaskFilter] = useState<'TODAY' | 'OVERDUE' | 'UPCOMING'>('TODAY');

    // Helper to format date
    const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    // --- CALENDAR LOGIC ---
    // Generate current week dates (Mon-Sun)
    const getWeekDates = (baseDate: Date) => {
        const current = new Date(baseDate);
        const day = current.getDay(); // 0 is Sunday
        const diff = current.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is sunday
        
        const monday = new Date(current.setDate(diff));
        const week = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            week.push(d);
        }
        return week;
    };

    const weekDates = getWeekDates(selectedDate);
    const hours = Array.from({ length: 11 }, (_, i) => i + 8); // 8 AM to 6 PM

    // --- TASK LOGIC ---
    const todayStr = formatDate(new Date());
    
    const tasks = MOCK_ACTIVITIES.filter(act => {
        if (taskFilter === 'OVERDUE') return act.status === 'OVERDUE';
        if (taskFilter === 'TODAY') return act.date === todayStr && act.status !== 'COMPLETED';
        if (taskFilter === 'UPCOMING') return act.date > todayStr;
        return true;
    });

    const getEventStyle = (type: string) => {
        switch(type) {
            case 'TEST_DRIVE': return 'bg-green-100 border-green-200 text-green-800';
            case 'SERVICE_APPT': return 'bg-blue-100 border-blue-200 text-blue-800';
            case 'MEETING': return 'bg-purple-100 border-purple-200 text-purple-800';
            case 'TASK': return 'bg-gray-100 border-gray-200 text-gray-800';
            default: return 'bg-gray-100 border-gray-200 text-gray-800';
        }
    };

    const getIcon = (type: string) => {
        switch(type) {
            case 'TEST_DRIVE': return Car;
            case 'SERVICE_APPT': return Briefcase;
            case 'MEETING': return Users;
            default: return CheckSquare;
        }
    };

    return (
        <div className="flex h-full bg-[#F8F9FA] overflow-hidden">
            
            {/* LEFT PANEL: CALENDAR (70%) */}
            <div className="flex-1 flex flex-col min-w-0 border-r border-gray-200 bg-white">
                
                {/* Calendar Header */}
                <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                            <Calendar className="mr-2 text-blue-600" /> Weekly Schedule
                        </h2>
                        <div className="flex items-center bg-gray-100 rounded-lg p-1">
                            <button className="p-1 hover:bg-white rounded shadow-sm transition-all"><ChevronLeft size={16} /></button>
                            <span className="px-3 text-sm font-bold text-gray-700">
                                {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                            <button className="p-1 hover:bg-white rounded shadow-sm transition-all"><ChevronRight size={16} /></button>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button className="px-3 py-1.5 text-sm font-medium bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Day</button>
                        <button className="px-3 py-1.5 text-sm font-medium bg-gray-900 text-white rounded-lg shadow-sm">Week</button>
                        <button className="px-3 py-1.5 text-sm font-medium bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Month</button>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="flex-1 overflow-y-auto flex flex-col relative">
                    {/* Header Row (Days) */}
                    <div className="flex border-b border-gray-200 bg-gray-50 sticky top-0 z-20">
                        <div className="w-16 shrink-0 border-r border-gray-200"></div> {/* Time Col Placeholder */}
                        {weekDates.map(date => {
                            const isToday = formatDate(date) === todayStr;
                            return (
                                <div key={date.toString()} className="flex-1 text-center py-3 border-r border-gray-200 last:border-r-0">
                                    <div className={`text-xs font-medium uppercase mb-1 ${isToday ? 'text-blue-600' : 'text-gray-500'}`}>
                                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                    </div>
                                    <div className={`text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center mx-auto ${isToday ? 'bg-blue-600 text-white shadow-md' : 'text-gray-900'}`}>
                                        {date.getDate()}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Time Grid */}
                    <div className="flex-1 flex relative min-h-[600px]">
                        {/* Time Column */}
                        <div className="w-16 shrink-0 border-r border-gray-200 bg-white z-10">
                            {hours.map(hour => (
                                <div key={hour} className="h-20 border-b border-gray-100 text-xs text-gray-400 font-medium pr-2 pt-2 text-right relative">
                                    <span className="-top-2.5 relative">{hour}:00</span>
                                </div>
                            ))}
                        </div>

                        {/* Grid Cells */}
                        <div className="flex-1 grid grid-cols-7 divide-x divide-gray-200 relative">
                            {/* Horizontal Lines */}
                            <div className="absolute inset-0 flex flex-col pointer-events-none z-0">
                                {hours.map(h => <div key={h} className="h-20 border-b border-gray-100"></div>)}
                            </div>

                            {/* Event Rendering */}
                            {weekDates.map(date => {
                                const dateStr = formatDate(date);
                                const dayEvents = MOCK_ACTIVITIES.filter(evt => evt.date === dateStr);

                                return (
                                    <div key={date.toString()} className="relative h-full z-10">
                                        {dayEvents.map(evt => {
                                            const startHour = parseInt(evt.time.split(':')[0]);
                                            const startMin = parseInt(evt.time.split(':')[1]);
                                            const top = (startHour - 8) * 80 + (startMin / 60) * 80;
                                            const height = (evt.duration / 60) * 80;

                                            return (
                                                <div 
                                                    key={evt.id}
                                                    className={`absolute left-1 right-1 rounded-md p-2 text-xs border cursor-pointer hover:shadow-lg transition-all group ${getEventStyle(evt.type)}`}
                                                    style={{ top: `${top}px`, height: `${height}px` }}
                                                >
                                                    <div className="font-bold truncate">{evt.time} - {evt.title}</div>
                                                    <div className="truncate opacity-80 mt-0.5">{evt.customerName}</div>
                                                    
                                                    {/* Quick Actions Overlay */}
                                                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex space-x-1">
                                                        <button className="p-1 bg-white rounded-full shadow text-blue-600 hover:bg-blue-50"><Phone size={10} /></button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: TASK LIST (30%) */}
            <div className="w-96 bg-white border-l border-gray-200 flex flex-col shrink-0 z-10 shadow-xl">
                <div className="p-5 border-b border-gray-200 bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center">
                            <CheckSquare className="mr-2 text-purple-600" /> Tasks & To-Dos
                        </h2>
                        <button className="text-gray-400 hover:text-gray-600">
                            <Plus size={20} />
                        </button>
                    </div>

                    <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg">
                        {['TODAY', 'OVERDUE', 'UPCOMING'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setTaskFilter(filter as any)}
                                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                                    taskFilter === filter ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {filter.charAt(0) + filter.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {tasks.length > 0 ? (
                        tasks.map(task => {
                            const Icon = getIcon(task.type);
                            return (
                                <div key={task.id} className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group relative">
                                    <div className="flex items-start space-x-3">
                                        <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center cursor-pointer ${
                                            task.status === 'COMPLETED' ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-blue-500'
                                        }`}>
                                            {task.status === 'COMPLETED' && <CheckCircle2 size={14} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h4 className={`text-sm font-bold truncate ${task.status === 'COMPLETED' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                                    {task.title}
                                                </h4>
                                                {task.priority === 'HIGH' && (
                                                    <AlertCircle size={14} className="text-red-500 flex-shrink-0 ml-2" />
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-0.5">{task.customerName} • {task.time}</p>
                                            
                                            <div className="flex items-center mt-2 space-x-2">
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase flex items-center ${getEventStyle(task.type)}`}>
                                                    <Icon size={10} className="mr-1" /> {task.type.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hover Actions */}
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2 bg-white pl-2">
                                        <button className="text-gray-400 hover:text-blue-600"><Phone size={16} /></button>
                                        <button className="text-gray-400 hover:text-blue-600"><Mail size={16} /></button>
                                        <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={16} /></button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-10 text-gray-400">
                            <CheckCircle2 size={32} className="mx-auto mb-2 opacity-30" />
                            <p className="text-sm">No tasks found for this view.</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default TaskCalendar;