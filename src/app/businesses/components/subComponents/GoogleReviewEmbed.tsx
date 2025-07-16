'use client';

interface Props {
  placeId: string;
}

export default function GoogleReviewEmbed({ placeId }: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!placeId || !apiKey) return null;

  const src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=place_id:${placeId}`;

  return (
    <div className='w-full'>
      <iframe
        src={src}
        width='100%'
        height='300'
        style={{ border: 0 }}
        loading='lazy'
        allowFullScreen
        referrerPolicy='no-referrer-when-downgrade'
      ></iframe>
    </div>
  );
}
