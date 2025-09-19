'use client';

import React, { useState } from 'react';
import GlassPanel from '@/components/glassTabsComponent/GlassPanel';
import { TabsContent } from '@/components/ui/tabs';
import TabTitle from '@/components/glassTabsComponent/TabTitle';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import AddDescriptionDialog from './_subComponents/AddDescriptionDialog';
import {
  addOrUpdateDescription,
  removeDescription,
} from '@/app/client/clientReducer/clientBusinessReducer';

export default function AboutTab({ businessId }: { businessId: string }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const description = useAppSelector(
    (state) =>
      state.clientBusiness.selectedBusiness?.businessConfig?.aboutConfig
        ?.description || ''
  );
  const dispatch = useAppDispatch();

  const openDialog = () => setDialogOpen(true);

  const handleSave = (desc: string) => {
    dispatch(addOrUpdateDescription(businessId, desc));
    setDialogOpen(false);
  };

  const handleDelete = () => {
    dispatch(removeDescription(businessId));
    setDialogOpen(false);
  };

  return (
    <>
      <TabTitle
        title='About This Business'
        hasAddBtn={true}
        addBtnTitle={description ? 'Edit Description' : 'Add Description'}
        onAddType={openDialog}
      />

      <div className='flex items-center justify-between rounded-xl border p-3 shadow-sm mt-4'>
        <p className='text-sm text-muted-foreground'>
          {description || 'No description available for this business.'}
        </p>
      </div>

      <AddDescriptionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        value={description}
        onSave={handleSave}
        onDelete={handleDelete} // optional delete button
      />
    </>
  );
}
