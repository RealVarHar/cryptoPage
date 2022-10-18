import React from 'react'

function Footer() {
  return (
    <div class="bg-black text-white text-sm p-3">
      <div class="flex justify-end">
        <div class="flex flex-col justify-center">
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
  )
}

export default Footer