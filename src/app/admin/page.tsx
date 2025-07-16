import PanelHeader from '@/components/PanelHeader';

export default function AdminDashboard() {
  return (
    <div className='space-y-2'>
      <PanelHeader title='Admin Dashboard' />
      <p className='text-muted-foreground max-w-2xl'>
        The Admin Console allows you to manage all core aspects of the platform
        based on your permissions. You can create and manage{' '}
        <strong>events</strong>, <strong>products</strong>,{' '}
        <strong>businesses</strong>, and more — with access and actions tailored
        to your authority level.
      </p>
    </div>
  );
}
