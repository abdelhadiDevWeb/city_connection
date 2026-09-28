import React, { useState } from 'react';
import { UserCheck, CheckSquare, Plus, Phone, CheckCircle2 } from 'lucide-react';

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
          <h1 className="text-xl font-bold text-zinc-950 flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-zinc-800" />
            <span>Personnel & Tâches Quotidiennes</span>
          </h1>
          <p className="text-xs text-stone-500">
            Gestion des concierges, agents d’entretien, dépanneurs et affectation des travaux du jour
          </p>
        </div>

        <button className="pro-button-primary px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Nouvelle Tâche</span>
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
        <button
          onClick={() => setSubTab('tasks')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs transition ${
            subTab === 'tasks'
              ? 'bg-zinc-950 text-white font-semibold shadow-sm'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium'
          }`}
        >
          <CheckSquare className="h-4 w-4" />
          <span>Feuille de Route & Tâches ({tasks.length})</span>
        </button>

        <button
          onClick={() => setSubTab('employees')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs transition ${
            subTab === 'employees'
              ? 'bg-zinc-950 text-white font-semibold shadow-sm'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium'
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
              className="p-4 rounded-xl pro-card flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <button className="h-5 w-5 rounded-md border border-stone-300 hover:border-zinc-800 flex items-center justify-center transition bg-stone-50">
                  {task.status === 'COMPLETED' && <CheckCircle2 className="h-4 w-4 text-zinc-900" />}
                </button>
                <div>
                  <h4 className="text-xs font-bold text-zinc-950">{task.title}</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Assigné à : <span className="text-zinc-900 font-medium">{task.assignedTo}</span> • Échéance :{' '}
                    <span className="text-stone-700 font-medium">{task.deadline}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2.5 py-0.5 rounded-md font-medium border bg-stone-100 text-stone-800 border-stone-200">
                  {task.priority}
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-md font-medium border bg-stone-100 text-stone-800 border-stone-200">
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
              className="p-5 rounded-2xl pro-card flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-800 border border-stone-200">
                  {s.functionTitle}
                </span>

                <h3 className="text-base font-bold text-zinc-950 mt-2">{s.name}</h3>

                <div className="mt-3 space-y-1.5 text-xs text-stone-500">
                  <div className="flex items-center gap-2 text-stone-700">
                    <Phone className="h-3.5 w-3.5 text-stone-400" />
                    <span className="font-mono">{s.phone}</span>
                  </div>
                  <div>
                    <span>Affectation : </span>
                    <span className="text-zinc-900 font-medium">{s.buildings.join(', ')}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between text-xs">
                <span className="text-stone-400 text-[11px]">En poste depuis {s.startDate}</span>
                <a
                  href={`tel:${s.phone}`}
                  className="pro-button-secondary px-2.5 py-1 rounded-lg text-xs font-semibold transition"
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
