'use client';

import { useState } from 'react';
import { Business, BusinessReward } from '@/types/business';
import { updateDocument2, getDocument } from '@/services/firestoreService';

import SectionPanel from './subComponents/SectionPanel';
import AddRewardForm from './subComponents/AddRewardForm';
import AwardCard from './subComponents/AwardCard';
import AdminControlsPanel from './subComponents/AdminControlsPanel';

interface Props {
  businessId: string;
  business?: Business;
  isAdmin: boolean;
}

export default function AwardsSection({
  businessId,
  business,
  isAdmin,
}: Props) {
  const initialConfig = business?.businessConfig?.rewardsConfig || {};
  const [enabled, setEnabled] = useState(initialConfig.isEnabled ?? true);
  const [rewards, setRewards] = useState<BusinessReward[]>(
    initialConfig.rewards || []
  );
  const [updating, setUpdating] = useState(false);

  const handleToggle = async (value: boolean) => {
    setUpdating(true);
    try {
      await updateDocument2('businesses', businessId, {
        'businessConfig.rewardsConfig.isEnabled': value,
      });
      setEnabled(value);
    } catch (err) {
      console.error('Failed to toggle rewards section:', err);
    } finally {
      setUpdating(false);
    }
  };

  const [adding, setAdding] = useState(false);
  const handleAddReward = () => setAdding(true);
  const handleCancelAdd = () => setAdding(false);

  const handleSaveReward = async (newReward: BusinessReward) => {
    if (!businessId) return;

    try {
      setUpdating(true);
      const businessDoc = await getDocument('businesses', businessId);
      const existingRewards =
        businessDoc?.businessConfig?.rewardsConfig?.rewards || [];

      const updatedRewards: BusinessReward[] = [...existingRewards, newReward];

      await updateDocument2('businesses', businessId, {
        'businessConfig.rewardsConfig.rewards': updatedRewards,
      });

      setRewards(updatedRewards);
      setAdding(false);
    } catch (error) {
      console.error('Error saving reward:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteReward = async (id: string) => {
    if (!businessId) return;

    const confirmed = confirm('Are you sure you want to delete this reward?');
    if (!confirmed) return;

    try {
      setUpdating(true);
      const updatedRewards = rewards.filter((r) => r.id !== id);

      await updateDocument2('businesses', businessId, {
        'businessConfig.rewardsConfig.rewards': updatedRewards,
      });

      setRewards(updatedRewards);
    } catch (error) {
      console.error('Error deleting reward:', error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <SectionPanel>
      <AdminControlsPanel
        isAdmin={isAdmin}
        title='Rewards Settings'
        updating={updating}
        toggles={[
          {
            label: 'Enable Rewards',
            checked: enabled,
            onChange: handleToggle,
          },
        ]}
        buttons={[
          {
            label: 'Add Reward',
            onClick: handleAddReward,
            disabled: !enabled,
          },
        ]}
      />

      {adding && (
        <AddRewardForm
          onSave={handleSaveReward}
          onCancel={handleCancelAdd}
          loading={updating}
          businessId={businessId}
        />
      )}

      {enabled && (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6'>
          {rewards.map((reward) => (
            <AwardCard
              key={reward.id}
              reward={reward}
              isAdmin={isAdmin}
              onDelete={handleDeleteReward}
            />
          ))}
        </div>
      )}
    </SectionPanel>
  );
}
