import Image from 'next/image'
import React from 'react'

const screens = [
    'step-register.png',
    'step-search.png',
    'step-apply.png',
    'step-agreement.png',
]

export default function MobileShowcase() {
    return (
        <div className="pt-6 px-4">
            <div className="grid grid-cols-4 gap-2">
                {screens.map((src, i) => (
                    <div key={i} className="w-full w-full h-40 overflow-hidden">
                        <Image
                            src={src.startsWith('/') ? src : `/${src}`}
                            alt={`mobile screen ${i + 1}`}
                            width={100}
                            height={160}
                            className="w-full h-auto object-cover shadow-lg"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
