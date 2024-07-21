import Image from 'next/image'

const events = [
  { id: 1, title: 'FANSIGN EVENT', date: '241013 TAIPEI', price: '0.01 ETH' },
  { id: 2, title: 'SVT FANSIGN EVENT', date: '241108 TAIPEI', price: '0.02 ETH' },
  { id: 3, title: 'AESPA FANSIGN EVENT', date: '241110 TAIPEI', price: '0.03 ETH' },
]

export default function SignEvent() {
  return (
    <section className="p-8">
      <h2 className="text-2xl font-bold text-white mb-4">- Sign Event -</h2>
      <div className="flex justify-between gap-4">
        {events.map((event) => (
          <div key={event.id} className="flex-1 bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="relative w-full" style={{ paddingTop: '75%' }}>
              <Image
                src={`/event-${event.id}.jpg`}
                alt={event.title}
                layout="fill"
                objectFit="cover"
                className="absolute top-0 left-0"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold mb-2">{event.title}</h3>
              <p className="text-sm mb-2">{event.date}</p>
              <p className="text-right text-sm font-semibold">{event.price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}