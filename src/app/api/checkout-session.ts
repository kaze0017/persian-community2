export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { ticketType, quantity } = JSON.parse(req.body);

    const origin = req.headers.origin || 'http://localhost:9002';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: ticketType.title,
            },
            unit_amount: ticketType.price * 100,
          },
          quantity,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
    });

    return res.status(200).json({ url: session.url });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
