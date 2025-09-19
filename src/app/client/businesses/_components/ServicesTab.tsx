import React from 'react';
import GlassPanel from '@/components/glassTabsComponent/GlassPanel';
import { TabsContent } from '@/components/ui/tabs';
import TabTitle from '../../../../components/glassTabsComponent/TabTitle';
import Image from 'next/image';
import AddServicesDialog from './_subComponents/AddServicesDialog';
import { BusinessService as Service } from '@/types/business';
import { filter } from '@/app/components/filters/logoFilter';
import { useAppSelector } from '@/app/hooks';

export default function ServicesTab({ businessId }: { businessId: string }) {
  const initServices = useAppSelector(
    (state) => state.clientBusiness.selectedBusiness?.services || []
  );
  console.log('Initial services:', initServices);
  const [isAdding, setIsAdding] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [serviceToEdit, setServiceToEdit] = React.useState<Service | null>(
    null
  );
  const [services, setServices] = React.useState(initServices);

  const handleAddService = () => {
    setIsAdding(true);
  };

  const handleSave = (item: Service) => {
    setServices((prev) => [...prev, item]);
    setIsAdding(false);
  };

  return (
    <>
      <TabTitle
        title='Available Services'
        hasAddBtn
        onAddType={handleAddService}
        addBtnTitle='Add New Service'
      />

      {isAdding && (
        <AddServicesDialog
          open={isAdding}
          onClose={() => setIsAdding(false)}
          businessId={businessId}
        />
      )}
      {isEditing && serviceToEdit && (
        <AddServicesDialog
          open={isEditing}
          onClose={() => {
            setIsEditing(false);
            setServiceToEdit(null);
          }}
          businessId={businessId}
          service={serviceToEdit}
        />
      )}

      {services.length === 0 ? (
        <p className='text-sm text-muted-foreground mt-4'>
          No services added yet. Click "Add New Service" to get started.
        </p>
      ) : (
        <ul className='mt-4 space-y-4'>
          {initServices.map((service) => (
            <li
              key={service.id}
              className='border-b border-foreground py-2 flex sm:flex-col md:flex-row items-start'
              onClick={() => {
                setServiceToEdit(service);
                setIsEditing(true);
              }}
            >
              <Image
                src={service.iconUrl || `/images/placeholders/service1.webp`}
                alt={service.name}
                width={100}
                height={100}
                className='w-24 h-24 object-cover rounded mr-4'
                style={{ filter: filter }}
              />
              <div className=''>
                <h3 className='font-semibold'>{service.name}</h3>
                <p className='text-sm text-muted-foreground'>
                  {service.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
