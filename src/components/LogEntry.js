'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button, Input, Select } from '@/components/ui';

const MOOD_OPTIONS = [
  { value: 1, label: '😢 Very Bad' },
  { value: 2, label: '😕 Bad' },
  { value: 3, label: '😐 Neutral' },
  { value: 4, label: '🙂 Good' },
  { value: 5, label: '😊 Very Good' },
];

const EXERCISE_TYPES = [
  'Walking',
  'Running',
  'Cycling',
  'Swimming',
  'Yoga',
  'Strength Training',
  'Other',
];

export default function LogEntry({ log, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLog, setEditedLog] = useState(log);

  const handleUpdate = async () => {
    await onUpdate(editedLog);
    setIsEditing(false);
  };

  const renderValue = () => {
    switch (log.type) {
      case 'water':
        return (
          <div className="text-sm">
            <p className="font-medium">{log.details.amount}ml</p>
            <p className="text-gray-500">{format(new Date(log.date), 'MMM d, yyyy h:mm a')}</p>
          </div>
        );
      case 'sleep':
        return (
          <div className="text-sm">
            <p className="font-medium">
              {format(new Date(log.details.startTime), 'h:mm a')} - 
              {format(new Date(log.details.endTime), 'h:mm a')}
            </p>
            <p className="text-gray-500">{format(new Date(log.date), 'MMM d, yyyy')}</p>
          </div>
        );
      case 'exercise':
        return (
          <div className="text-sm">
            <p className="font-medium">{log.details.exerciseType}</p>
            <p className="text-gray-500">{log.details.duration} minutes</p>
            <p className="text-gray-500">{format(new Date(log.date), 'MMM d, yyyy')}</p>
          </div>
        );
      case 'mood':
        return (
          <div className="text-sm">
            <p className="font-medium">
              {MOOD_OPTIONS.find(m => m.value === log.details.rating)?.label}
            </p>
            {log.details.notes && (
              <p className="text-gray-600">{log.details.notes}</p>
            )}
            <p className="text-gray-500">{format(new Date(log.date), 'MMM d, yyyy')}</p>
          </div>
        );
      default:
        return null;
    }
  };

  const renderEditForm = () => {
    switch (log.type) {
      case 'water':
        return (
          <Input
            type="number"
            min="0"
            value={editedLog.details.amount}
            onChange={(e) => setEditedLog({
              ...editedLog,
              details: { ...editedLog.details, amount: parseInt(e.target.value) }
            })}
            placeholder="Amount in ml"
          />
        );
      case 'sleep':
        return (
          <div className="space-y-2">
            <Input
              type="datetime-local"
              value={format(new Date(editedLog.details.startTime), "yyyy-MM-dd'T'HH:mm")}
              onChange={(e) => setEditedLog({
                ...editedLog,
                details: { ...editedLog.details, startTime: new Date(e.target.value) }
              })}
            />
            <Input
              type="datetime-local"
              value={format(new Date(editedLog.details.endTime), "yyyy-MM-dd'T'HH:mm")}
              onChange={(e) => setEditedLog({
                ...editedLog,
                details: { ...editedLog.details, endTime: new Date(e.target.value) }
              })}
            />
          </div>
        );
      case 'exercise':
        return (
          <div className="space-y-2">
            <Select
              value={editedLog.details.exerciseType}
              onChange={(e) => setEditedLog({
                ...editedLog,
                details: { ...editedLog.details, exerciseType: e.target.value }
              })}
            >
              {EXERCISE_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Select>
            <Input
              type="number"
              min="0"
              value={editedLog.details.duration}
              onChange={(e) => setEditedLog({
                ...editedLog,
                details: { ...editedLog.details, duration: parseInt(e.target.value) }
              })}
              placeholder="Duration in minutes"
            />
          </div>
        );
      case 'mood':
        return (
          <div className="space-y-2">
            <Select
              value={editedLog.details.rating}
              onChange={(e) => setEditedLog({
                ...editedLog,
                details: { ...editedLog.details, rating: parseInt(e.target.value) }
              })}
            >
              {MOOD_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Input
              type="text"
              value={editedLog.details.notes || ''}
              onChange={(e) => setEditedLog({
                ...editedLog,
                details: { ...editedLog.details, notes: e.target.value }
              })}
              placeholder="Add notes (optional)"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-start justify-between p-4 bg-white rounded-lg shadow">
      <div className="flex-grow">
        {isEditing ? renderEditForm() : renderValue()}
      </div>
      <div className="ml-4 flex space-x-2">
        {isEditing ? (
          <>
            <Button
              onClick={handleUpdate}
              className="p-1"
              variant="primary"
            >
              <CheckIcon className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => {
                setEditedLog(log);
                setIsEditing(false);
              }}
              className="p-1"
              variant="secondary"
            >
              <XMarkIcon className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => setIsEditing(true)}
              className="p-1"
              variant="secondary"
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => onDelete(log._id)}
              className="p-1"
              variant="danger"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
