import ThemeToggle from './ThemeToggle.jsx'

function Footer() {
  return (
    <div className='text-primary rounded-div text-xs md:text-base'>
      <div className='grid sm:grid-cols-2'>
        <div className='flex flex-col sm:flex-row justify-center items-center w-full sm:max-w-[300px] mb-3 sm:mb-0'>
          <div className='border border-secondary shadow-[#aaaaaa] px-1 rounded-full shadow-sm bg-primary mb-4 sm:mb-0'>
            <ThemeToggle />
          </div>
          <span className='pl-0 sm:pl-4 font-bold'>Projekt Zespołowy 2022/2023</span>
        </div>
        <div className='flex justify-center items-center md:justify-end w-full'>
          <div className='flex flex-col justify-center items-center'>
            <span class="flex justify-center p-1">Zespół nr.3</span>
            <div class="flex justify-end">
              <ul class="pr-8">
                <li class="p-1 flex justify-center">Arkadiusz Wagner</li>
                <li class="p-1 flex justify-center">Dominik Kowalkowski</li>
              </ul>
              <ul>
                <li class="p-1 flex justify-center">Piotr Sapis</li>
                <li class="p-1 flex justify-center">Łukasz Latocha</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer