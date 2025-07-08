'use client';

import { useState, useEffect } from 'react';
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

const defaultValues = {
  water: { amount: 250 }, // 250ml default
  sleep: { startTime: new Date(), endTime: new Date() },
  exercise: { duration: 30, exerciseType: 'Walking' }, // 30 minutes default
  mood: { rating: 3, notes: '' }, // Neutral mood default
};

export default function LogForm({ type, onSubmit }) {
  const [details, setDetails] = useState(defaultValues[type]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Reset details and error when type changes
  useEffect(() => {
    setDetails(defaultValues[type]);
    setError('');
  }, [type]);

  function validate() {
    if (type === 'water') {
      if (!details.amount || isNaN(details.amount) || details.amount <= 0) {
        return 'Please enter a valid amount (ml) greater than 0.';
      }
    }
    if (type === 'sleep') {
      if (!details.startTime || !details.endTime) {
        return 'Please provide both start and end times.';
      }
      const start = new Date(details.startTime);
      const end = new Date(details.endTime);
      if (isNaN(start) || isNaN(end)) {
        return 'Invalid date/time.';
      }
      if (end <= start) {
        return 'End time must be after start time.';
      }
    }
    if (type === 'exercise') {
      if (!details.exerciseType) {
        return 'Please select an exercise type.';
      }
      if (!details.duration || isNaN(details.duration) || details.duration <= 0) {
        return 'Please enter a valid duration (minutes) greater than 0.';
      }
    }
    if (type === 'mood') {
      if (!details.rating || isNaN(details.rating) || details.rating < 1 || details.rating > 5) {
        return 'Please select a mood rating.';
      }
    }
    return '';
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onSubmit({ type, value: 1, details });
      setDetails(defaultValues[type]);
    } finally {
      setSubmitting(false);
    }
  };

  const renderFields = () => {
    switch (type) {
      case 'water':
        return (
          <Input
            type="number"
            min="0"
            value={details.amount}
            onChange={(e) => setDetails({ amount: parseInt(e.target.value) })}
            placeholder="Amount in ml"
            required
          />
        );
      case 'sleep':
        return (
          <div className="space-y-2">
            <Input
              type="datetime-local"
              value={
                details.startTime && details.startTime instanceof Date && !isNaN(details.startTime)
                  ? details.startTime.toISOString().slice(0, 16)
                  : ''
              }
              onChange={(e) => setDetails({
                ...details,
                startTime: new Date(e.target.value)
              })}
              required
            />
            <Input
              type="datetime-local"
              value={
                details.endTime && details.endTime instanceof Date && !isNaN(details.endTime)
                  ? details.endTime.toISOString().slice(0, 16)
                  : ''
              }
              onChange={(e) => setDetails({
                ...details,
                endTime: new Date(e.target.value)
              })}
              required
            />
          </div>
        );
      case 'exercise':
        return (
          <div className="space-y-2">
            <Select
              value={details.exerciseType}
              onChange={(e) => setDetails({
                ...details,
                exerciseType: e.target.value
              })}
              required
              options={EXERCISE_TYPES.map(type => ({ value: type, label: type }))}
            />
            <Input
              type="number"
              min="0"
              value={details.duration}
              onChange={(e) => setDetails({
                ...details,
                duration: parseInt(e.target.value)
              })}
              placeholder="Duration in minutes"
              required
            />
          </div>
        );
      case 'mood':
        return (
          <div className="space-y-2">
            <Select
              value={details.rating}
              onChange={(e) => setDetails({
                ...details,
                rating: parseInt(e.target.value)
              })}
              required
              options={MOOD_OPTIONS}
            />
            <Input
              type="text"
              value={details.notes}
              onChange={(e) => setDetails({
                ...details,
                notes: e.target.value
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
    <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-lg shadow p-4">
      {renderFields()}
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
        {submitting ? 'Adding...' : 'Add Log'}
      </Button>
    </form>
  );
}
