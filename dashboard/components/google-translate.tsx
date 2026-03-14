'use client'

import { useEffect } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    googleTranslateElementInit?: () => void
    google?: {
      translate: {
        TranslateElement: new (
          options: {
            pageLanguage: string
            includedLanguages?: string
            layout?: number
            autoDisplay?: boolean
          },
          elementId: string
        ) => void
      }
    }
  }
}

export function GoogleTranslate() {
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (window.google?.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'nl',
            autoDisplay: false,
          },
          'google_translate_element'
        )
      }
    }
  }, [])

  return (
    <>
      <div id="google_translate_element" className="hidden" />
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
      <style jsx global>{`
        .goog-te-banner-frame,
        .goog-te-balloon-frame,
        #goog-gt-tt,
        .goog-te-balloon-frame,
        .goog-tooltip,
        .goog-tooltip:hover {
          display: none !important;
        }
        
        .goog-text-highlight {
          background: none !important;
          box-shadow: none !important;
        }
        
        body {
          top: 0 !important;
        }
        
        .skiptranslate {
          display: none !important;
        }
        
        .goog-te-gadget {
          display: none !important;
        }
      `}</style>
    </>
  )
}
