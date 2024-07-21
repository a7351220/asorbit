import Image from 'next/image'

const events = [
  { id: 1, title: 'FANSIGN EVENT', date: '241013 TAIPEI', price: '0.01 ETH' },
  { id: 2, title: 'SVT FANSIGN EVENT', date: '241108 TAIPEI', price: '0.02 ETH' },
  { id: 3, title: 'AESPA FANSIGN EVENT', date: '241110 TAIPEI', price: '0.03 ETH' },
]

export default function SignEvent() {
  return (
    <section>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">- Sign Event -</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:transform hover:scale-105">
            <div className="relative w-full" style={{ paddingTop: '75%' }}>
              <Image
                src={`/event-${event.id}.jpg`}
                alt={event.title}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold mb-2">{event.title}</h3>
              <p className="text-sm sm:text-base mb-2">{event.date}</p>
              <p className="text-right text-sm sm:text-base font-semibold">{event.price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}