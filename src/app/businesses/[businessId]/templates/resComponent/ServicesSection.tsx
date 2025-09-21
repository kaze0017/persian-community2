import Image from 'next/image';

type Service = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
};

const services: Service[] = [
  {
    id: '1',
    title: 'Renovation & Remodeling',
    description:
      'We provide high-quality home renovation and remodeling services to modernize your space.',
    imageUrl: '/images/renovation.jpg',
  },
  {
    id: '2',
    title: 'Interior Design',
    description:
      'Custom interior design solutions tailored to your style and budget.',
    imageUrl: '/images/design.jpg',
  },
  {
    id: '3',
    title: 'Plumbing & Repairs',
    description:
      'Expert plumbing services for both minor fixes and major installations.',
    imageUrl: '/images/plumbing.jpg',
  },
];

export default function ServicesSection() {
  return (
    <section id='services' className='py-16 bg-gray-50'>
      <div className='container mx-auto px-6'>
        <h2 className='text-3xl font-bold text-center mb-12'>Our Services</h2>

        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {services.map((service) => (
            <div
              key={service.id}
              className='bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition'
            >
              <div className='relative w-full h-48'>
                <Image
                  src={service.imageUrl}
                  alt={service.title}
                  fill
                  className='object-cover'
                />
              </div>
              <div className='p-6'>
                <h3 className='text-xl font-semibold mb-2'>{service.title}</h3>
                <p className='text-gray-600'>{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
