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
      <div className="flex justify-between">
        {events.map((event) => (
          <div key={event.id} className="w-1/3 bg-white mx-2 rounded-lg overflow-hidden">
            <Image src={`/event-${event.id}.jpg`} alt={event.title} width={300} height={200} className="w-full" />
            <div className="p-4">
              <h3 className="font-bold">{event.title}</h3>
              <p>{event.date}</p>
              <p className="text-right">{event.price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}