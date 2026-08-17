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
                const validEvents: CalendarEvent[] = [];


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
                    const parsedDate = parse(String(todo.createdAt), 'dd-MM-yyyy HH:mm:ss', new Date());
                    if (!isNaN(parsedDate.getTime())) {
                        validEvents.push({
                            title: todo.title,
                            start: parsedDate,
                            end: parsedDate 
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
                
                date={currentDate} 
                view={currentView}
                onNavigate={(newDate) => setCurrentDate(newDate)}
                onView={(newView) => setCurrentView(newView as any)}
                style={{ height: '100%', width: '80%', backgroundColor: 'white', padding: '10px', borderRadius: '8px', fontSize: '10px', overflow: "auto" }}
            />
        </div>
    );
}