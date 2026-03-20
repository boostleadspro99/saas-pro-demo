import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function EmptyState({ title, description, icon = <Inbox className="h-12 w-12 text-slate-300" /> }: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}
