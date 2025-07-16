'use client';

import Marquee from 'react-fast-marquee';
import Image from 'next/image';
import { useState } from 'react';
import { Business, BusinessClient } from '@/types/business';
import { updateDocument, getDocument } from '@/services/firestoreService';
import SectionPanel from './subComponents/SectionPanel';

import AddClientForm from './subComponents/AddClientForm';
import AdminControlsPanel from './subComponents/AdminControlsPanel';
import { Trash2 } from 'lucide-react';

interface Props {
  businessId: string;
  business?: Business;
  isAdmin: boolean;
}

export default function ClientSection({
  businessId,
  business,
  isAdmin,
}: Props) {
  const initialConfig = business?.businessConfig?.clientConfig || {};
  const [enabled, setEnabled] = useState(initialConfig.isEnabled ?? true);
  const [clients, setClients] = useState<BusinessClient[]>(
    initialConfig.clients || []
  );
  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleToggle = async (value: boolean) => {
    setUpdating(true);
    try {
      await updateDocument('businesses', businessId, {
        'businessConfig.clientConfig.isEnabled': value,
      });
      setEnabled(value);
    } catch (err) {
      console.error('Failed to toggle client section:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleAddClient = () => setAdding(true);
  const handleCancelAdd = () => setAdding(false);

  const handleSaveClient = async (newClient: BusinessClient) => {
    try {
      setUpdating(true);
      const doc = await getDocument('businesses', businessId);
      const existing = doc?.businessConfig?.clientConfig?.clients || [];
      const updated = [...existing, newClient];

      await updateDocument('businesses', businessId, {
        'businessConfig.clientConfig.isEnabled': true,
        'businessConfig.clientConfig.clients': updated,
      });

      setClients(updated);
      setAdding(false);
    } catch (err) {
      console.error('Error saving client:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (!businessId) return;
    const confirmed = confirm('Are you sure you want to delete this client?');
    if (!confirmed) return;

    try {
      setUpdating(true);
      const updated = clients.filter((c) => c.id !== id);
      await updateDocument('businesses', businessId, {
        'businessConfig.clientConfig.clients': updated,
      });
      setClients(updated);
    } catch (err) {
      console.error('Error deleting client:', err);
    } finally {
      setUpdating(false);
    }
  };

  const ClientLogo = ({ client }: { client: BusinessClient }) => (
    <div className='relative mx-8'>
      {isAdmin && (
        <button
          onClick={() => handleDeleteClient(client.id)}
          className='absolute top-1 -right-1 text-muted-foreground hover:text-destructive'
          aria-label='Delete client'
        >
          <Trash2 size={16} />
        </button>
      )}
      {client.logoUrl && (
        <Image
          src={client.logoUrl}
          alt={client.name}
          width={100}
          height={60}
          className='object-contain max-h-16'
        />
      )}
    </div>
  );

  return (
    <SectionPanel>
      <AdminControlsPanel
        isAdmin={isAdmin}
        title='Clients Settings'
        updating={updating}
        toggles={[
          {
            label: 'Enable',
            checked: enabled,
            onChange: handleToggle,
          },
        ]}
        buttons={[
          {
            label: 'Add Client',
            onClick: handleAddClient,
            disabled: !enabled,
          },
        ]}
      />

      {adding && (
        <AddClientForm
          onSave={handleSaveClient}
          onCancel={handleCancelAdd}
          loading={updating}
        />
      )}

      {enabled && clients.length > 0 && (
        <div className='mt-6 space-y-4'>
          <Marquee speed={40} gradient={false}>
            {clients.map((client) => (
              <ClientLogo key={client.id} client={client} />
            ))}
          </Marquee>
          <Marquee speed={40} gradient={false} direction='right'>
            {clients.map((client) => (
              <ClientLogo key={client.id + '_r'} client={client} />
            ))}
          </Marquee>
        </div>
      )}
    </SectionPanel>
  );
}
