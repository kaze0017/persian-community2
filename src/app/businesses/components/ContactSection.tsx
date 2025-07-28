'use client';

import { useState, useEffect, useMemo } from 'react';
import { Business, BusinessContactConfig } from '@/types/business';
import { updateDocument } from '@/services/firestoreService';
import SectionPanel from './subComponents/SectionPanel';
import ContactDisplay from './subComponents/ContactDisplay';
import ContactForm from './subComponents/ContactForm';
import AdminControlsPanel from './subComponents/AdminControlsPanel';

interface Props {
  businessId: string;
  business?: Business;
  isAdmin: boolean;
}

export default function ContactSection({
  businessId,
  business,
  isAdmin,
}: Props) {
  const initialConfig = useMemo<BusinessContactConfig>(() => {
    const config = business?.businessConfig?.contactConfig || {};
    return {
      phone: config.phone || '',
      email: config.email || '',
      address: config.address || '',
      website: config.website || '',
      socialLinks: config.socialLinks || {},
    };
  }, [business?.businessConfig?.contactConfig]);

  const initialEnabled = useMemo(() => {
    return business?.businessConfig?.contactConfig?.isEnabled ?? true;
  }, [business?.businessConfig?.contactConfig?.isEnabled]);

  const [enabled, setEnabled] = useState(initialEnabled);
  const [form, setForm] = useState<BusinessContactConfig>(initialConfig);
  const [updating, setUpdating] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setEnabled(initialEnabled);
    setForm(initialConfig);
  }, [initialEnabled, initialConfig]);

  const handleToggle = async (value: boolean) => {
    setUpdating(true);
    try {
      await updateDocument('businesses', businessId, {
        'businessConfig.contactConfig.isEnabled': value,
      });
      setEnabled(value);
    } catch (error) {
      console.error('Error toggling contact section:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleFieldChange = (
    field: keyof BusinessContactConfig,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialLinkChange = (
    field: keyof NonNullable<BusinessContactConfig['socialLinks']>,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setUpdating(true);
    try {
      await updateDocument('businesses', businessId, {
        'businessConfig.contactConfig.isEnabled': enabled,
        'businessConfig.contactConfig.phone': form.phone,
        'businessConfig.contactConfig.email': form.email,
        'businessConfig.contactConfig.address': form.address,
        'businessConfig.contactConfig.website': form.website,
        'businessConfig.contactConfig.socialLinks': form.socialLinks,
      });

      setEditing(false);
    } catch (error) {
      console.error('Error saving contact config:', error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <SectionPanel>
      <AdminControlsPanel
        isAdmin={isAdmin}
        title='Contact Settings'
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
            label: 'Edit Contact',
            onClick: () => setEditing(true),
          },
        ]}
      />

      {enabled && (
        <>
          {editing ? (
            <ContactForm
              form={form}
              onChange={setForm}
              onCancel={() => setEditing(false)}
              onSave={handleSave}
              onFieldChange={handleFieldChange}
              onSocialLinkChange={handleSocialLinkChange}
              updating={updating}
            />
          ) : (
            <ContactDisplay config={form} />
          )}
        </>
      )}
    </SectionPanel>
  );
}
