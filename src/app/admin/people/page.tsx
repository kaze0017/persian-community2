'use client';

import React, { useEffect, useState } from 'react';
import { PersonForm } from './components/PersonForm';
import PeopleList from './components/PeopleList';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchPeople } from './peopleThunks';
import { createPerson, editPerson } from '@/app/admin/people/peopleThunks';
import { Person } from '@/types/person';
import ListHeader from '@/components/ListHeader';

export default function PersonList() {
  const dispatch = useAppDispatch();
  const { people, loading, error } = useAppSelector((state) => state.people);

  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'Connected' | 'Not Connected' | ''>('');

  useEffect(() => {
    dispatch(fetchPeople());
  }, [dispatch]);

  if (loading) return <div>Loading people...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleSave = async (data: Partial<Person> & { file?: File }) => {
    if (editingPerson) {
      await dispatch(
        editPerson({
          id: editingPerson.id,
          updates: {
            name: data.name,
            bio: data.bio,
            email: data.email,
            linkedInUrl: data.linkedInUrl,
          },
          file: data.file,
        })
      );
    } else {
      await dispatch(
        createPerson({
          personData: {
            name: data.name ?? '',
            bio: data.bio,
            email: data.email,
            linkedInUrl: data.linkedInUrl,
            connectedWithLinkedIn: false,
          },
          file: data.file,
        })
      );
    }

    dispatch(fetchPeople());
    setShowForm(false);
    setEditingPerson(null);
  };

  const handleSendConnectionRequest = async (person: Person) => {
    if (!person.email) {
      alert('No email available for this person.');
      return;
    }
    try {
      const res = await fetch('/api/send-connection-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personId: person.id, email: person.email }),
      });
      if (res.ok) {
        alert(`Connection request sent to ${person.email}`);
      } else {
        alert('Failed to send connection request.');
      }
    } catch (error) {
      console.error(error);
      alert('Error sending connection request.');
    }
  };

  const filteredPeople: Person[] = people.filter((person) => {
    const matchesSearch = person.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter =
      filter === 'Connected'
        ? person.connectedWithLinkedIn
        : filter === 'Not Connected'
          ? !person.connectedWithLinkedIn
          : true;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className='max-w-3xl mx-auto p-4 space-y-6'>
      <ListHeader
        showAdd={true}
        onAdd={() => {
          setEditingPerson(null);
          setShowForm(true);
        }}
        showSearch={true}
        searchPlaceholder='Search instructors...'
        onSearchChange={(val) => setSearch(val)}
        showFilter={true}
        filterOptions={['Connected', 'Not Connected']}
        onFilterChange={(val) =>
          setFilter(val as 'Connected' | 'Not Connected')
        }
      />

      {showForm && (
        <PersonForm
          initialData={editingPerson || undefined}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingPerson(null);
          }}
        />
      )}

      <div className='space-y-4'>
        <PeopleList
          people={filteredPeople}
          onEdit={(person) => {
            setEditingPerson(person);
            setShowForm(true);
          }}
          onSendConnectionRequest={handleSendConnectionRequest}
        />
      </div>
    </div>
  );
}
