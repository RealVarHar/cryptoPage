import React from 'react'
import ThemeToggle from './ThemeToggle'



function Footer() {
  return (
    <div className='text-primary rounded-div text-xs md:text-base'>
      <div className='grid sm:grid-cols-2'>
        <div className='flex flex-col justify-evenly items-center w-full md:max-w-[300px]'>
          <span>Projekt Zespołowy 2022/2023</span>
          <div className='border border-secondary shadow-[#aaaaaa] px-1 rounded-full shadow-sm bg-primary my-3 md:my-0'>
            <ThemeToggle />
          </div>
        </div>
        <div className='flex justify-center md:justify-end w-full'>
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