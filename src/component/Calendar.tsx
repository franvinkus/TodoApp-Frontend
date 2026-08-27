import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { getTodos, Todo } from '../app/api';
import { getToken } from '@/utils/Auth';
import { todo } from 'node:test';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  color?: string;
}

interface CalendarProps{
    todos: Todo[];
}

export default function TodoCalendar({ todos }: CalendarProps) {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState<'month' | 'week' | 'work_week' | 'day' | 'agenda'>('month');
    const [isMounted, setIsMounted] = useState(false);
    
    

    useEffect (() => {
        const token = getToken();
        if(!token) return;

        const fetchGetTodo = async () => {
            try{
                const data = await getTodos();
                const pastelColors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
                const validEvents: CalendarEvent[] = [];
                const randomColor = pastelColors[Math.floor(Math.random() * pastelColors.length)];

                // const formattedEvents = data.map((todo) => {
                //     const parsedDate = parse(String(todo.createdAt), 'dd-MM-yyyy HH:mm:ss', new Date());
                //     if (!isNaN(parsedDate.getTime())) {
                //         validEvents.push({
                //             title: todo.title,
                //             start: parsedDate,
                //             end: parsedDate 
                //         });
                //     }
                // }).filter((event) => event !== null);

                todos.forEach((todo) => {
                    const parsedStartDate = parse(String(todo.startDate), 'dd-MM-yyyy HH:mm:ss', new Date());
                    const parsedEndDate = parse(String(todo.endDate), 'dd-MM-yyyy HH:mm:ss', new Date());
                    if (!isNaN(parsedStartDate.getTime())) {
                        let hash = 0;
                        for (let i = 0; i < todo.title.length; i++) {
                            hash = todo.title.charCodeAt(i) + ((hash << 5) - hash);
                        }
                        const index = Math.abs(hash) % pastelColors.length;
                        const uniqueColor = pastelColors[index];
                        validEvents.push({
                            title: todo.title,
                            start: parsedStartDate,
                            end: parsedEndDate,
                            color: uniqueColor
                        });
                    }
                });
                console.log("Data asli dari API:", data);
                setEvents(validEvents);
            }
            catch (error) {
                setError("Error Fetching Data");
            } finally {
                setLoading(false);
            }
        }

        const handler = setTimeout(() => {
            fetchGetTodo();
        })
        return () => clearTimeout(handler);
    }, [todos]); 

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const eventStyleGetter = (event: CalendarEvent) => {
        const style = {
            backgroundColor: event.color,
            borderRadius: '6px',
            opacity: 0.9,
            color: 'white',
            border: 'none',
            display: 'block',
            padding: '2px 5px'
        };

        return {
            style: style
        };
    };

    if (loading) return <div>Memuat kalender...</div>;
    if (error) return <div>{error}</div>;
    if (!isMounted) return null;

    return (
        <div style={{ height: '80vh', padding: '20px', zIndex: 0, width: '100%', justifyItems: 'center', marginBottom: '25px' }}>
            <h2>Calendar</h2>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                eventPropGetter={eventStyleGetter}
                date={currentDate} 
                view={currentView}
                onNavigate={(newDate) => setCurrentDate(newDate)}
                onView={(newView) => setCurrentView(newView as 'month' | 'week' | 'work_week' | 'day' | 'agenda')}
                style={{ height: '100%', width: '80%', backgroundColor: 'white', padding: '10px', borderRadius: '8px', fontSize: '10px', overflow: "auto" }}
            />
        </div>
    );
}