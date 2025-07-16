interface PanelHeaderProps {
  title: string;
  rightSection?: React.ReactNode;
}

export default function PanelHeader({ title, rightSection }: PanelHeaderProps) {
  return (
    <div className='flex items-center justify-between mb-6'>
      <h1 className='text-3xl font-bold tracking-tight'>{title}</h1>
      {rightSection && <div>{rightSection}</div>}
    </div>
  );
}
