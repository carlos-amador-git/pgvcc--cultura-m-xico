import React, { useMemo, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Plus, Calendar, Video, MapPin, Bell, UserPlus, FileText, Check, AlertTriangle, Clock } from 'lucide-react';
import { ScheduledVisit } from '../types';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

interface CalendarViewProps {
  onClose: () => void;
  onConfirm: (visit: Partial<ScheduledVisit>) => void;
  onMoveVisit?: (visitId: string, updates: Pick<ScheduledVisit, 'date' | 'timeSlot'>) => void | Promise<void>;
  onUpsertVisit?: (visit: ScheduledVisit) => void | Promise<void>;
  onDeleteVisit?: (visitId: string) => void | Promise<void>;
  siteTitle: string;
  isInspection?: boolean;
  scheduledVisits?: ScheduledVisit[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ 
  onClose, 
  onConfirm, 
  onMoveVisit,
  onUpsertVisit,
  onDeleteVisit,
  siteTitle, 
  isInspection = false,
  scheduledVisits = []
}) => {
  // Fecha de referencia "hoy" para la simulación del sistema (17 de Diciembre 2025)
  const TODAY = new Date(2025, 11, 17);
  const [activeDate, setActiveDate] = useState<Date>(() => new Date(2025, 11, 17));
  const [calendarView, setCalendarView] = useState<'Day' | 'Week' | 'Month' | 'Year'>('Day');
  const [activeTab, setActiveTab] = useState<'Evento' | 'Recordatorio'>('Evento');
  const [error, setError] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<{ dateKey: string; hour?: number } | null>(null);
  const [draggingVisitId, setDraggingVisitId] = useState<string | null>(null);
  const [touchDrag, setTouchDrag] = useState<{
    visitId: string;
    pointerId: number;
    isDragging: boolean;
    startX: number;
    startY: number;
    x: number;
    y: number;
  } | null>(null);
  const touchDragRef = useRef(touchDrag);
  touchDragRef.current = touchDrag;
  const dropTargetRef = useRef(dropTarget);
  dropTargetRef.current = dropTarget;
  const calendarNodeRef = useRef<HTMLDivElement>(null);
  
  const [form, setForm] = useState({
    title: isInspection ? `Inspección: ${siteTitle}` : `Visita a ${siteTitle}`,
    location: siteTitle,
    type: isInspection ? 'Revisión Técnica' : 'Escolar',
    time: '09:15 - 10:15',
    requester: ''
  });

  const DEFAULT_LABEL_COLOR = '#ec4899';

  const rgbaFromHex = (hex: string, alpha: number) => {
    const raw = hex.trim();
    const normalized = raw.startsWith('#') ? raw.slice(1) : raw;
    const full =
      normalized.length === 3
        ? normalized
            .split('')
            .map(c => `${c}${c}`)
            .join('')
        : normalized;
    if (full.length !== 6) return null;
    const r = Number.parseInt(full.slice(0, 2), 16);
    const g = Number.parseInt(full.slice(2, 4), 16);
    const b = Number.parseInt(full.slice(4, 6), 16);
    if (![r, g, b].every(Number.isFinite)) return null;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const getVisitTitle = (visit: ScheduledVisit) => visit.title?.trim() || visit.siteTitle;
  const getVisitLocation = (visit: ScheduledVisit) => visit.location?.trim() || visit.siteTitle;
  const getVisitLabelColor = (visit: ScheduledVisit) => visit.labelColor?.trim() || DEFAULT_LABEL_COLOR;

  type EventModalState = {
    mode: 'create' | 'edit';
    visitId?: string;
    title: string;
    description: string;
    dateKey: string;
    startTime: string;
    endTime: string;
    location: string;
    labelColor: string;
    reminders: number[];
  };

  const [eventModal, setEventModal] = useState<EventModalState | null>(null);
  const [confirmDeleteVisitId, setConfirmDeleteVisitId] = useState<string | null>(null);
  const [isSavingEvent, setIsSavingEvent] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [customReminderMinutes, setCustomReminderMinutes] = useState<string>('');

  const draggedVisit = useMemo(() => {
    if (!draggingVisitId) return null;
    return scheduledVisits.find(v => v.id === draggingVisitId) ?? null;
  }, [draggingVisitId, scheduledVisits]);

  const getWeekday = (date: Date) => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[date.getDay()];
  };

  // Rango operativo: 9:00 a 17:00 (basado en Patrimonio.tsx)
  const hours = Array.from({ length: 9 }, (_, i) => i + 9); 
  const OPEN_MINUTES = 9 * 60;
  const CLOSE_MINUTES = 17 * 60;

  const pad2 = (n: number) => n.toString().padStart(2, '0');

  const toDateKey = (date: Date) => {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    return `${y}-${pad2(m)}-${pad2(d)}`;
  };

  const fromDateKey = (dateKey: string) => {
    const [yRaw, mRaw, dRaw] = dateKey.split('-');
    const y = Number(yRaw);
    const m = Number(mRaw);
    const d = Number(dRaw);
    if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return null;
    return new Date(y, m - 1, d);
  };

  const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const isDateSelectable = (date: Date) => startOfDay(date).getTime() >= startOfDay(TODAY).getTime();

  const addDays = (date: Date, daysToAdd: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + daysToAdd);
    return d;
  };

  const addMonths = (date: Date, monthsToAdd: number) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + monthsToAdd);
    return d;
  };

  const addYears = (date: Date, yearsToAdd: number) => {
    const d = new Date(date);
    d.setFullYear(d.getFullYear() + yearsToAdd);
    return d;
  };

  const startOfWeek = (date: Date) => {
    const d = startOfDay(date);
    d.setDate(d.getDate() - d.getDay());
    return d;
  };

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const parseTimeToMinutes = (time: string) => {
    const [hh, mm] = time.trim().split(':');
    const h = Number(hh);
    const m = Number(mm);
    if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
    return h * 60 + m;
  };

  const parseTimeSlot = (timeSlot: string) => {
    const [startRaw, endRaw] = timeSlot.split('-');
    if (!startRaw || !endRaw) return null;
    const start = parseTimeToMinutes(startRaw);
    const end = parseTimeToMinutes(endRaw);
    if (start === null || end === null) return null;
    return { start, end, duration: Math.max(0, end - start) };
  };

  const formatMinutes = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${pad2(h)}:${pad2(m)}`;
  };

  const getStartHourFromTimeSlot = (timeSlot: string) => {
    const parsed = parseTimeSlot(timeSlot);
    if (!parsed) return null;
    return Math.floor(parsed.start / 60);
  };

  const normalizeTimeInput = (time: string) => {
    const minutes = parseTimeToMinutes(time);
    if (minutes === null) return null;
    return formatMinutes(minutes);
  };

  const clampToOperationalRange = (minutes: number) => Math.min(Math.max(minutes, OPEN_MINUTES), CLOSE_MINUTES);

  const openCreateEvent = (dateKey: string, startHour?: number) => {
    const date = fromDateKey(dateKey);
    if (!date) return;
    if (!isDateSelectable(date)) {
      setError('No es posible agendar en fechas pasadas.');
      setTimeout(() => setError(null), 3000);
      return;
    }
    const start = clampToOperationalRange((startHour ?? 9) * 60);
    const end = clampToOperationalRange(Math.min(start + 60, CLOSE_MINUTES));
    const startTime = formatMinutes(start);
    const endTime = formatMinutes(Math.max(end, start + 15));
    setActiveDate(date);
    setCustomReminderMinutes('');
    setEventModal({
      mode: 'create',
      title: '',
      description: '',
      dateKey,
      startTime,
      endTime,
      location: siteTitle,
      labelColor: DEFAULT_LABEL_COLOR,
      reminders: []
    });
  };

  const openEditEvent = (visitId: string) => {
    const visit = scheduledVisits.find(v => v.id === visitId);
    if (!visit) return;
    const parsed = parseTimeSlot(visit.timeSlot);
    if (!parsed) {
      setError('Horario inválido.');
      setTimeout(() => setError(null), 3000);
      return;
    }
    const startTime = formatMinutes(parsed.start);
    const endTime = formatMinutes(parsed.end);
    setCustomReminderMinutes('');
    setEventModal({
      mode: 'edit',
      visitId,
      title: getVisitTitle(visit),
      description: visit.description ?? '',
      dateKey: visit.date,
      startTime,
      endTime,
      location: getVisitLocation(visit),
      labelColor: getVisitLabelColor(visit),
      reminders: Array.isArray(visit.reminders) ? visit.reminders : []
    });
  };

  const validateEventModal = (state: EventModalState) => {
    const title = state.title.trim();
    if (!title) return { ok: false as const, reason: 'El título del evento es obligatorio.' };
    const date = fromDateKey(state.dateKey);
    if (!date) return { ok: false as const, reason: 'Fecha inválida.' };
    if (!isDateSelectable(date)) return { ok: false as const, reason: 'No es posible agendar en fechas pasadas.' };

    const startNormalized = normalizeTimeInput(state.startTime);
    const endNormalized = normalizeTimeInput(state.endTime);
    if (!startNormalized || !endNormalized) return { ok: false as const, reason: 'Formato de hora inválido.' };
    const start = parseTimeToMinutes(startNormalized);
    const end = parseTimeToMinutes(endNormalized);
    if (start === null || end === null) return { ok: false as const, reason: 'Formato de hora inválido.' };
    if (start >= end) return { ok: false as const, reason: 'La hora de inicio debe ser menor que la de fin.' };
    if (start < OPEN_MINUTES || end > CLOSE_MINUTES) return { ok: false as const, reason: 'Horario fuera de rango operativo (9:00 - 17:00).' };

    const overlaps = (aStart: number, aEnd: number, bStart: number, bEnd: number) => Math.max(aStart, bStart) < Math.min(aEnd, bEnd);
    const hasConflict = scheduledVisits.some(v => {
      if (state.mode === 'edit' && v.id === state.visitId) return false;
      if (v.date !== state.dateKey) return false;
      const p = parseTimeSlot(v.timeSlot);
      if (!p) return false;
      return overlaps(start, end, p.start, p.end);
    });
    if (hasConflict) return { ok: false as const, reason: 'Ya existe un evento que se empalma en ese horario.' };

    const reminders = Array.from(new Set(state.reminders.filter(n => Number.isFinite(n) && n > 0))).sort((a, b) => a - b);
    const timeSlot = `${startNormalized} - ${endNormalized}`;
    return { ok: true as const, title, dateKey: state.dateKey, timeSlot, reminders, start, end };
  };

  const upsertFromModal = async () => {
    if (!eventModal) return;
    const validation = validateEventModal(eventModal);
    if (!validation.ok) {
      setError(validation.reason);
      setTimeout(() => setError(null), 3000);
      return;
    }
    if (!onUpsertVisit) {
      setError('No se pudo guardar el evento.');
      setTimeout(() => setError(null), 3000);
      return;
    }
    const existing = eventModal.mode === 'edit' && eventModal.visitId ? scheduledVisits.find(v => v.id === eventModal.visitId) : null;
    const id = existing?.id ?? Math.random().toString(36).slice(2, 10);
    const next: ScheduledVisit = {
      id,
      siteId: existing?.siteId ?? 0,
      siteTitle: existing?.siteTitle ?? siteTitle,
      date: validation.dateKey,
      timeSlot: validation.timeSlot,
      type: existing?.type ?? (isInspection ? 'Revisión Técnica' : 'Evento'),
      status: existing?.status ?? 'Confirmed',
      requesterName: existing?.requesterName ?? 'Usuario Web',
      title: validation.title,
      description: eventModal.description.trim() || undefined,
      location: eventModal.location.trim() || undefined,
      labelColor: eventModal.labelColor.trim() || DEFAULT_LABEL_COLOR,
      reminders: validation.reminders.length > 0 ? validation.reminders : undefined
    };
    setIsSavingEvent(true);
    try {
      await onUpsertVisit(next);
      setEventModal(null);
      setSuccessToast(existing ? 'Evento actualizado.' : 'Evento creado.');
      setTimeout(() => setSuccessToast(null), 2500);
    } catch {
      setError('No se pudo guardar el evento.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsSavingEvent(false);
    }
  };

  const deleteFromModal = async (visitId: string) => {
    if (!onDeleteVisit) {
      setError('No se pudo eliminar el evento.');
      setTimeout(() => setError(null), 3000);
      return;
    }
    setIsSavingEvent(true);
    try {
      await onDeleteVisit(visitId);
      setEventModal(null);
      setSuccessToast('Evento eliminado.');
      setTimeout(() => setSuccessToast(null), 2500);
    } catch {
      setError('No se pudo eliminar el evento.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsSavingEvent(false);
    }
  };

  const closeEventModal = () => {
    setEventModal(null);
    setConfirmDeleteVisitId(null);
  };

  const toggleReminder = (minutes: number) => {
    setEventModal(prev => {
      if (!prev) return prev;
      const has = prev.reminders.includes(minutes);
      const reminders = has ? prev.reminders.filter(r => r !== minutes) : [...prev.reminders, minutes];
      return { ...prev, reminders };
    });
  };

  const addCustomReminder = () => {
    if (!eventModal) return;
    const raw = customReminderMinutes.trim();
    if (!raw) return;
    const minutes = Number(raw);
    if (!Number.isFinite(minutes) || minutes <= 0) {
      setError('El recordatorio debe ser un número positivo (minutos).');
      setTimeout(() => setError(null), 3000);
      return;
    }
    toggleReminder(Math.round(minutes));
    setCustomReminderMinutes('');
  };

  const PRESET_REMINDERS = [5, 10, 30, 60, 1440];

  const eventIndex = useMemo(() => {
    const byDate = new Map<string, ScheduledVisit[]>();
    const byDateHour = new Map<string, ScheduledVisit[]>();
    const countByDate = new Map<string, number>();
    const countByMonth = new Map<string, number>();

    for (const visit of scheduledVisits) {
      const list = byDate.get(visit.date);
      if (list) list.push(visit);
      else byDate.set(visit.date, [visit]);

      countByDate.set(visit.date, (countByDate.get(visit.date) ?? 0) + 1);

      const d = fromDateKey(visit.date);
      if (d) {
        const monthKey = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
        countByMonth.set(monthKey, (countByMonth.get(monthKey) ?? 0) + 1);
      }

      const startHour = getStartHourFromTimeSlot(visit.timeSlot);
      if (startHour !== null) {
        const key = `${visit.date}|${startHour}`;
        const hourList = byDateHour.get(key);
        if (hourList) hourList.push(visit);
        else byDateHour.set(key, [visit]);
      }
    }

    return { byDate, byDateHour, countByDate, countByMonth };
  }, [scheduledVisits]);

  const isDropValid = (visitId: string, dateKey: string, hour: number) => {
    const targetDate = fromDateKey(dateKey);
    if (!targetDate) return { ok: false, reason: 'Fecha inválida.' as const };
    if (!isDateSelectable(targetDate)) return { ok: false, reason: 'No es posible agendar en fechas pasadas.' as const };
    const visit = scheduledVisits.find(v => v.id === visitId);
    if (!visit) return { ok: false, reason: 'Evento no encontrado.' as const };
    const parsed = parseTimeSlot(visit.timeSlot);
    if (!parsed) return { ok: false, reason: 'Horario inválido.' as const };
    const start = hour * 60;
    const end = start + parsed.duration;
    if (start < OPEN_MINUTES || start >= CLOSE_MINUTES || end > CLOSE_MINUTES) {
      return { ok: false, reason: 'Horario fuera de rango operativo (9:00 - 17:00).' as const };
    }
    const timeSlot = `${formatMinutes(start)} - ${formatMinutes(end)}`;
    const overlaps = (aStart: number, aEnd: number, bStart: number, bEnd: number) => Math.max(aStart, bStart) < Math.min(aEnd, bEnd);
    const conflict = scheduledVisits.some(v => {
      if (v.id === visitId) return false;
      if (v.date !== dateKey) return false;
      const p = parseTimeSlot(v.timeSlot);
      if (!p) return false;
      return overlaps(start, end, p.start, p.end);
    });
    if (conflict) return { ok: false, reason: 'Ya existe un evento en ese horario.' as const };
    return { ok: true as const, date: dateKey, timeSlot };
  };

  const commitMove = async (visitId: string, dateKey: string, hour: number) => {
    const validation = isDropValid(visitId, dateKey, hour);
    if (!validation.ok) {
      setError(validation.reason);
      setTimeout(() => setError(null), 3000);
      return;
    }
    if (!onMoveVisit) {
      setError('No se pudo actualizar el evento.');
      setTimeout(() => setError(null), 3000);
      return;
    }
    try {
      await onMoveVisit(visitId, { date: validation.date, timeSlot: validation.timeSlot });
    } catch {
      setError('No se pudo actualizar el evento.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDateSelect = (date: Date) => {
    if (!isDateSelectable(date)) {
      setError('No es posible agendar en fechas pasadas.');
      setTimeout(() => setError(null), 3000);
      return;
    }
    setActiveDate(date);
    setError(null);
  };

  const handleDragStart = (e: React.DragEvent, visitId: string) => {
    setDraggingVisitId(visitId);
    setDropTarget(null);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify({ visitId }));
  };

  const handleDragEnd = () => {
    setDraggingVisitId(null);
    setDropTarget(null);
  };

  const handleDragEnterDate = (dateKey: string) => {
    const date = fromDateKey(dateKey);
    if (!date) return;
    if (!isDateSelectable(date)) return;
    setActiveDate(date);
    setDropTarget(prev => (prev?.dateKey === dateKey ? prev : { dateKey }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnHour = async (e: React.DragEvent, dateKey: string, hour: number) => {
    e.preventDefault();
    let visitId = draggingVisitId;
    const raw = e.dataTransfer.getData('application/json');
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { visitId?: string };
        if (parsed?.visitId) visitId = parsed.visitId;
      } catch {}
    }
    if (!visitId) return;
    await commitMove(visitId, dateKey, hour);
    setDraggingVisitId(null);
    setDropTarget(null);
  };

  const handleDropOnDay = async (e: React.DragEvent, dateKey: string) => {
    e.preventDefault();
    let visitId = draggingVisitId;
    const raw = e.dataTransfer.getData('application/json');
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { visitId?: string };
        if (parsed?.visitId) visitId = parsed.visitId;
      } catch {}
    }
    if (!visitId) return;
    const visit = scheduledVisits.find(v => v.id === visitId);
    if (!visit) return;
    const targetDate = fromDateKey(dateKey);
    if (!targetDate) return;
    if (!isDateSelectable(targetDate)) {
      setError('No es posible agendar en fechas pasadas.');
      setTimeout(() => setError(null), 3000);
      return;
    }
    if (!onMoveVisit) {
      setError('No se pudo actualizar el evento.');
      setTimeout(() => setError(null), 3000);
      return;
    }
    const parsed = parseTimeSlot(visit.timeSlot);
    const overlaps = (aStart: number, aEnd: number, bStart: number, bEnd: number) => Math.max(aStart, bStart) < Math.min(aEnd, bEnd);
    const conflict = scheduledVisits.some(v => {
      if (v.id === visitId) return false;
      if (v.date !== dateKey) return false;
      const p = parseTimeSlot(v.timeSlot);
      if (!p || !parsed) return false;
      return overlaps(parsed.start, parsed.end, p.start, p.end);
    });
    if (conflict) {
      setError('Ya existe un evento en ese horario.');
      setTimeout(() => setError(null), 3000);
      return;
    }
    try {
      await onMoveVisit(visitId, { date: dateKey, timeSlot: visit.timeSlot });
      setActiveDate(targetDate);
    } catch {
      setError('No se pudo actualizar el evento.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setDraggingVisitId(null);
      setDropTarget(null);
    }
  };

  const updateTouchHover = (clientX: number, clientY: number) => {
    const el = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
    const hourEl = el?.closest?.('[data-drop-hour][data-drop-date]') as HTMLElement | null;
    if (hourEl) {
      const dateKey = hourEl.getAttribute('data-drop-date');
      const hourAttr = hourEl.getAttribute('data-drop-hour');
      const hour = hourAttr ? Number(hourAttr) : NaN;
      if (dateKey && Number.isFinite(hour)) {
        setDropTarget({ dateKey, hour });
        return;
      }
    }
    const dateEl = el?.closest?.('[data-drop-date]') as HTMLElement | null;
    if (dateEl) {
      const dateKey = dateEl.getAttribute('data-drop-date');
      if (dateKey) {
        const date = fromDateKey(dateKey);
        if (date && isDateSelectable(date)) setActiveDate(date);
        setDropTarget({ dateKey });
        return;
      }
    }
    setDropTarget(null);
  };

  const handleTouchPointerDown = (e: React.PointerEvent, visitId: string) => {
    if (e.pointerType !== 'touch') return;
    setDraggingVisitId(visitId);
    setDropTarget(null);
    e.currentTarget.setPointerCapture(e.pointerId);
    setTouchDrag({
      visitId,
      pointerId: e.pointerId,
      isDragging: false,
      startX: e.clientX,
      startY: e.clientY,
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleTouchPointerMove = (e: React.PointerEvent) => {
    const current = touchDragRef.current;
    if (!current || e.pointerId !== current.pointerId) return;
    const dx = e.clientX - current.startX;
    const dy = e.clientY - current.startY;
    const distance = Math.hypot(dx, dy);
    const nextIsDragging = current.isDragging || distance >= 8;
    if (nextIsDragging) e.preventDefault();
    const next = { ...current, isDragging: nextIsDragging, x: e.clientX, y: e.clientY };
    setTouchDrag(next);
    if (nextIsDragging) updateTouchHover(e.clientX, e.clientY);
  };

  const handleTouchPointerUp = async (e: React.PointerEvent) => {
    const current = touchDragRef.current;
    if (!current || e.pointerId !== current.pointerId) return;
    if (!current.isDragging) {
      setTouchDrag(null);
      setDraggingVisitId(null);
      setDropTarget(null);
      openEditEvent(current.visitId);
      return;
    }
    const target = dropTargetRef.current;
    if (current.isDragging && target?.hour !== undefined) {
      await commitMove(current.visitId, target.dateKey, target.hour);
    } else if (current.isDragging && target?.hour === undefined && target?.dateKey !== undefined) {
      const visit = scheduledVisits.find(v => v.id === current.visitId);
      const targetDate = fromDateKey(target.dateKey);
      if (visit && onMoveVisit && targetDate && isDateSelectable(targetDate)) {
        const parsed = parseTimeSlot(visit.timeSlot);
        const overlaps = (aStart: number, aEnd: number, bStart: number, bEnd: number) => Math.max(aStart, bStart) < Math.min(aEnd, bEnd);
        const conflict = scheduledVisits.some(v => {
          if (v.id === current.visitId) return false;
          if (v.date !== target.dateKey) return false;
          const p = parseTimeSlot(v.timeSlot);
          if (!p || !parsed) return false;
          return overlaps(parsed.start, parsed.end, p.start, p.end);
        });
        if (!conflict) {
          try {
            await onMoveVisit(current.visitId, { date: target.dateKey, timeSlot: visit.timeSlot });
            setActiveDate(targetDate);
          } catch {
            setError('No se pudo actualizar el evento.');
            setTimeout(() => setError(null), 3000);
          }
        } else {
          setError('Ya existe un evento en ese horario.');
          setTimeout(() => setError(null), 3000);
        }
      } else if (targetDate && !isDateSelectable(targetDate)) {
        setError('No es posible agendar en fechas pasadas.');
        setTimeout(() => setError(null), 3000);
      }
    }
    setTouchDrag(null);
    setDraggingVisitId(null);
    setDropTarget(null);
  };

  const activeDateKey = toDateKey(activeDate);
  const todayKey = toDateKey(TODAY);

  const miniMonthDate = useMemo(() => new Date(activeDate.getFullYear(), activeDate.getMonth(), 1), [activeDate]);

  const miniMonthLabel = useMemo(() => {
    return `${monthNames[miniMonthDate.getMonth()]} ${miniMonthDate.getFullYear()}`;
  }, [miniMonthDate, monthNames]);

  const miniMonthCells = useMemo(() => {
    const year = miniMonthDate.getFullYear();
    const month = miniMonthDate.getMonth();
    const first = new Date(year, month, 1);
    const startOffset = first.getDay();
    const cells: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const dayOfMonth = i - startOffset + 1;
      cells.push(new Date(year, month, dayOfMonth));
    }
    return cells;
  }, [miniMonthDate]);

  const handleMiniPrevMonth = () => setActiveDate(prev => addMonths(prev, -1));
  const handleMiniNextMonth = () => setActiveDate(prev => addMonths(prev, 1));

  const headerTitle = useMemo(() => {
    if (calendarView === 'Year') return `${activeDate.getFullYear()}`;
    if (calendarView === 'Month') return `${monthNames[activeDate.getMonth()]} ${activeDate.getFullYear()}`;
    if (calendarView === 'Week') {
      const weekStart = startOfWeek(activeDate);
      const weekEnd = addDays(weekStart, 6);
      const sameMonth = weekStart.getMonth() === weekEnd.getMonth();
      const monthLabel = sameMonth ? monthNames[weekStart.getMonth()] : `${monthNames[weekStart.getMonth()]} / ${monthNames[weekEnd.getMonth()]}`;
      return `${weekStart.getDate()}–${weekEnd.getDate()} ${monthLabel} ${weekEnd.getFullYear()}`;
    }
    return `${activeDate.getDate()} ${monthNames[activeDate.getMonth()]} ${activeDate.getFullYear()}`;
  }, [activeDate, calendarView, monthNames]);

  const headerSubtitle = useMemo(() => {
    if (calendarView === 'Day') return getWeekday(activeDate);
    if (calendarView === 'Week') return 'Semana';
    if (calendarView === 'Month') return 'Mes';
    return 'Año';
  }, [activeDate, calendarView]);

  const handlePrev = () => {
    setActiveDate(prev => {
      if (calendarView === 'Year') return addYears(prev, -1);
      if (calendarView === 'Month') return addMonths(prev, -1);
      if (calendarView === 'Week') return addDays(prev, -7);
      return addDays(prev, -1);
    });
  };

  const handleNext = () => {
    setActiveDate(prev => {
      if (calendarView === 'Year') return addYears(prev, 1);
      if (calendarView === 'Month') return addMonths(prev, 1);
      if (calendarView === 'Week') return addDays(prev, 7);
      return addDays(prev, 1);
    });
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950/40 backdrop-blur-md flex items-center justify-center p-4 lg:p-10 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-7xl h-full max-h-[90vh] overflow-hidden flex flex-col lg:flex-row animate-in zoom-in-95 duration-500">
        
        {/* BARRA LATERAL (Mini Calendario y Navegación) */}
        <div className="w-full lg:w-64 bg-slate-50 border-r border-slate-100 flex flex-col p-6 shrink-0">
          <div className="flex items-center justify-between mb-8">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
            </div>
            <div className="flex gap-4">
               <button
                 onClick={() => openCreateEvent(activeDateKey, 9)}
                 className="h-5 w-5 text-slate-400 hover:text-slate-600"
                 aria-label="Crear evento"
               >
                 <Plus className="w-full h-full" />
               </button>
            </div>
          </div>

          <div className="bg-brand-500 text-white rounded-xl p-3 flex items-center justify-between shadow-lg shadow-brand-500/20 mb-10 cursor-pointer">
            <span className="text-xs font-bold uppercase tracking-wider">NUEVO</span>
            <span className="text-[10px] font-bold opacity-80">Respondido</span>
          </div>

          {/* Widget de Mini Calendario */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <button onClick={handleMiniPrevMonth} className="p-1 rounded-md hover:bg-slate-100 transition-colors">
                <ChevronLeft className="w-4 h-4 text-slate-400" />
              </button>
              <span className="text-xs font-bold text-slate-700">{miniMonthLabel}</span>
              <button onClick={handleMiniNextMonth} className="p-1 rounded-md hover:bg-slate-100 transition-colors">
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(d => (
                <span key={d} className="text-[8px] font-bold text-slate-300 mb-2">{d}</span>
              ))}
              {miniMonthCells.map((cellDate) => {
                const dateKey = toDateKey(cellDate);
                const isInMonth = cellDate.getMonth() === miniMonthDate.getMonth();
                const isPast = !isDateSelectable(cellDate);
                const isSelected = dateKey === activeDateKey;
                return (
                  <span 
                    key={dateKey}
                    onClick={() => handleDateSelect(cellDate)}
                    onDragOver={handleDragOver}
                    onDragEnter={() => handleDragEnterDate(dateKey)}
                    onDrop={(e) => handleDropOnDay(e, dateKey)}
                    data-drop-date={dateKey}
                    className={`text-[10px] py-1.5 rounded-full transition-all relative ${
                      !isInMonth
                        ? 'text-slate-200'
                        : isPast
                          ? 'text-slate-200 cursor-not-allowed'
                          : 'text-slate-600 hover:bg-slate-200 cursor-pointer'
                    } ${isSelected ? 'bg-brand-500 text-white font-bold' : ''}`}
                  >
                    {cellDate.getDate()}
                    {dateKey === todayKey && !isSelected && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-500 rounded-full"></span>
                    )}
                    {dropTarget?.dateKey === dateKey && dropTarget.hour === undefined && draggingVisitId && !isPast && (
                      <span className="absolute inset-0 rounded-full ring-2 ring-brand-400/70 pointer-events-none" />
                    )}
                  </span>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="mt-auto p-4 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-3 animate-in slide-in-from-bottom-2">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-[10px] font-bold text-red-600 leading-tight uppercase tracking-tight">{error}</p>
            </div>
          )}
        </div>

        {/* VISTA CENTRAL (Calendario) */}
        <div className="flex-1 bg-white flex flex-col overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <button onClick={() => openCreateEvent(activeDateKey, 9)} className="p-3 bg-slate-100 rounded-full hover:bg-slate-200" aria-label="Crear evento">
                <Plus className="w-5 h-5 text-slate-500" />
              </button>
              <div>
                <h2 className="text-4xl font-serif font-bold text-slate-900 leading-none">{headerTitle}</h2>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">{headerSubtitle}</p>
              </div>
              <div className="flex items-center gap-2 ml-2">
                <button onClick={handlePrev} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                  <ChevronLeft className="w-4 h-4 text-slate-500" />
                </button>
                <button onClick={handleNext} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {[{ en: 'Day', es: 'Día' }, { en: 'Week', es: 'Semana' }, { en: 'Month', es: 'Mes' }, { en: 'Year', es: 'Año' }].map(view => (
                <button
                  key={view.en}
                  onClick={() => setCalendarView(view.en as 'Day' | 'Week' | 'Month' | 'Year')}
                  className={`px-5 py-1.5 text-[10px] font-bold rounded-lg transition-all ${calendarView === view.en ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {view.es}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 bg-slate-50/20">
            <SwitchTransition mode="out-in">
              <CSSTransition key={calendarView} nodeRef={calendarNodeRef} timeout={350} classNames="calendar-transition" unmountOnExit>
                <div ref={calendarNodeRef} className="min-h-[400px]">
                  {calendarView === 'Day' ? (
                    <div className="space-y-0 relative">
                      <div className="absolute left-[70px] top-0 bottom-0 w-px bg-slate-100" />
                      <div className="h-10 flex items-center mb-4">
                        <span className="w-[70px] text-[10px] font-bold text-slate-300 text-right pr-4 uppercase">todo el día</span>
                        <div className="flex-1 h-[1px] bg-slate-100" />
                      </div>

                      {hours.map(hour => {
                        const dayVisits = eventIndex.byDateHour.get(`${activeDateKey}|${hour}`) ?? [];
                        return (
                          <div key={hour} className="group h-24 flex items-start border-t border-slate-50/50">
                            <span className="w-[70px] text-[10px] font-bold text-slate-300 text-right pr-4 pt-2 uppercase">{hour}:00</span>
                            <div
                              className="flex-1 relative h-full"
                              data-drop-date={activeDateKey}
                              data-drop-hour={hour}
                              onDragOver={handleDragOver}
                              onDragEnter={() => setDropTarget({ dateKey: activeDateKey, hour })}
                              onDrop={(e) => handleDropOnHour(e, activeDateKey, hour)}
                              onClick={() => {
                                if (draggingVisitId || touchDrag?.isDragging) return;
                                openCreateEvent(activeDateKey, hour);
                              }}
                            >
                              {dropTarget?.dateKey === activeDateKey && dropTarget.hour === hour && draggingVisitId && (
                                <div className="absolute inset-x-4 top-4 bottom-4 rounded-2xl ring-2 ring-brand-400/70 bg-brand-500/10 pointer-events-none" />
                              )}
                              {dayVisits.map((visit) => (
                                <div
                                  key={visit.id}
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, visit.id)}
                                  onDragEnd={handleDragEnd}
                                  onPointerDown={(e) => handleTouchPointerDown(e, visit.id)}
                                  onPointerMove={handleTouchPointerMove}
                                  onPointerUp={handleTouchPointerUp}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (draggingVisitId || touchDrag?.isDragging) return;
                                    openEditEvent(visit.id);
                                  }}
                                  className={`absolute inset-x-4 top-4 bottom-4 backdrop-blur rounded-2xl p-4 text-white shadow-xl shadow-brand-500/20 animate-in slide-in-from-left duration-300 border border-white/20 cursor-grab active:cursor-grabbing select-none ${draggingVisitId === visit.id ? 'opacity-60 shadow-2xl shadow-brand-500/30' : ''} ${touchDrag?.visitId === visit.id && touchDrag.isDragging ? 'pointer-events-none' : ''}`}
                                  style={{
                                    backgroundColor: rgbaFromHex(getVisitLabelColor(visit), 0.9) ?? 'rgba(236, 72, 153, 0.9)',
                                    touchAction: touchDrag?.visitId === visit.id && touchDrag.isDragging ? 'none' : undefined
                                  }}
                                >
                                  <div className="font-bold text-xs">{getVisitTitle(visit)}</div>
                                  <div className="text-[10px] opacity-90 mt-1">{visit.requesterName}</div>
                                  <div className="text-[8px] font-bold uppercase tracking-widest mt-2 bg-white/20 inline-block px-2 py-0.5 rounded">{visit.status === 'Confirmed' ? 'Confirmado' : 'Pendiente'}</div>
                                </div>
                              ))}
                              <div className="absolute inset-0 group-hover:bg-slate-100/50 transition-colors pointer-events-none" />
                            </div>
                          </div>
                        );
                      })}
                      <div className="h-10 flex items-center border-t border-slate-100 pt-4">
                        <span className="w-[70px] text-[10px] font-bold text-slate-300 text-right pr-4 uppercase italic opacity-50">Cierre</span>
                        <div className="flex-1 h-[1px] bg-slate-50" />
                      </div>
                    </div>
                  ) : calendarView === 'Week' ? (
                    <div className="overflow-x-auto">
                      <div className="min-w-[900px]">
                        <div className="grid grid-cols-[70px_repeat(7,minmax(120px,1fr))] gap-2 mb-4">
                          <div />
                          {Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(activeDate), i)).map((d) => {
                            const key = toDateKey(d);
                            const isSelected = key === activeDateKey;
                            return (
                              <button
                                key={key}
                                onClick={() => setActiveDate(d)}
                                className={`px-3 py-2 rounded-xl border text-left transition-colors ${isSelected ? 'bg-brand-500 text-white border-brand-500' : 'bg-white border-slate-100 hover:bg-slate-50'}`}
                              >
                                <div className="text-[9px] font-black uppercase tracking-widest opacity-80">{getWeekday(d).slice(0, 3)}</div>
                                <div className="text-xs font-bold">{d.getDate()}</div>
                              </button>
                            );
                          })}
                        </div>

                        <div className="space-y-2">
                          {hours.map(hour => (
                            <div key={hour} className="grid grid-cols-[70px_repeat(7,minmax(120px,1fr))] gap-2">
                              <div className="text-[10px] font-bold text-slate-300 text-right pr-4 pt-3 uppercase">{hour}:00</div>
                              {Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(activeDate), i)).map((d) => {
                                const key = toDateKey(d);
                                const visits = eventIndex.byDateHour.get(`${key}|${hour}`) ?? [];
                                const first = visits[0];
                                return (
                                  <div
                                    key={`${key}|${hour}`}
                                    className="relative bg-white border border-slate-100 rounded-2xl min-h-[52px] p-2"
                                    data-drop-date={key}
                                    data-drop-hour={hour}
                                    onDragOver={handleDragOver}
                                    onDragEnter={() => {
                                      setActiveDate(d);
                                      setDropTarget({ dateKey: key, hour });
                                    }}
                                    onDrop={(e) => handleDropOnHour(e, key, hour)}
                                    onClick={() => {
                                      if (draggingVisitId || touchDrag?.isDragging) return;
                                      openCreateEvent(key, hour);
                                    }}
                                  >
                                    {dropTarget?.dateKey === key && dropTarget.hour === hour && draggingVisitId && (
                                      <div className="absolute inset-1 rounded-2xl ring-2 ring-brand-400/70 bg-brand-500/10 pointer-events-none" />
                                    )}
                                    {first ? (
                                      <div
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, first.id)}
                                        onDragEnd={handleDragEnd}
                                        onPointerDown={(e) => handleTouchPointerDown(e, first.id)}
                                        onPointerMove={handleTouchPointerMove}
                                        onPointerUp={handleTouchPointerUp}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (draggingVisitId || touchDrag?.isDragging) return;
                                          openEditEvent(first.id);
                                        }}
                                        className={`relative text-white rounded-xl px-2 py-1 shadow-sm cursor-grab active:cursor-grabbing select-none ${draggingVisitId === first.id ? 'opacity-60 shadow-md shadow-brand-500/30' : ''} ${touchDrag?.visitId === first.id && touchDrag.isDragging ? 'pointer-events-none' : ''}`}
                                        style={{
                                          backgroundColor: rgbaFromHex(getVisitLabelColor(first), 0.9) ?? 'rgba(236, 72, 153, 0.9)',
                                          touchAction: touchDrag?.visitId === first.id && touchDrag.isDragging ? 'none' : undefined
                                        }}
                                      >
                                        <div className="text-[10px] font-bold truncate">{getVisitTitle(first)}</div>
                                        {visits.length > 1 && <div className="text-[9px] opacity-80 font-bold">+{visits.length - 1}</div>}
                                      </div>
                                    ) : (
                                      <div className="h-full w-full rounded-xl bg-slate-50/40" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : calendarView === 'Month' ? (
                    <div>
                      <div className="grid grid-cols-7 gap-3">
                        {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(d => (
                          <div key={d} className="text-[9px] font-black text-slate-300 uppercase tracking-widest text-center">{d}</div>
                        ))}
                        {miniMonthCells.map((cellDate) => {
                          const key = toDateKey(cellDate);
                          const isInMonth = cellDate.getMonth() === activeDate.getMonth();
                          const isSelected = key === activeDateKey;
                          const isPast = !isDateSelectable(cellDate);
                          const count = eventIndex.countByDate.get(key) ?? 0;
                          return (
                            <button
                              key={key}
                              onClick={() => openCreateEvent(key)}
                              disabled={isPast}
                              className={`relative aspect-square rounded-2xl border transition-all ${isSelected ? 'bg-brand-500 text-white border-brand-500 shadow-xl shadow-brand-500/20' : 'bg-white border-slate-100 hover:bg-slate-50'} ${isInMonth ? '' : 'opacity-40'} ${isPast ? 'cursor-not-allowed opacity-40' : ''}`}
                            >
                              <div className="absolute top-2 left-2 text-[10px] font-bold">{cellDate.getDate()}</div>
                              {count > 0 && (
                                <div className={`absolute top-2 right-2 text-[9px] font-black px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-brand-50 text-brand-700 border border-brand-100'}`}>
                                  {count}
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {Array.from({ length: 12 }, (_, month) => {
                        const monthStart = new Date(activeDate.getFullYear(), month, 1);
                        const monthLabel = monthNames[month];
                        const cells: Date[] = [];
                        const first = new Date(activeDate.getFullYear(), month, 1);
                        const startOffset = first.getDay();
                        for (let i = 0; i < 42; i++) {
                          const dayOfMonth = i - startOffset + 1;
                          cells.push(new Date(activeDate.getFullYear(), month, dayOfMonth));
                        }
                        const monthCount = eventIndex.countByMonth.get(`${activeDate.getFullYear()}-${pad2(month + 1)}`) ?? 0;
                        return (
                          <div key={month} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                            <button
                              onClick={() => {
                                setActiveDate(monthStart);
                                setCalendarView('Month');
                              }}
                              className="w-full flex items-center justify-between mb-4"
                            >
                              <div className="text-sm font-black text-slate-900 uppercase tracking-widest">{monthLabel}</div>
                              <div className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{monthCount}</div>
                            </button>
                            <div className="grid grid-cols-7 gap-1">
                              {cells.map((cellDate) => {
                                const key = toDateKey(cellDate);
                                const isInMonth = cellDate.getMonth() === month;
                                const isSelected = key === activeDateKey;
                                const isPast = !isDateSelectable(cellDate);
                                const hasEvent = (eventIndex.countByDate.get(key) ?? 0) > 0;
                                return (
                                  <button
                                    key={key}
                                    onClick={() => openCreateEvent(key)}
                                    disabled={isPast}
                                    className={`relative text-[9px] font-bold py-1 rounded-lg transition-colors ${isSelected ? 'bg-brand-500 text-white' : 'text-slate-600 hover:bg-slate-100'} ${isInMonth ? '' : 'opacity-30'} ${isPast ? 'cursor-not-allowed opacity-40' : ''}`}
                                  >
                                    {cellDate.getDate()}
                                    {hasEvent && isInMonth && (
                                      <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-brand-500'}`} />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </CSSTransition>
            </SwitchTransition>
          </div>
        </div>

        {/* PANEL DERECHO (Detalles del Evento / Formulario / Recordatorios) */}
        <div className="w-full lg:w-[400px] bg-white border-l border-slate-100 flex flex-col overflow-y-auto">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between shrink-0">
            <div className="flex bg-slate-100 p-1 rounded-2xl w-full">
              <button onClick={() => setActiveTab('Evento')} className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${activeTab === 'Evento' ? 'bg-brand-500 text-white shadow-lg' : 'text-slate-400'}`}>Evento</button>
              <button onClick={() => setActiveTab('Recordatorio')} className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${activeTab === 'Recordatorio' ? 'bg-brand-500 text-white shadow-lg' : 'text-slate-400'}`}>Recordatorio</button>
            </div>
            <button onClick={onClose} className="ml-4 p-2 bg-slate-50 rounded-full hover:bg-slate-100 text-slate-400"><X className="w-5 h-5" /></button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === 'Evento' ? (
              <div className="p-8 space-y-8 animate-in fade-in duration-300">
                <div className="space-y-4">
                    <div className="relative">
                      <input 
                        type="text" 
                        value={form.title} 
                        onChange={(e) => setForm({...form, title: e.target.value})}
                        placeholder={isInspection ? "Nueva Inspección" : "Nuevo Evento"}
                        className="w-full text-2xl font-serif font-bold text-slate-900 border-none focus:ring-0 p-0 placeholder-slate-200"
                      />
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-brand-500 shadow-sm" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isInspection ? 'Técnico' : 'Patrimonio'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 pb-4 border-b border-slate-100">
                        <MapPin className="w-4 h-4" />
                        <input 
                            type="text" 
                            value={form.location}
                            placeholder="Agregar ubicación"
                            className="text-xs font-medium border-none focus:ring-0 p-0 w-full placeholder-slate-300"
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-slate-900">{getWeekday(activeDate)}, {activeDate.getDate()} de {monthNames[activeDate.getMonth()]} de {activeDate.getFullYear()}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Alerta 5 minutos antes <span className="opacity-50">(predeterminado)</span></p>
                        </div>
                        <span className="text-xs font-bold text-slate-700">{form.time}</span>
                    </div>
                    
                    <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4 text-slate-400 border border-dashed border-slate-200">
                        <Bell className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-center">Agregar alerta o tiempo de viaje</span>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-4 py-3 border-b border-slate-100 text-slate-300">
                          <UserPlus className="w-4 h-4" />
                          <input 
                            type="text" 
                            placeholder={isInspection ? "Responsable de inspección" : "Nombre del solicitante"} 
                            className="text-xs font-bold border-none focus:ring-0 p-0 w-full placeholder-slate-200 text-slate-700"
                            value={form.requester}
                            onChange={(e) => setForm({...form, requester: e.target.value})}
                          />
                      </div>
                      <div className="flex items-center gap-4 py-3 border-b border-slate-100 text-slate-300">
                          <FileText className="w-4 h-4" />
                          <select 
                            className="text-[10px] font-black uppercase tracking-widest border-none focus:ring-0 p-0 w-full bg-transparent text-slate-500"
                            value={form.type}
                            onChange={(e) => setForm({...form, type: e.target.value})}
                          >
                            {isInspection ? (
                              <>
                                <option value="Revisión Técnica">Revisión Técnica</option>
                                <option value="Mantenimiento Preventivo">Mantenimiento Preventivo</option>
                                <option value="Dictamen Estructural">Dictamen Estructural</option>
                                <option value="Auditoría PAICE">Auditoría PAICE</option>
                              </>
                            ) : (
                              <>
                                <option value="Individual">Visita Individual</option>
                                <option value="Escolar">Visita Escolar</option>
                                <option value="Investigación">Acceso Investigación</option>
                              </>
                            )}
                          </select>
                      </div>
                    </div>
                </div>
              </div>
            ) : (
              <div className="p-8 space-y-6 animate-in slide-in-from-right duration-300">
                <div className="flex items-center justify-between border-b pb-4">
                  <h3 className="font-serif font-bold text-slate-900 text-xl tracking-tight">Citas Agendadas</h3>
                  <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">{scheduledVisits.length}</span>
                </div>
                
                {scheduledVisits.length > 0 ? (
                  <div className="space-y-4">
                    {scheduledVisits.map((visit) => (
                      <div
                        key={visit.id}
                        onClick={() => {
                          if (draggingVisitId || touchDrag?.isDragging) return;
                          openEditEvent(visit.id);
                        }}
                        className="p-5 bg-slate-50 border border-slate-100 rounded-3xl hover:border-brand-200 transition-all group cursor-pointer"
                      >
                         <div className="flex justify-between items-start mb-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${visit.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {visit.status === 'Confirmed' ? 'Confirmado' : 'Pendiente'}
                            </span>
                            <div className="text-[9px] font-bold text-slate-400 flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {visit.timeSlot}</div>
                         </div>
                         <h4 className="font-bold text-slate-900 text-sm mb-1">{getVisitTitle(visit)}</h4>
                         <div className="flex flex-col gap-1 text-[10px] text-slate-500 font-medium">
                            <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-slate-300" /> {visit.date}</div>
                            <div className="flex items-center gap-1.5"><UserPlus className="w-3 h-3 text-slate-300" /> {visit.requesterName}</div>
                            <div className="flex items-center gap-1.5"><FileText className="w-3 h-3 text-slate-300" /> {visit.type}</div>
                         </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100">
                    <Calendar className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 text-xs font-medium italic">No hay citas registradas.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-8 bg-slate-50 border-t border-slate-100 shrink-0">
             {activeTab === 'Evento' ? (
                <button 
                  onClick={() => onConfirm({
                      date: activeDateKey,
                      timeSlot: form.time,
                      type: form.type,
                      requesterName: form.requester || 'Usuario Web'
                  })}
                  className="w-full bg-brand-500 text-white font-black text-[10px] uppercase tracking-[0.2em] py-5 rounded-[1.5rem] shadow-xl shadow-brand-500/20 hover:bg-brand-600 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  Confirmar Cita <Check className="w-3 h-3" />
                </button>
             ) : (
                <button 
                  onClick={onClose}
                  className="w-full bg-slate-950 text-white font-black text-[10px] uppercase tracking-[0.2em] py-5 rounded-[1.5rem] shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  Cerrar Agenda
                </button>
             )}
          </div>
        </div>
      </div>
      {successToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[260] bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-10 duration-500">
          <div className="h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest">{successToast}</span>
        </div>
      )}
      {eventModal && (
        <div className="fixed inset-0 z-[270] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: eventModal.labelColor }} />
                <div className="text-sm font-black text-slate-900 uppercase tracking-widest">
                  {eventModal.mode === 'edit' ? 'Editar evento' : 'Nuevo evento'}
                </div>
              </div>
              <button onClick={closeEventModal} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 text-slate-500" aria-label="Cerrar">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {error && (
                <div className="mb-6 p-4 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-3 animate-in fade-in duration-200">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] font-bold text-red-600 leading-tight uppercase tracking-tight">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Título *</label>
                  <input
                    value={eventModal.title}
                    onChange={(e) => setEventModal(prev => (prev ? { ...prev, title: e.target.value } : prev))}
                    className="mt-2 w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                    placeholder="Título del evento"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Descripción</label>
                  <textarea
                    value={eventModal.description}
                    onChange={(e) => setEventModal(prev => (prev ? { ...prev, description: e.target.value } : prev))}
                    className="mt-2 w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10 min-h-[110px] resize-none"
                    placeholder="Detalles del evento"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fecha</label>
                  <input
                    type="date"
                    value={eventModal.dateKey}
                    onChange={(e) => setEventModal(prev => (prev ? { ...prev, dateKey: e.target.value } : prev))}
                    className="mt-2 w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ubicación</label>
                  <input
                    value={eventModal.location}
                    onChange={(e) => setEventModal(prev => (prev ? { ...prev, location: e.target.value } : prev))}
                    className="mt-2 w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                    placeholder="Lugar"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Inicio</label>
                  <input
                    type="time"
                    value={eventModal.startTime}
                    onChange={(e) => setEventModal(prev => (prev ? { ...prev, startTime: e.target.value } : prev))}
                    className="mt-2 w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fin</label>
                  <input
                    type="time"
                    value={eventModal.endTime}
                    onChange={(e) => setEventModal(prev => (prev ? { ...prev, endTime: e.target.value } : prev))}
                    className="mt-2 w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                  />
                </div>

                <div className="md:col-span-2 flex items-center justify-between gap-4 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Color de etiqueta</div>
                    <div className="text-xs font-bold text-slate-700 mt-1">{eventModal.labelColor}</div>
                  </div>
                  <input
                    type="color"
                    value={eventModal.labelColor}
                    onChange={(e) => setEventModal(prev => (prev ? { ...prev, labelColor: e.target.value } : prev))}
                    className="h-10 w-14 bg-transparent border-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recordatorios (min)</div>
                    <div className="text-[10px] font-bold text-slate-400">{eventModal.reminders.length}</div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {PRESET_REMINDERS.map((m) => {
                      const active = eventModal.reminders.includes(m);
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => toggleReminder(m)}
                          className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${active ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'}`}
                        >
                          {m >= 60 ? `${Math.round(m / 60)}h` : `${m}m`}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <input
                      value={customReminderMinutes}
                      onChange={(e) => setCustomReminderMinutes(e.target.value)}
                      inputMode="numeric"
                      className="flex-1 bg-white border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                      placeholder="Otro (min)"
                    />
                    <button
                      type="button"
                      onClick={addCustomReminder}
                      className="px-5 py-3 rounded-2xl bg-slate-950 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                {eventModal.mode === 'edit' && eventModal.visitId && (
                  <button
                    onClick={() => setConfirmDeleteVisitId(eventModal.visitId!)}
                    className="px-5 py-3 rounded-2xl bg-white border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all"
                    disabled={isSavingEvent}
                  >
                    Eliminar
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={closeEventModal}
                  className="px-5 py-3 rounded-2xl bg-white border border-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                  disabled={isSavingEvent}
                >
                  Cancelar
                </button>
                <button
                  onClick={upsertFromModal}
                  className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isSavingEvent ? 'bg-brand-500/60 text-white' : 'bg-brand-500 text-white hover:bg-brand-600'} `}
                  disabled={isSavingEvent}
                >
                  {eventModal.mode === 'edit' ? 'Guardar cambios' : 'Crear evento'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {confirmDeleteVisitId && (
        <div className="fixed inset-0 z-[280] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-250">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="text-sm font-black text-slate-900 uppercase tracking-widest">Confirmar eliminación</div>
              <button onClick={() => setConfirmDeleteVisitId(null)} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 text-slate-500" aria-label="Cerrar">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm font-bold text-slate-700 leading-relaxed">¿Eliminar este evento permanentemente?</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Esta acción no se puede deshacer</p>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteVisitId(null)}
                className="px-5 py-3 rounded-2xl bg-white border border-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                disabled={isSavingEvent}
              >
                Cancelar
              </button>
              <button
                onClick={() => deleteFromModal(confirmDeleteVisitId)}
                className="px-6 py-3 rounded-2xl bg-red-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all"
                disabled={isSavingEvent}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
      {touchDrag?.isDragging && draggedVisit && (
        <div
          className="fixed z-[250] pointer-events-none"
          style={{ left: touchDrag.x + 12, top: touchDrag.y + 12 }}
        >
          <div
            className="backdrop-blur rounded-2xl p-4 text-white shadow-2xl shadow-brand-500/30 border border-white/20 opacity-90 w-56"
            style={{ backgroundColor: rgbaFromHex(getVisitLabelColor(draggedVisit), 0.9) ?? 'rgba(236, 72, 153, 0.9)' }}
          >
            <div className="font-bold text-xs">{getVisitTitle(draggedVisit)}</div>
            <div className="text-[10px] opacity-90 mt-1">{draggedVisit.requesterName}</div>
            <div className="text-[8px] font-bold uppercase tracking-widest mt-2 bg-white/20 inline-block px-2 py-0.5 rounded">{draggedVisit.status === 'Confirmed' ? 'Confirmado' : 'Pendiente'}</div>
          </div>
        </div>
      )}
    </div>
  );
};
