export default function Hero() {
    return (
      <section className="p-8">
        <div className="flex justify-between">
          {[1, 2, 3].map((item) => (
            <div key={item} className="w-1/3 bg-gray-200 h-40 mx-2 flex flex-col justify-center items-center">
              <div className="w-16 h-16 bg-gray-400 mb-2"></div>
              <div className="w-8 h-8 bg-gray-400 rounded-full flex justify-center items-center">
                <span className="text-xs font-bold">1st</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }