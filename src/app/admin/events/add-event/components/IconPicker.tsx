'use client';

import {
  Activity,
  Airplay,
  AlertCircle,
  AlertTriangle,
  Archive,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Bell,
  Book,
  Calendar,
  Camera,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  Edit3,
  Folder,
  Circle,
} from 'lucide-react';

export const ICONS = {
  Activity,
  Airplay,
  AlertCircle,
  AlertTriangle,
  Archive,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Bell,
  Book,
  Calendar,
  Camera,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  Edit3,
  Folder,
  Circle, // General fallback
};

type IconPickerProps = {
  selectedIcon?: string;
  onSelect: (iconName: string) => void;
};

export default function IconPicker({
  selectedIcon,
  onSelect,
}: IconPickerProps) {
  return (
    <div className='grid grid-cols-6 gap-2 max-h-48 overflow-auto p-2 border rounded'>
      {Object.entries(ICONS).map(([iconName, IconComp]) => {
        const isSelected = selectedIcon === iconName;

        return (
          <button
            key={iconName}
            type='button'
            onClick={() => onSelect(iconName)}
            className={`p-2 rounded flex justify-center items-center ${
              isSelected ? 'bg-blue-100' : 'hover:bg-gray-100'
            }`}
            title={iconName}
          >
            <IconComp className='w-5 h-5' />
          </button>
        );
      })}
    </div>
  );
}
