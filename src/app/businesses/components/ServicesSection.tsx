'use client';

import { useState } from 'react';
import { Business, BusinessService } from '@/types/business';
import { updateDocument, getDocument } from '@/services/firestoreService';

import SectionPanel from './subComponents/SectionPanel';
import AddServiceForm from './subComponents/AddServiceForm';
import ServiceCard from './subComponents/ServiceCard';
import AdminControlsPanel from './subComponents/AdminControlsPanel';

interface Props {
  businessId: string;
  business?: Business;
  isAdmin: boolean;
}

export default function ServicesSection({
  businessId,
  business,
  isAdmin,
}: Props) {
  const initialConfig = business?.businessConfig?.servicesConfig || {};
  const [enabled, setEnabled] = useState(initialConfig.isEnabled ?? true);
  const [services, setServices] = useState<BusinessService[]>(
    initialConfig.services || []
  );
  const [updating, setUpdating] = useState(false);

  const handleToggle = async (value: boolean) => {
    setUpdating(true);
    try {
      await updateDocument('businesses', businessId, {
        'businessConfig.servicesConfig.isEnabled': value,
      });
      setEnabled(value);
    } catch (err) {
      console.error('Failed to toggle service section:', err);
    } finally {
      setUpdating(false);
    }
  };

  const [adding, setAdding] = useState(false);
  const handleAddService = () => setAdding(true);
  const handleCancelAdd = () => setAdding(false);

  const handleSaveService = async (newService: BusinessService) => {
    if (!businessId) return;

    try {
      setUpdating(true);
      const businessDoc = await getDocument('businesses', businessId);
      const existingServices =
        businessDoc?.businessConfig?.servicesConfig?.services || [];
      const updatedServices = [...existingServices, newService];

      await updateDocument('businesses', businessId, {
        'businessConfig.servicesConfig.services': updatedServices,
      });

      setServices(updatedServices);
      setAdding(false);
    } catch (error) {
      console.error('Error saving service:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!businessId) return;

    const confirmed = confirm('Are you sure you want to delete this service?');
    if (!confirmed) return;

    try {
      setUpdating(true);
      const updatedServices = services.filter((s) => s.id !== id);
      await updateDocument('businesses', businessId, {
        'businessConfig.servicesConfig.services': updatedServices,
      });
      setServices(updatedServices);
    } catch (err) {
      console.error('Failed to delete service:', err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <SectionPanel>
      <AdminControlsPanel
        isAdmin={isAdmin}
        title='Services Settings'
        updating={updating}
        toggles={[
          {
            label: 'Enable Services',
            checked: enabled,
            onChange: handleToggle,
          },
        ]}
        buttons={[
          {
            label: 'Add Service',
            onClick: handleAddService,
            disabled: !enabled,
          },
        ]}
      />

      {adding && (
        <AddServiceForm
          onSave={handleSaveService}
          onCancel={handleCancelAdd}
          loading={updating}
          businessId={businessId}
        />
      )}

      {enabled && (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6'>
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              isAdmin={isAdmin}
              onDelete={handleDeleteService}
            />
          ))}
        </div>
      )}
    </SectionPanel>
  );
}
