import React, { useState } from 'react';
import { UserCheck, CheckSquare, Plus, Phone, Calendar, Clock, CheckCircle2 } from 'lucide-react';

interface StaffViewProps {
  staff: any[];
  tasks: any[];
}

export const StaffView: React.FC<StaffViewProps> = ({ staff, tasks }) => {
  const [subTab, setSubTab] = useState<'tasks' | 'employees'>('tasks');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-blue-400" />
            <span>Personnel & Tâches Quotidiennes</span>
          </h1>
          <p className="text-xs text-slate-400">
            Gestion des concierges, agents d’entretien, dépanneurs et affectation des travaux du jour
          </p>
        </div>

        <button className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-blue-500/20">
          <Plus className="h-4 w-4" />
          <span>Nouvelle Tâche</span>
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setSubTab('tasks')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
            subTab === 'tasks'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckSquare className="h-4 w-4" />
          <span>Feuille de Route & Tâches ({tasks.length})</span>
        </button>

        <button
          onClick={() => setSubTab('employees')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
            subTab === 'employees'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserCheck className="h-4 w-4" />
          <span>Employés de la Cité ({staff.length})</span>
        </button>
      </div>

      {/* 1. TASKS */}
      {subTab === 'tasks' && (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between shadow-lg"
            >
              <div className="flex items-center gap-3.5">
                <button className="h-5 w-5 rounded-lg border border-slate-600 hover:border-emerald-500 flex items-center justify-center transition">
                  {task.status === 'COMPLETED' && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                </button>
                <div>
                  <h4 className="text-xs font-bold text-white">{task.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Assigné à : <span className="text-blue-400 font-semibold">{task.assignedTo}</span> • Échéance :{' '}
                    <span className="text-amber-400 font-semibold">{task.deadline}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                    task.priority === 'URGENT'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      : task.priority === 'HIGH'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {task.priority}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                    task.status === 'COMPLETED'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}
                >
                  {task.status === 'COMPLETED' ? 'Terminé' : 'En cours'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. EMPLOYEES */}
      {subTab === 'employees' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {staff.map((s) => (
            <div
              key={s.id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between shadow-lg"
            >
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {s.functionTitle}
                </span>

                <h3 className="text-base font-bold text-white mt-2">{s.name}</h3>

                <div className="mt-3 space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone className="h-3.5 w-3.5 text-slate-500" />
                    <span className="font-mono">{s.phone}</span>
                  </div>
                  <div>
                    <span>Affectation : </span>
                    <span className="text-slate-200 font-semibold">{s.buildings.join(', ')}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500">En poste depuis {s.startDate}</span>
                <a
                  href={`tel:${s.phone}`}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition"
                >
                  Appeler
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
